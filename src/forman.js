var forman = function(data, el){
    "use strict";
    
    //initalize form
    this.options = _.assignIn({legend: '', data:{}, columns:forman.columns},this.opts, data);
    this.el = document.querySelector(el || data.el);
    this.el.innerHTML = forman.render('container', this.options);
    this.container = this.el.querySelector((el || data.el) + ' form');

    //parse form values into JSON object
    var toJSON = function(name) {
        if(typeof name == 'string') {
            return _.find(this.fields, {name: name}).get();
        }
        var obj = {};
        _.each(this.fields, function(field) {
            if(field.parsable){
                if(field.fields){
                    if(field.array){
                        obj[field.name] = obj[field.name] || [];
                        obj[field.name].unshift(toJSON.call(field));
                    }else{
                        obj[field.name] = toJSON.call(field);
                    }
                }else{
                    if(field.array){
                        obj[field.name] = obj[field.name] || [];
                        obj[field.name].unshift(field.get());
                    }else{
                        obj[field.name] = field.get();
                    }
                }
            }
        }.bind(this))
        return obj;
    }
    this.toJSON = toJSON.bind(this);
    this.set = function(name,value) {
        _.find(this.fields, {name: name}).set(value);
    }.bind(this),
    this.field = function(name){
        return _.find(this.fields,{name:name})
    }.bind(this)
    this.on = this.events.on;
    this.trigger = this.events.trigger;
    this.debounce = this.events.debounce;
    this.fields = _.map(this.options.fields, forman.createField.bind(this, this, this.options.data||{}, null, null))
    _.each(this.fields, forman.inflate.bind(this, this.options.data||{}))
    _.each(this.fields, function(field) {
		field.owner.events.trigger('change:' + field.name, field);
    })
    this.isActive = true;
    this.active = function(){return this.isActive}
}

//creates multiple instances of duplicatable fields if input attributes exist for them
forman.inflate = function(atts, fieldIn, ind, list) {
    var field;    
    if(fieldIn.array){
        field = _.findLast(list, {name: _.uniqBy(list,'name')[ind].name});
    }else{
        field = _.findLast(list, {name:list[ind].name});
    }
    if(!field.array && field.fields){
        _.each(field.fields, forman.inflate.bind(this, atts[field.name] || {}) );
    }
    if(field.array && typeof atts[field.name] == 'object') {
        if(atts[field.name].length > 1){
            for(var i = 1; i<atts[field.name].length; i++) {
                var newfield = forman.createField.call(this, field.parent, atts, field.el, i, field.item);
                field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id}), 0, newfield)
                field = newfield;
            }
        }
    }
}

