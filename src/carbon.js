function mustache(l,a,m,c){function h(a,b){b=b.pop?b:b.split(".");a=a[b.shift()]||"";return 0 in b?h(a,b):a}var k=mustache,e="";a=Array.isArray(a)?a:a?[a]:[];a=c?0 in a?[]:[1]:a;for(c=0;c<a.length;c++){var d="",f=0,n,b="object"==typeof a[c]?a[c]:{},b=Object.assign({},m,b);b[""]={"":a[c]};l.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,function(a,c,l,m,p,q,g){f?d+=f&&!p||1<f?a:c:(e+=c.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,function(a,c,e,f,g,d){return c?h(b,c):f?h(b,d):g?k(h(b,d),b):e?"":(new Option(h(b,d))).innerHTML}),n=q);p?--f||(g=h(b,g),e=/^f/.test(typeof g)?e+g.call(b,d,function(a){return k(a,b)}):e+k(d,g,b,n),d=""):++f})}return e}

var carbon = function(data, el){
    "use strict";
    
    //initalize form
    this.options = _.assignIn({legend: '', data:{}, columns:carbon.columns,name: carbon.getUID()},this.opts, data);
    this.el = document.querySelector(el || data.el);
    this.on = this.events.on;
    this.trigger = this.events.trigger;
    this.debounce = this.events.debounce;

    this.trigger('initialize');
    
    //set flag on all root fieldsets as a section
    if(this.options.sections){
        _.each(_.filter(this.options.fields,{type:'fieldset'}),function(item,i){
            item.index = i;
            item.section = true;
            // item.text = item.legend || item.label || i;
        return item})
    }
    

    var create = function(){
        if(this.options.clear) {
            this.el.innerHTML = carbon.render(this.options.sections+'_container', this.options);
        }
    
        this.container = this.el.querySelector((el || data.el) + ' form') || this.el;
        this.rows = {};
        this.fields = _.map(this.options.fields, carbon.createField.bind(this, this, this.options.data||{}, null, null))
        _.each(this.fields, carbon.inflate.bind(this, this.options.data||{}))
        _.each(this.fields, function(field) {
            field.owner.events.trigger('change:' + field.name, field);
        })
        carbon.instances[this.options.name] = this;
        
    }

    this.restore = create.bind(this);


    //parse form values into JSON object
    var toJSON = function(name) {
        if(typeof name == 'string') {
            return _.find(this.fields, {name: name}).get();
        }
        var obj = {};
        _.each(this.fields, function(field) {
            if(field.isParsable){
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

    create.call(this)
    this.set = function(name,value) {
        _.find(this.fields, {name: name}).set(value);
    }.bind(this),
    this.field = function(name){
        return _.find(this.fields,{name:name})
    }.bind(this)

    this.isActive = true;
    this.active = function(){return this.isActive}

    this.destroy = function() {
		this.trigger('destroy');

		//Trigger the destroy methods for each field
		// _.each(function() {if(typeof this.destroy === 'function') {this.destroy();}});
		//Clean up affected containers
		this.el.innerHTML = "";
		// for(var i = this.fieldsets.length-1;i >=0; i--) { $(this.fieldsets[i]).empty(); }

		//Dispatch the destroy method of the renderer we used
		// if(typeof this.renderer.destroy === 'function') { this.renderer.destroy(); }

		//Remove the global reference to our form
		delete carbon.instances[this.options.name];

		this.trigger('destroyed');
	};

    
}
carbon.instances = {};
//creates multiple instances of duplicatable fields if input attributes exist for them
carbon.inflate = function(atts, fieldIn, ind, list) {
    var field;    
    if(fieldIn.array){
        field = _.findLast(list, {name: _.uniqBy(list,'name')[ind].name});
    }else{
        field = _.findLast(list, {name:list[ind].name});
    }
    if(!field.array && field.fields){
        _.each(field.fields, carbon.inflate.bind(this, atts[field.name] || {}) );
    }
    if(field.array && typeof atts[field.name] == 'object') {
        if(atts[field.name].length > 1){
            for(var i = 1; i<atts[field.name].length; i++) {
                var newfield = carbon.createField.call(this, field.parent, atts, field.el, i, field.item);
                field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id})+1, 0, newfield)
                field = newfield;
            }
        }
    }
}

carbon.createField = function(parent, atts, el, index, fieldIn ) {
    fieldIn.type = fieldIn.type || 'text';
    //work carbon.default in here
    var field = _.assignIn({
        name: (fieldIn.label||'').toLowerCase().split(' ').join('_'), 
        id: carbon.getUID(), 
        // type: 'text', 
        label: fieldIn.legend || fieldIn.name,
        validate: false,
        valid: true,
        isParsable:true,
        isVisible:true,
        isEnabled:true,
        parent: parent,
        array:false,
        columns: this.options.columns,
        offset: 0,
        isChild:!(parent instanceof carbon)        
    }, carbon.types[fieldIn.type].defaults, fieldIn)
    
    if(field.name == ''){field.name = field.id;}
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

    field.satisfied = field.satisfied || carbon.types[field.type].satisfied.bind(field);
    field.update = carbon.types[field.type].update.bind(field);
    field.destroy = carbon.types[field.type].destroy.bind(field);
    
    field.active = function() {
		return this.parent.active() && this.isEnabled && this.isParsable && this.isVisible;
	}
    field.set = function(value, silent){
        //not sure we should be excluding objects - test how to allow objects
        if(this.value != value && typeof value !== 'object') {
            this.value = value;
            carbon.types[this.type].set(value);
			if(!silent){this.trigger('change')};
		}
    }.bind(field)

    field.get = carbon.types[field.type].get.bind(field);
    
    field.render = carbon.types[field.type].render.bind(field);
    
    field.el = carbon.types[field.type].create.call(field);

    field.container =  field.el.querySelector('fieldset') || null;

    if(!field.target && (this.options.clear || field.isChild)){
        var cRow;
        // cRow = field.owner.rows[field.owner.rows.length-1];
        var formRows = field.parent.container.querySelectorAll('form > .row,fieldset > .row');
        var temp =(formRows[formRows.length-1] || {}).id;
        if(typeof temp !== 'undefined') {
            cRow = field.parent.rows[temp];	
        }
        if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > this.options.columns){
            var temp = carbon.getUID();
            cRow = {};
            cRow.used = 0;
            cRow.ref  = document.createElement("div");
            cRow.ref.setAttribute("id", temp);
            cRow.ref.setAttribute("class", 'row');
            field.parent.rows[temp] = cRow;
            field.parent.container.appendChild(cRow.ref);
        }
        cRow.used += parseInt(field.columns, 10);
        cRow.used += parseInt(field.offset, 10);
        cRow.ref.appendChild(field.el);
        field.row = temp;
    }else{
        if(!field.target){
            field.target = '[name="'+field.name+'"]';
        }
        var temp = this.container.querySelector(field.target)
        if(typeof temp !== 'undefined' && temp !== null    ){
            temp.appendChild(field.el);
        }
       
    }
    // }
    // else{
    //         field.rows = {};

    //     if (el == null){
    //         field.parent.container.appendChild(field.el);
    //     } else {
    //         field.parent.container.insertBefore(field.el, el.nextSibling);
    //     }
    // }


    carbon.types[field.type].initialize.call(field);

    var add = field.el.querySelector('.carbon-add');
    if(add !== null){
        add.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true < (field.array.max || 5)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                var atts = {};
                // atts[field.name] = field.value;
                var newField = carbon.createField.call(this, field.parent, atts, field.el ,null, field.item);
                field.parent.fields.splice(index+1, 0, newField)
                newField.el.querySelector('[name="'+field.name+'"]').focus();

                _.each(['change', 'change:'+field.name, 'create:'+field.name, 'inserted:'+field.name], _.partialRight(this.trigger, field) )
            }
        }.bind(this, field));
    }
    var minus = field.el.querySelector('.carbon-minus');
    if(minus !== null){
        minus.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true > (field.array.min || 1)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                field.parent.fields.splice(index, 1);
                if(!field.target){
                    field.parent.rows[field.row].used -= (field.offset + field.columns)
                    field.parent.rows[field.row].ref.removeChild(field.el);
                    if(field.parent.rows[field.row].used  == 0){
                        field.parent.container.removeChild(field.parent.rows[field.row].ref);
                    }
                }else{
                    this.container.querySelector(field.target).removeChild(field.el);
                }
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

            field.fields = _.map(field.fields, carbon.createField.bind(this, field, newatts, null, null) );
                 if(field.array){
                    _.each(field.fields, carbon.inflate.bind(this, newatts) );
                }
        
    }

    carbon.processConditions.call(field, field.display, function(result){
        this.el.style.display = result ? "block" : "none";
        this.isVisible = result;        
    })      
    // carbon.processConditions.call(field, field.isVisible, function(result){
    //     this.el.style.visibility = result ? "isVisible" : "hidden";
    //     this.isVisible = result;
    // })
    
    carbon.processConditions.call(field, field.enable, function(result){
        this.isEnabled = result;        
        carbon.types[this.type].enable.call(this,this.isEnabled);
    })
    carbon.processConditions.call(field, field.parse, function(result){
        this.isParsable = result
    })
    carbon.processConditions.call(field, field.required, function(result){
        this.validate.required = result
        this.update();
    })

    return field;
}

