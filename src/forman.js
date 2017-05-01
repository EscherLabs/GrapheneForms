var forman = function(data, target){
    //initalize form
    this.options = _.assignIn({legend: '', data:{}}, this.opts, data);
    this.el = document.querySelector(target || data.el);
    this.el.innerHTML = forman.stencils.container(this.options);
    this.container = this.el.querySelector((target || data.el) + ' form')
    //initialize individual fields
    this.fields = _.map(this.options.fields, forman.initialize.bind(this, this, this.options.data||{}, null, null))
    _.each(this.fields, forman.fill.bind(this, this.options.data||{}))

    //create all elements
    _.each(this.fields, function(field) {
		field.owner.events.trigger('change:'+field.name, field);
    })
    
    //parse form values into JSON object
    var toJSON = function(name) {
        if(typeof name == 'string') {
            return _.find(this.fields, {name: name}).get();
        }
        var obj = {};
        _.each(this.fields, function(field) {       
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
}


forman.fill = function(atts, fieldIn, ind, list) {
    // if(field.array && typeof atts[field.name] == 'object'){
    //     field.value =  atts[field.name][index||0];
    // }


    var field = _.findLast(list,{name:_.uniqBy(list,'name')[ind].name});
    if(!field.array && field.fields){
        _.each(field.fields, forman.fill.bind(this, atts[field.name]||{}) );
    }
    if(field.array && typeof atts[field.name] == 'object') {

        if(atts[field.name].length >1){

            for(var i = 1; i<atts[field.name].length; i++) {
                var newfield = forman.initialize.call(this, field.parent, atts, field.el,i, field.item);
                field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id}), 0, newfield)
                field = newfield;
                // if(field.array){
                //     _.each(field.fields, forman.fill.bind(this, atts[_.findIndex(field.parent.fields, {id: field.id})]||{}) );
                // }
            }
        }
    }
}


forman.initialize = function(parent, atts, target,index, fieldIn ) {
    var field = _.assignIn({
        name: (fieldIn.label||'').toLowerCase().split(' ').join('_'), 
        id: forman.getUID(), 
        type: 'text', 
        extends: 'basic', 
        label: fieldIn.legend || fieldIn.name,
        validate: false,
        valid: true,
        parent: parent,
        array:false,
        columns:12
    }, fieldIn)
    
    field.item = fieldIn;
    if(field.array && typeof atts[field.name] == 'object'){
        field.value =  atts[field.name][index||0];
    }else{
        field.value =  atts[field.name] || field.value || field.default;
    }
    field.owner = this;

    field.satisfied = function(value){
        return (typeof value !== 'undefined' && value !== null && value !== '');
    }.bind(field)
    field.set = function(value){
        this.el.querySelector('[name="' + this.name + '"]').value = value;
        _.each(this.options, function(option, index){
            if(option.value == value) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
        }.bind(this))
    }.bind(field)
    field.get = function(){
        return this.el.querySelector('[name="' + this.name + '"]').checked || this.el.querySelector('[name="' + this.name + '"]').value;
    }.bind(field)
    forman.processConditions.call(field, field.display,function(result){
        this.el.style.display = result ? "block" : "none";
    }.bind(field))      
    forman.processConditions.call(field, field.visible,function(result){
        this.el.style.visibility = result ? "visible" : "hidden";
    }.bind(field))
    forman.processConditions.call(field, field.enable,function(result){
        this.enabled = result;
    }.bind(field))
    forman.processConditions.call(field, field.parsable,function(result){
        this.el.style.parsable = result
    }.bind(field))


    if(field.type == 'select' || field.type == 'radio') {
        field = _.assignIn(field, forman.processOptions.call(this, field));
    }

    field.el = document.createElement("span");
    field.el.setAttribute("id", field.id);
    field.el.setAttribute("class", ' '+forman.columnMap[field.columns]);
    field.el.innerHTML = (forman.stencils[field.type] || forman.stencils.text)(field);

    field.container =  field.el.querySelector('fieldset') || field.el;

    if (target == null){
        field.parent.container.appendChild(field.el);
    } else {
        field.parent.container.insertBefore(field.el, target.nextSibling);
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
    



    if(field.onchange !== undefined){ field.el.addEventListener('change', this.onchange);}
    field.el.addEventListener('change', function(){
        this.value = this.get();
        this.owner.events.trigger('change:'+this.name, this);
        this.owner.events.trigger('change', this);
    }.bind(field));		
    field.el.addEventListener('input', function(){
        this.value = this.get();
        this.owner.events.trigger('change:'+this.name, this);
        this.owner.events.trigger('change', this);
    }.bind(field));
    var add = field.el.querySelector('.forman-add');
    if(add !== null){
        add.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true < (field.array.max || 5)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                var atts = {};
                // atts[field.name] = field.value;
                var newField = forman.initialize.call(this, field.parent, atts, field.el ,null, field.item);
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
                _.each(['change', 'change:'+field.name, 'removed:'+field.name], _.partialRight(this.trigger, field) )

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

            field.fields = _.map(field.fields, forman.initialize.bind(this, field, newatts, null, null) );
                 if(field.array){
                    _.each(field.fields, forman.fill.bind(this, newatts) );
                }
        
    }
   

    return field;
}

forman.update = function(field){
    field.el.innerHTML = (forman.stencils[field.type] || forman.stencils.text)(field);
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
		field.options.push(field.default);
	}

    return field;
}

forman.i = 0;
forman.getUID = function() {
    return 'f' + (forman.i++);
};