forman.createField = function(parent, atts, el, index, fieldIn ) {
    fieldIn.type = fieldIn.type || 'text';
    //work forman.default in here
    var field = _.assignIn({
        name: (fieldIn.label||'').toLowerCase().split(' ').join('_'), 
        id: forman.getUID(), 
        // type: 'text', 
        label: fieldIn.legend || fieldIn.name,
        validate: false,
        valid: true,
        parsable:true,
        visible:true,
        enabled:true,
        parent: parent,
        array:false,
        columns: this.options.columns,
        offset: 0
    },forman.types[fieldIn.type].defaults, fieldIn)
    // field = _.assignIn(forman.types[field.type].defaults,field)
    field.item = fieldIn;
    field.owner = this;
	if(field.columns > this.options.columns) { field.columns = this.options.columns; }
    
    if(field.array && typeof atts[field.name] == 'object'){
        field.value =  atts[field.name][index||0];
    }else{
        field.value =  atts[field.name] || field.value || field.default;
    }

	if(field.item.value !== 0){
        if(field.array && typeof atts[field.name] == 'object'){
            field.value =  atts[field.name][index||0];
        }else{
            if(typeof field.item.value === 'function') {
                //uncomment this when ready to test function as value for input
                field.valueFunc = item.value;
                field.derivedValue = function() {
                    return field.valueFunc.call(field.owner.toJSON());
                };
                field.item.value = field.item.value = field.derivedValue();
                field.owner.on('change', function(){
                    this.set(this.derivedValue());
                }.bind(field));
            } else {
                //may need to search deeper in atts?
                field.value =  atts[field.name] || field.value || field.default || '';
            }  
        }
	} else {
		field.value = 0;
	}

    field.satisfied = forman.types[field.type].satisfied.bind(field);

    field.active = function() {
		return this.parent.active() && this.enabled && this.parsable && this.visible;
	}
    field.set = function(value, silent){
        //not sure we should be excluding objects - test how to allow objects
        if(this.value != value && typeof value !== 'object') {
            this.value = value;
            forman.types[this.type].set(value);
			if(!silent){this.trigger('change')};
		}
    }.bind(field)

    field.get = forman.types[field.type].get.bind(field);

    if(field.type == 'select' || field.type == 'radio') {
        field = _.assignIn(field, forman.processOptions.call(this, field));
    }
    
    field.render = forman.types[field.type].render.bind(field);
    
    field.el = forman.types[field.type].create.call(field);

    field.container =  field.el.querySelector('fieldset') || field.el;

    if (el == null){
        field.parent.container.appendChild(field.el);
    } else {
        field.parent.container.insertBefore(field.el, el.nextSibling);
    }

    // if(field.type !== 'fieldset' ||  field.isChild() || !this.sectionsEnabled) {
    // 	var cRow;
    // 	if(typeof $(field.fieldset).children('.row').last().attr('id') !== 'undefined') {
    // 		cRow = rows[$(field.fieldset).children('.row').last().attr('id')];		
    // 	}
    // 	if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > this.options.columns){
    // 		var temp = Berry.getUID();
    // 		cRow = {};
    // 		cRow.used = 0;
    // 		cRow.ref = $(Berry.render('berry_row', {id: temp}));
    // 		rows[temp] = cRow;
    // 		$(field.fieldset).append(cRow.ref);
    // 	}
    // 	cRow.used += parseInt(field.columns, 10);
    // 	cRow.used += parseInt(field.offset, 10);
    // 	cRow.ref.append( $('<div/>').addClass('col-md-' + field.columns).addClass('col-md-offset-' + field.offset).append(field.render()) );
    // }else{
    // 	$(field.fieldset).append(field.render() );
    // }
    
    forman.types[field.type].initialize.call(field);

    var add = field.el.querySelector('.forman-add');
    if(add !== null){
        add.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true < (field.array.max || 5)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                var atts = {};
                // atts[field.name] = field.value;
                var newField = forman.createField.call(this, field.parent, atts, field.el ,null, field.item);
                field.parent.fields.splice(index, 0, newField)
                newField.el.querySelector('[name="'+field.name+'"]').focus();

                _.each(['change', 'change:'+field.name, 'create:'+field.name, 'inserted:'+field.name], _.partialRight(this.trigger, field) )
            }
        }.bind(this, field));
    }
    var minus = field.el.querySelector('.forman-minus');
    if(minus !== null){
        minus.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true > (field.array.min || 1)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                field.parent.fields.splice(index, 1);
                field.parent.container.removeChild(field.el);
                _.each(['change', 'change:' + field.name, 'removed:' + field.name], _.partialRight(this.trigger, field) )
            }else{
                field.set(null);
            }
        }.bind(this, field));
    }
    if(field.fields){
        var newatts = {};
            if(field.array && typeof atts[field.name] == 'object'){
                newatts =  atts[field.name][index||0];
            }else{
                newatts = atts[field.name]||{};
            }

            field.fields = _.map(field.fields, forman.createField.bind(this, field, newatts, null, null) );
                 if(field.array){
                    _.each(field.fields, forman.inflate.bind(this, newatts) );
                }
        
    }

    forman.processConditions.call(field, field.display, function(result){
        this.el.style.display = result ? "block" : "none";
        this.visible = result;        
    })      
    // forman.processConditions.call(field, field.visible, function(result){
    //     this.el.style.visibility = result ? "visible" : "hidden";
    //     this.visible = result;
    // })
    
    forman.processConditions.call(field, field.enable, function(result){
        this.enabled = result;        
        forman.types[this.type].enable.call(this,this.enabled);
    })
    forman.processConditions.call(field, field.parse, function(result){
        this.parsable = result
    })

    return field;
}