// carbon.update = function(field){
//     field.el.innerHTML = carbon.types[field.type].render.call(field);
//     var oldDiv = document.getElementById(field.id);
//     if(oldDiv == null){
//         // oldDiv.parentNode.appendChild(field.el, oldDiv);
        
//     }else{
//         oldDiv.parentNode.replaceChild(field.el, oldDiv);
//     }
// }

carbon.ajax = function(options){
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

carbon.default ={format:{label: '{{label}}', value: '{{value}}'}} 
carbon.prototype.opts = {
    clear:true,
    sections:'',
    suffix: ':',
    required: '<span style="color:red">*</span>'
}

/* Process the options of a field for normalization */
carbon.options = function(field) {
    if(typeof field.options == 'function') {
        field.action = field.options;
        field.options = field.action.call(this, field);
    }
	if(typeof field.options == 'string') {
        field.path = field.options;
        field.options = false;
        carbon.ajax({path: field.path, success:function(field, data) {
            field.options = data;  
            field = carbon.options(field);
            // carbon.update(field)
            field.update()
        }.bind(null, field )})
		return field;
    }
    field = _.merge({options: []}, carbon.default, field);

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
    if(typeof field.default !== 'undefined' && field.options[0] !== field.default) {
		field.options.unshift(field.default);
	}
    field.options =  _.map(field.options, function(item, i){
        if(typeof item === 'string' || typeof item === 'number') {
            item = {label: item};
           	if(this.format.value !== '{{index}}'){
				item.value = item.label;
            }
        }
        item.index = item.index || ""+i;
        var temp = _.assignIn(item,{label: carbon.renderString(field.format.label,item), value: carbon.renderString(field.format.value,item) });
        
        if(temp.value == field.value) { temp.selected = true;}
        return temp;
    }.bind(field))
    return field;
}
carbon.VERSION = '0.0.0.1';
carbon.i = 0;
carbon.getUID = function() {
    return 'f' + (carbon.i++);
};

carbon.types = {
    'input':{
        defaults:{},
        create: function(){
            var tempEl = document.createElement("span");
            tempEl.setAttribute("id", this.id);
            // tempEl.setAttribute("data-columns", this.columns);
            tempEl.setAttribute("class", ' '+carbon.columnClasses[this.columns]);
            tempEl.innerHTML = this.render();
            return tempEl;
        },
        render: function(){
            return carbon.render(this.type, this);
        },
        destroy(){
            this.el.removeEventListener('change',this.onchangeEvent );		
            this.el.removeEventListener('change',this.onchange );		
            this.el.removeEventListener('input', this.onchangeEvent);
        },
        initialize: function(){
            if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
            this.onchangeEvent = function(){
                this.value = this.get();
                this.owner.events.trigger('change:'+this.name, this);
                this.owner.events.trigger('change', this);
            }.bind(this)
            this.el.addEventListener('change',this.onchangeEvent );		
            this.el.addEventListener('input', this.onchangeEvent);
        },
        update: function(item, silent) {
            if(typeof item === 'object') {
                _.extend(this.item, item);
            }
            
            var oldDiv = document.getElementById(this.id);

            this.destroy();
            this.el = carbon.types[this.type].create.call(this);
            oldDiv.parentNode.replaceChild(this.el,oldDiv);
            carbon.types[this.type].initialize.call(this);

            if(!silent) {
                this.owner.trigger('change:'+this.name, this);
                
                this.owner.trigger('change',this);
            }
        },
        get: function(){
            return this.el.querySelector('input[name="' + this.name + '"]').value;
        },
        set: function(value){
            this.el.querySelector('input[name="' + this.name + '"]').value = value;
        },
        satisfied: function(value){
            return (typeof value !== 'undefined' && value !== null && value !== '');            
        },
        enable: function(state){
            this.el.querySelector('input').disabled = !state;            
        }
        //display
    },
    'bool':{
        defaults:{options:[false, true]},
        render: function(){
            this.selected = (this.value == this.options[1]);
            return carbon.render(this.type, this);
        },
        set: function(value){
            this.selected = (value == this.options[1]);
            this.el.querySelector('input[name="' + this.name + '"]').checked = this.selected;
        },
        get: function(){
            return this.options[this.el.querySelector('input[name="' + this.name + '"]').checked?1:0]
        }
    },
    'collection':{
        render: function(){
            _.assignIn(this, carbon.options.call(this.owner, this));
            return carbon.render(this.type, this);
        },
        initialize: function(){
            if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
            this.el.addEventListener('change', function(){
                this.value = this.get();
                this.owner.events.trigger('change:'+this.name, this);
                this.owner.events.trigger('change', this);
            }.bind(this));		
        },
        get: function(){
            return this.el.querySelector('select[name="' + this.name + '"]').value;
        },
        set: function(value){
            this.el.querySelector('[name="' + this.name + '"]').value = value;
            _.each(this.options, function(option, index){
                if(option.value == value) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
            }.bind(this))
        }
    },
    'section':{
        initialize: function(){
            //handle rows
            this.rows = {};
        },        
        render: function(){
            if(this.owner.options.sections){
                return carbon.render(this.owner.options.sections+'_fieldset', this);                
            }else{
                return carbon.render('_fieldset', this);                
            }
        },
        get: function(){
            // return this.el.querySelector('select[name="' + this.name + '"]').value;
        },
    }
};
carbon.render = function(template, options){
    return mustache(carbon.stencils[template||'text'] || carbon.stencils['text'],_.extend({},carbon.stencils,options))
}
carbon.renderString = function(string,options){
    return mustache(string||'',options||{})
}
carbon.types['hidden'] = carbon.types['textarea'] = carbon.types['text'] = carbon.types['number'] = carbon.types['color'] = carbon.types['input'];
carbon.types['checkbox'] = _.extend({},carbon.types['input'],carbon.types['bool']);
carbon.types['fieldset'] = _.extend({},carbon.types['input'],carbon.types['section']);
carbon.types['select'] =  _.extend({},carbon.types['input'],carbon.types['collection']);
carbon.types['radio'] = _.extend({},carbon.types['input'],carbon.types['collection'],{
    get: function(){
        return (this.el.querySelector('[type="radio"][name="' + this.name + '"]:checked')||{value:''}).value; 
    },
    // set:function(value){
    //     // this.self.find('[value="' + this.value + '"]').prop('checked', true);
    //     // this.el.querySelector('[type="radio"][name="' + this.name + '"][value="'+value+'"]'); 
    // }
});

carbon.types['email'] = _.extend({},carbon.types['input'],{defaults:{validate: { 'valid_email': true }}});