forman.update = function(field){
    field.el.innerHTML = field.render();
    var oldDiv = document.getElementById(field.id);
    oldDiv.parentNode.replaceChild(field.el, oldDiv);
}

forman.ajax = function(options){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState === 4) {
            if(request.status === 200) { 
                options.success(JSON.parse(request.responseText));
            } else {
                console.log(request.responseText);
                // options.error(request.responseText);
            } 
        }
    }
    request.open(options.verb || 'GET', options.path);
    request.send();
}

forman.default= {label_key: 'label', value_key: 'value'}
forman.prototype.opts = {
    suffix: ':',
    required: '<span style="color:red">*</span>'
}

/* Process the options of a field for normalization */
forman.processOptions = function(field) {
    if(typeof field.options == 'function') {
        field.action = field.options;
        field.options = field.action.call(this, field);
    }
	if(typeof field.options == 'string') {
        field.path = field.options;
        field.options = false;
        forman.ajax({path: field.path, success:function(field, data) {
            field.options = data;  
            field = forman.processOptions(field);
            forman.update(field)
        }.bind(null, field )})
		return field;
	}
    field = _.assignIn({options: []}, forman.default, field);

	// If max is set on the field, assume a number set is desired. 
	// min defaults to 0 and the step defaults to 1.
	if(typeof field.max !== 'undefined') {
		field.min = (field.min || 0);
		field.step = (field.step || 1)
        var i = field.min;
        while(i <= field.max) {
            field.options.push(i.toString());
            i+=field.step;
        }
	}
    field.options =  _.map(field.options, function(item, i){
        if(typeof item === 'string' || typeof item === 'number') {
            item = {label: item};
           	if(this.value_key !== 'index'){
				item.value = item.label;
            }
        }
        var temp = _.assignIn({label: item[field.label_key], value: item[field.value_key] || i }, item);
        if(temp.value == field.value) { temp.selected = true;}
        return temp;
    }.bind(field))
    
    if(typeof field.default !== 'undefined' && field.options[0] !== field.default) {
		field.options.unshift(field.default);
	}

    return field;
}

forman.types = {
    'basic':{
        defaults:{},
        create: function(){
            var tempEl = document.createElement("span");
            tempEl.setAttribute("id", this.id);
            tempEl.setAttribute("class", ' '+forman.columnClasses[this.columns]);
            tempEl.innerHTML = this.render();
            return tempEl;
        },
        render: function(){
            return forman.render(this.type, this);
        },
        initialize: function(){
            if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
            this.el.addEventListener('change', function(){
                this.value = this.get();
                this.owner.events.trigger('change:'+this.name, this);
                this.owner.events.trigger('change', this);
            }.bind(this));		
            this.el.addEventListener('input', function(){
                this.value = this.get();
                this.owner.events.trigger('change:'+this.name, this);
                this.owner.events.trigger('change', this);
            }.bind(this));
        },
        get: function(){
            return this.el.querySelector('[name="' + this.name + '"]').checked || this.el.querySelector('[name="' + this.name + '"]').value;
        },
        set: function(value){
            this.el.querySelector('[name="' + this.name + '"]').value = value;
            _.each(this.options, function(option, index){
                if(option.value == value) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
            }.bind(this))
        },
        satisfied: function(value){
            return (typeof value !== 'undefined' && value !== null && value !== '');            
        },
        enable: function(state){
            this.el.querySelector('input').disabled = !state;            
        }
        //display
    },
};
forman.i = 0;
forman.getUID = function() {
    return 'f' + (forman.i++);
};


forman.types['text'] = forman.types['checkbox'] = forman.types['select'] = forman.types['fieldset'] = forman.types['color'] = forman.types['basic'];
// forman.types['email'] = _.extend(forman.types['basic'],{});
forman.types['email'] = _.extend(forman.types['basic'],{defaults:{validate: { 'valid_email': true }}});
