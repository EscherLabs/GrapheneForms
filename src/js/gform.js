var gform = function(optionsIn, el){
    "use strict";
    //event management        
    this.updateActions = function(field){
        var fieldCount = field.parent.filter({array:{ref:field.array.ref}},1).length

        var testFunc = function(selector,status, button){
        gform.toggleClass(button.querySelector(selector),'hidden', status)
        }
        if(field.array.duplicate.enable == "auto"){
            _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
        }
        if(field.array.remove.enable == "auto"){
            _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
        }        
        if(field.array.append.enable == "auto"){
            testFunc.call(null,'[data-ref="'+field.array.ref+'"].gform-append',(fieldCount >= (field.array.max || 5) ) ,field.operator.container)
        }
          
    }

    var data = _.merge({},optionsIn)

    this.methods = data.methods||{};

    this.eventBus = new gform.eventBus({owner:'form',item:'field',handlers:data.events||{}}, this)
    this.on = this.eventBus.on;
    this.errors = {};

    // this.sub = this.on;
    this.popin = function(){
        
    }
	this.trigger = function(a,b,c){
        if(typeof a == 'string'){ 
            a = [a];
        }
        var events = _.extend([],a);

        if(typeof b == 'object' && 'owner' in b && b.owner instanceof gform) {
            _.each(a, function(item){
                if(item.indexOf(':') == '-1'){
                    events.unshift(item+':'+b.name)
                    events.unshift(item+':'+b.path)
                    events.unshift(item+':'+b.relative)

                    var search = b;
                    while('parent' in search && search.parent !== false){
                        search = search.parent;
                        events.push(item+':'+search.name)
                        events.push(item+':'+search.path)
                        events.push(item+':'+search.relative)
                    }
                    // if(id){
                    // b = this.find({id:id})
                    // }
                }
            }.bind(this))
        }
        this.dispatch(_.uniq(events),b,c);
    }.bind(this)
	this.dispatch = this.eventBus.dispatch;
    // _.map(data.events,function(event,index){
    //     if(!_.isArray(event)){
    //         this.eventBus.handlers[index]=[event];
    //     }
    // }.bind(this))
    this.on('reset', function(e){
        e.form.set(e.form.options.data);
    });
    this.on('clear', function(e){
        e.form.set();
    });
    if(typeof data.collections == 'object'){
        this.collections = data.collections;
    }else{
        this.collections = gform.collections;
    }
    // this.sub = function (event, handler, delay) {
    //     delay = delay || 0;
    //     this.on(event, _.debounce(handler, delay));
    //     return this;
    // }.bind(this);
    
    //initalize form
    this.options = _.assignIn({fields:[], legend: '',strict:true, default:gform.default, data:'search', columns:gform.columns,name: gform.getUID()},this.opts, data);
    if(typeof this.options.onSet == 'function'){
        data = this.options.onSet(data)
    }
    this.options.fields = (this.options.fields||[]).concat(this.options.actions)
    if (typeof this.options.data == 'string') {
        if(typeof window.location[this.options.data] !== 'undefined'){
            this.options.data = window.location[this.options.data].substr(1).split('&').map(function(val){return val.split('=');}).reduce(function ( total, current ) {total[ current[0] ] = decodeURIComponent(current[1]);return total;}, {});
        }else{
            gform.ajax({path: (gform.options.rootpath||'')+this.options.data, success:function(data) {
                this.set(data)
            }.bind(this)})
        }
    }

    //set flag on all root fieldsets as a section
    if(this.options.sections){
        _.each(_.filter(this.options.fields,{type:'fieldset'}),function(item,i){
            item.index = i;
            item.section = true;
            item.id = item.id||gform.getUID();
        return item})
    }
    
    this.el = el || data.el;
    if(typeof this.el == 'string'){
        this.selector = this.el+'';
        this.el = document.querySelector(this.el);
    }else if(typeof this.el == 'object'){
        this.el;
    }else{
        el = '';
    }

  
    this.trigger('initialize',this);
    this.add = gform.createField.bind(this, this, this.options.data||{}, null, null);

    var create = function(){
        if(typeof this.el == 'undefined'){
            this.options.renderer = 'modal';
            this.el = gform.create(gform.render(this.options.template || 'modal_container', this.options))
            // document.querySelector('body').appendChild(this.el)
            // gform.addClass(this.el, 'active')

            this.on('close', function(e){
                if(typeof e.field == 'undefined'){
                    e.form.modal('hide')
                }
            });
            // this.sub('cancel', function(e){
            //     gform.removeClass(e.form.el, 'active')
            //     // e.form.destroy();
            //     // document.body.removeChild(e.form.el);
            //     // delete this.el;
            // });
            // this.on('save', function(e){
            //     // console.log(e.form.toJSON())
            //     gform.removeClass(e.form.el, 'active')
            // });
            this.el.querySelector('.close').addEventListener('click', function(e){
                this.trigger('cancel', this)}.bind(this)
            )
            document.addEventListener('keyup',function(e) {
                if (e.key === "Escape") { // escape key maps to keycode `27`
                    this.trigger('cancel', this)
                }
            }.bind(this));
        }
        if(this.options.clear && !(this.options.renderer == 'modal')){
            this.el.innerHTML = gform.render(this.options.sections+'_container', this.options);
        }
        this.container = this.el.querySelector('form') || this.el;

        this.rows = [];

        this.fields = [];
        this.fields =_.map(this.options.fields, this.add)

        _.each(_.extend([],this.fields), gform.inflate.bind(this, this.options.data||{}))

        this.reflow()
        // _.each(this.fields, function(field) {
        //     field.owner.trigger('change:' + field.name,field.owner, field);
        // })
        gform.each.call(this, gform.addConditions)
        gform.each.call(this, function(field) {
            field.owner.trigger('change', field);
        })
        if(!this.options.private){
            if(typeof gform.instances[this.options.name] !== 'undefined' && gform.instances[this.options.name] !== this){
                gform.instances[this.options.name].destroy();
            }
            gform.instances[this.options.name] = this;
        }
    }
    this.infoEl = gform.create(gform.render('_tooltip'))
    this.infoEl.querySelector('.info-close').addEventListener('click',function(e){
        this.el.removeChild(this.infoEl)
        this.popper.destroy()
        this.popper = null;
    }.bind(this));
    this.popper = null;

    this.restore = create.bind(this);
    this.toJSON = gform.toJSON.bind(this);
    // if(typeof this.options.onGet == 'function'){
    //     this.get = function(name){
    //         return this.options.onGet(this.toJSON(null, arguments));
    //     }.bind(this)
    // }else{
        this.get = this.toJSON;
    // }
    this.toString = gform.toString.bind(this)
    this.reflow = gform.reflow.bind(this)
    this.find = gform.find.bind(this)
    this.filter = gform.filter.bind(this)

    this.set = function(name, value) {
        if(typeof this.options.onSet == 'function'){
            value = this.options.onSet(value)
        }
        if(typeof name == 'string'){
            this.find(name).set(value)
        }
        if(typeof name == 'object'){
            _.each(name,function(item,index){
                var field = this.find(index);
                if(typeof field !== 'undefined' && field.fillable){
                    if(field.array && _.isArray(item)){
                        var list = this.filter({array:{ref:field.array.ref}},1)

                        if(list.length > 1){
                            _.each(list.slice(1),function(field){
                                var index = _.findIndex(field.parent.fields,{id:field.id});
                                field.parent.fields.splice(index, 1);
                            })
                        }

                        if(_.isArray(item)){
                            field.set(item[0]);
                        }

                        // if(!this.owner.options.strict){
                            // _.each(field.fields, gform.inflate.bind(this.owner, atts[field.name]|| field.owner.options.data[field.name] || {}) );
                        // }else{
                            var attr = {};
                            attr[field.name] = item;
                            gform.inflate.call(this.owner||this,attr,field,_.findIndex(field.parent.fields,{id:field.id}),field.parent.fields);
                        // }

                        this.updateActions(field);
                        // var fieldCount = this.filter({array:{ref:field.array.ref}},1).length

                        // var testFunc = function(selector,status, button){
                        //     gform.toggleClass(button.querySelector(selector),'hidden', status)
                        // }
                        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
                        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
            
                        field.operator.reflow();



                    }else{
                        // gform.inflate.bind(this, this.options.data||{})
                        if(typeof field !== 'undefined'){
                            field.set(item);
                        }
                    }
                }
            }.bind(this))
        }
        // if(typeof name == 'undefined'){
        if(name == null){
            gform.each.call(this, function(field) {
                field.set('');
            })
        }
        this.trigger('set');
        return this;
        // _.find(this.fields, {name: name}).set(value);
    }.bind(this),

    this.isActive = false;

    this.destroy = function() {
        this.isActive = false;
		this.trigger(['close','destroy']);
        this.el.removeEventListener('click',this.listener)
		//pub the destroy methods for each field
		// _.each(function() {if(typeof this.destroy === 'function') {this.destroy();}});
		//Clean up affected containers
		this.el.innerHTML = "";
		// for(var i = this.fieldsets.length-1;i >=0; i--) { $(this.fieldsets[i]).empty(); }

		//Dispatch the destroy method of the renderer we used
		// if(typeof this.renderer.destroy === 'function') { this.renderer.destroy(); }

		//Remove the global reference to our form
		delete gform.instances[this.options.name];

        this.trigger('destroyed');
        delete this.eventBus;

    };
    create.call(this)

    
    var tabs = this.el.querySelector('ul.tabs')
    if(tabs !== null){
        tabs.addEventListener('click',function(e){
            if(e.target.nodeName == 'LI'){
            e.preventDefault();
            gform.removeClass(this.el.querySelector('ul.tabs .active'), 'active')
            gform.removeClass(this.el.querySelector('.tab-pane.active'), 'active')
            gform.addClass(e.target,'active')
            gform.addClass(this.el.querySelector(e.target.parentElement.attributes.href.value),'active')
            }
        }.bind(this))
    }
    if(typeof this.options.autoFocus == 'undefined'){
        this.options.autoFocus = gform.options.autoFocus;
    }
    if(this.options.autoFocus && this.fields.length){
        var field = this.find({visible:true})
        if(field){
            window.setTimeout(gform.types[this.find({visible:true}).type].focus.bind(this.find({visible:true})), 0); 
        }
        // gform.types[this.fields[0].type].focus.call(this.fields[0])
    }





    this.listener = function(e){
        var field;
        var target = e.target;
        if(e.target.classList.value.indexOf('gform-')<0 && e.target.parentElement.classList.value.indexOf('gform-')>=0){
            target = e.target.parentElement;
        }
        if(typeof target.dataset.id !== 'undefined') {
            // console.error('ID not set on element'); return false;
        
            field = gform.findByID.call(this,target.dataset.id)
            if(typeof field == 'undefined'){console.error('Field not found with id:'+target.dataset.id); return false;}
        }

        if(target.classList.contains('gform-add')){
            e.stopPropagation();
            e.preventDefault();
            var newField = gform.addField.call(this,field);
            if(newField.array.duplicate.clone == true){
                newField.set(field.get())
                // if(gform.types[newField].base == "section"){
                //     newField.trigger(['change','input'],newField)
                // }
            }
        }
        if(target.classList.contains('gform-minus')){
            e.stopPropagation();
            e.preventDefault();
            gform.removeField.call(this,field);
        }
        if(target.classList.contains('gform-append')){
            e.stopPropagation();
            e.preventDefault();
            var field = gform.addField.call(this,
                _.last((this.find({id:target.dataset.parent}) || this).filter({array:{ref:target.dataset.ref}},10))
            )
            this.trigger('appended', field);
        }
        if(target.classList.contains('gform-info')){
            e.stopPropagation();
            e.preventDefault();

            if(field.infoEl){
                var show = true;
                if(this.popper !== null){
                    show = (this.popper.state.elements.reference != target)
                    this.el.removeChild(this.infoEl)
                    this.popper.destroy()
                    this.popper = null;
                }

                if(show){
                    this.infoEl.querySelector('.tooltip-body').innerHTML = gform.render('_info',field);
                    this.popper = Popper.createPopper(e.target, this.infoEl, {
                        placement: 'top-end',
                        modifiers: [{name: 'offset', options: {offset: [0, 8]}}]
                    });
                    this.el.appendChild(this.infoEl)
                }
              }
        }
    }.bind(this)
    this.el.addEventListener('click', this.listener)
    this.trigger('initialized',this);
    this.isActive = true;
    this.reflow();
    return this;
}
gform.addField = function(field){
    // var fieldCount = _.filter(field.parent.fields, 
    //     function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
    // ).length
    field.parent = field.parent || this;
    var fieldCount = field.parent.filter({array:{ref:field.array.ref}}).length

    var newField;
    if(field.editable && fieldCount < (field.array.max || 5)){
        var index = _.findIndex(field.parent.fields, {id: field.id});
        var atts = {};
        atts[field.name] = [field.item.value || null];
        
        newField = gform.createField.call(this, field.parent, atts, field.el ,null, _.extend({},field.item,{array:field.array}),null,null,fieldCount);
        field.parent.fields.splice(index+1, 0, newField)
        gform.addConditions.call(this,newField);
        //add conditions to child fields
        gform.each.call(newField, gform.addConditions)

        field.operator.reflow();
        _.each(_.filter(field.parent.fields, 
            function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
        ),function(item,index){
            item.index = index;
            gform.types[item.type].setLabel.call(item)
        })

        gform.each.call(field.owner, function(field) {
            field.owner.trigger('change', field);
        })

        gform.types[newField.type].focus.call(newField);
        field.parent.trigger(['change','input', 'create', 'inserted'],field)

        fieldCount++;
    }
    this.updateActions(field);
    // var testFunc = function(selector,status, button){
    // gform.toggleClass(button.querySelector(selector),'hidden', status)
    // }
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
    return newField;
}
gform.removeField = function(field){
    // var fieldCount =  _.filter(field.parent.fields, 
    //     function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
    // ).length;
    var fieldCount = field.parent.filter({array:{ref:field.array.ref}}).length

    if(field.editable && fieldCount > (field.array.min || 1)) {
        // Clean up events this field created as part of conditionals
        if(typeof field.eventlist !== 'undefined'){
            _.each(field.owner.eventBus.handlers,function(event,index,events){
                _.each(event,function(handler,a,b,c){
                    _.each(field.eventlist,function(a,b,search){
                        if(handler == search){
                            delete b[a];
                        }
                    }.bind(null,a,b))
                })
                events[index] =_.compact(events[index])
            })
        }
        var index = _.findIndex(field.parent.fields,{id:field.id});
        field.parent.fields.splice(index, 1);
        
        field.operator.reflow();
        _.each(_.filter(field.parent.fields, 
            function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
        ),function(item,index){
            item.index = index;
            gform.types[item.type].setLabel.call(item)

        })
        field.parent.trigger(['change','input','removed'],field)
        fieldCount--;
    }else{
        if(field.editable)field.set(null);
        field.parent.trigger(['input'],field)

    }           
    this.updateActions(field);
    // var testFunc = function(selector,status, button){
    // gform.toggleClass(button.querySelector(selector),'hidden', status)
    // }
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))

}


// gform.instances = {};

//creates multiple instances of duplicatable fields if input attributes exist for them
gform.inflate = function(atts, fieldIn, ind, list) {
    var newList = list;
    //commented this out because I am not sure what its purpose is 
    // - may need it but it breaks if you have an array following two fields with the same name
    if(fieldIn.array){
        newList = _.filter(newList,function(item){return !item.index})
    }
    //newList[ind].name >> fieldIn.name should fix above comments
    var field = _.findLast(newList, {name: fieldIn.name});

    if(!field.array && field.fields){
        if(!this.options.strict){
            _.each(_.extend([],field.fields), gform.inflate.bind(this, atts[field.name]|| field.owner.options.data[field.name] || {}) );
        }else{
            _.each(_.extend([],field.fields), gform.inflate.bind(this, atts[field.name] || {}) );
        }
        // field.reflow()
    }
    if(field.array) {
        var fieldCount = field.array.min||0;

        if(!this.options.strict && typeof atts[field.name] !== 'object' && typeof field.owner.options.data[field.name] == 'object'){
            atts = field.owner.options.data;
        }
        if((typeof atts[field.name] == 'object' && atts[field.name] !== null && atts[field.name].length > 1)){
            if(atts[field.name].length> fieldCount){fieldCount = atts[field.name].length}
        }
        var initialCount = _.filter(field.parent.fields,
            function(o) { return (o.name == field.name) && ('array' in o) && !!o.array;}
        ).length
        
        for(var i = initialCount; i<fieldCount; i++) {
            var newfield = gform.createField.call(this, field.parent, atts, field.el, i, _.extend({},field.item,{array:field.array}), null, null,i);
            field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id})+1, 0, newfield)
            gform.addConditions.call(this,newfield);
            field = newfield;
        }
        // var testFunc = function(status, button){
        //     gform.toggleClass(button,'hidden', status)
        // }
        // if(field.name == "options")
        // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))

        // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))
        this.updateActions(field);
        // var fieldCount = field.operator.filter({array:{ref:field.array.ref}},1).length

        // var testFunc = function(selector,status, button){
        //     gform.toggleClass(button.querySelector(selector),'hidden', status)
        // }
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))


    }
}

gform.reflow = function(){
    if(this.isActive || (typeof this.owner !== 'undefined' && this.owner.isActive)){
        _.each(this.rows,function(cRow,i){
            if(typeof cRow !== 'undefined'){
                try{cRow.container.removeChild(cRow.ref);}catch(e){}
            }
            // delete this.rows[i];
        }.bind(this))    
        this.rows = [];
        _.each(this.fields,function(field){
            if(!field.section){// && (this.options.clear || field.isChild)){
                gform.layout.call(this,field)
            }else{
                if(field.section){
                    field.owner.el.querySelector('.'+field.owner.options.sections+'-content').appendChild(field.el);
                }
            }
        }.bind(this))
    }
}

gform.createField = function(parent, atts, el, index, fieldIn,i,j, instance) {
    var field = gform.normalizeField.call(this,fieldIn,parent) 
    field.owner = this;
    if(typeof this.options.data == 'object' && 'data' in this.options.data){
        Object.defineProperty(field, "data", {
            get: function(){
                return this.owner.options.data.data
            },
            enumerable: true
        });
    }

    if(field.columns > this.options.columns) { field.columns = this.options.columns; }

    if(field.fillable){
        if(!this.options.strict){
            if(field.array && typeof (atts[field.name] || field.owner.options.data[field.name]) == 'object'){
                field.value =  (atts[field.name] || field.owner.options.data[field.name])[index||0] || {};
            }else{
                field.value = _.defaults({value:_.selectPath(atts,field.item.map||field.name)},{value:field.owner.options.data[field.name]},field).value
            }
        }else{
            if(field.array && typeof atts[field.name] == 'object'){
                field.value =  atts[field.name] || {};
            }else{
                field.value =  _.defaults({value:_.selectPath(atts,field.item.map||field.name)},field).value                
            }    
        }
    }

    field.index = field.index||instance||0;
    field = _.reduce(['label','placeholder','help','info','pre','post','value'],function(field,attr){

        if(typeof field[attr] == 'string' && field.raw !== true){
            field[attr] = gform.renderString((typeof field.item[attr] == 'string')?field.item[attr]:field[attr],field)
        }
        return field;
    },field)

    if(field.array && field.fillable && typeof atts[field.name] == 'object' && !!atts[field.name] ){
        field.value =  atts[field.name][index||0];
    }else{
            if(typeof field.item.value === 'function' || (typeof field.item.method === 'string' && typeof field.owner.methods[field.item.method] == 'function') ) {
                //uncomment this when ready to test function as value for input
                field.valueFunc = field.owner.methods[field.item.method] || field.item.value;
                field.derivedValue = function(e) {
                    return e.initial.valueFunc.call(null, e);
                };
                // field.item.value = field.item.value;// = field.derivedValue({form:field.owner,field:field});
                field.value =  field.valueFunc.call(null, {form:this.owner,field:field,initial:field});

                field.owner.on('initialized', function(f,e) {
                    e.field = e.initial = f;
                    f.set.call(null,f.derivedValue.call(null,e));
                }.bind(null,field));
                field.owner.on('input', function(f,e) {
                    e.initial = f;
                    var oldv = f.value;
                    var newv =  f.derivedValue.call(null,e);
                    if(newv != oldv && e.default){
                        f.set.call(null,newv);
                        if(e.field !== f && e.continue){
                            e.form.trigger("input",f)
                        }
                    }

                }.bind(null,field));

            } else if(typeof field.item.value === 'string' && field.item.value.indexOf('=') === 0) {
                field.derivedValue = function() {
                    var data = this.owner.get();
                    field.formula = gform.renderString(this.item.value.substr(1),data)
                    try {
                        if(field.formula.length){
                            if(typeof math !== 'undefined'){
                                var temp  = math.eval(field.formula, data);
                                if(typeof temp == 'object' && temp.entries !== 'undefined'){
                                    temp = _.last(temp.entries);
                                    if(typeof temp._data == 'object'){
                                        temp = temp._data;
                                    }
                                }
                                if(_.isFinite(temp)){
                                    field.formula = temp.toFixed((this.item.precision || 0));
                                }else if(_.isArray(temp)){
                                    field.formula = temp;
                                }else{
                                    field.formula = '';
                                }
                            }
                        }
                    }catch(e){field.formula = '';}
                    return field.formula;
                };
                field.value = field.derivedValue.call(f,{form:field.owner,field:field});
                field.owner.on('input', function(f,e) {
                    e.initial = f;
                    f.set.call(null,f.derivedValue.call(null,e));
                }.bind(null,field));
                field.owner.on('initialized', function(f,e) {
                    e.field = e.initial = f;
                    f.set.call(null,f.derivedValue.call(null,e));
                }.bind(null,field));

            }  else {
                //may need to search deeper in atts?
                // field.value =  atts[field.name] || field.value || '';
                // if(field.fillable){field.value = _.defaults({value:atts[field.name],},field,{value:''}).value;}
                // if('format' in field && 'field' in field.format && 'value' in field.format.field){
                //     field.value = gform.renderString(field.format.field.value,field)
                // }
                //remove once format added to builder
                // if(typeof field.value == 'string')field.value = gform.renderString(field.value,field)

                
    
                if(field.fillable){field.value =  _.defaults({value:_.selectPath(atts,field.item.map||field.name)},field,{value:''}).value}

            }
    }

    field.satisfied = (field.satisfied || gform.types[field.type].satisfied).bind(field);
    field.update = gform.types[field.type].update.bind(field);
    field.destroy = gform.types[field.type].destroy.bind(field);
    field.focus = gform.types[field.type].focus.bind(field);
    field.trigger = (gform.types[field.type].trigger) ? gform.types[field.type].trigger.bind(field) : field.owner.trigger;

    if(gform.types[field.type].filter){
        field.filter = gform.types[field.type].filter.bind(field);
    }
    
    field.active = function() {
        return this.parent.active() && this.editable && this.parsable && this.visible;
    }
    field.set = function(value, silent){
        //not sure we should be excluding objects - test how to allow objects
        if('fields' in this && typeof value == 'object'){value = _.pick(value,_.map(this.fields,"name"))}

        if(this.value != value || value == null){// && typeof value !== 'object') {
            if(!gform.types[this.type].set.call(this,value)){
                this.value = value;

                if(!silent){
                    this.parent.trigger(['change'],this);
                };
            };
        }
    }.bind(field)

    field.get = field.get || gform.types[field.type].get.bind(field);
    field.toString = gform.types[field.type].toString.bind(field);

    Object.defineProperty(field, "display", {
        get: function(){
            if('display' in gform.types[field.type]){
                return gform.types[field.type].display.call(this)
            }
            return this.toString();
        },
        enumerable: true
    });
    Object.defineProperty(field, "sibling",{
        get: function(){
            var types = this.parent.filter({array:{ref:this.array.ref}},1);
            return (types.length && types[0] !== this );
        },
        enumerable: true
    });

    Object.defineProperty(field, "isSatisfied",{
        get: function(){
            return this.satisfied(this.get())
        },
    });
    Object.defineProperty(field, "path",{
        get: function(){
            var path = '/';
            if(this.ischild) {
                path = this.parent.path + '.';
            }
            path += this.name
            if(this.array){
                path+='.'+this.index
            }
            return path;
        }
    });
    Object.defineProperty(field, "map",{
        get: function(){            
            if(this.item.map === false){return this.item.map}
            var map = '';
            if(this.ischild) {

                map = this.parent.map + '.';
            }
            map += this.name
            if(this.array){
                map+='.'+this.index;
            }

            return this.item.map || map;
        },
    });
    Object.defineProperty(field, "source",{
        get: function(){            
            if(this.item.source === false){return this.item.source}
            var source = '';
            if(this.ischild) {
                source = this.parent.source + '.';
            }
            source += this.name
            if(this.array){
                source+='.'+this.index;
            }

            return this.item.source  || source || this.map;
        },
    });
    Object.defineProperty(field, "relative",{
        get: function(){
            var path = '/';
            if(this.ischild) {
                path = this.parent.relative + '.';
            }
            path += this.name
            return path;
        }
    });
    Object.defineProperty(field, "toJSON",{
        get: function(){
            return this.get();
        }
    });
    
    field.render = (field.render || gform.types[field.type].render).bind(field);
    
    field.el = gform.types[field.type].create.call(field);

    switch(typeof field.container){
        case "string":
            field.container =  field.el.querySelector(field.container);
            break;
        case "undefined":
            field.container =  field.el.querySelector('fieldset')|| field.el || null;
            break;
    }

    field = _.reduce(['reflow','find','filter'],function(field,prop){
        if(prop in gform.types[field.type]){
            field[prop] = gform.types[field.type][prop].bind(field);// || null;
        }
        return field;
    },field)

    if(!field.section){// && (this.options.clear || field.isChild)){
        gform.layout.call(this,field)
    }else{
        if(field.section){
            field.owner.el.querySelector('.'+field.owner.options.sections+'-content').appendChild(field.el);
        }
    }

    gform.types[field.type].initialize.call(field);
    field.isActive = true;



    
    if(_.isArray(field.item.data)){
        field.meta = field.item.data;
        _.each(field.meta,function(i){
            if(typeof i.key == 'string' && i.key !== "" && !(i.key in field)){
                Object.defineProperty(field, i.key,{
                    get: function(key,field){
                        return _.find(field.meta,{key:key}).value;
                    }.bind(null,i.key,field),
                    set: function(key,field,value){
                        _.find(field.meta,{key:key}).value = value;
                        field.parent.trigger(i.key,field);
                    }.bind(null,i.key,field),
                    configurable: true,            
                    enumerable: true
                });
            }
        })
    }





    if(field.fields){
        var newatts = {};
        if(!this.options.strict){
            if(field.array && typeof (atts[field.name]|| field.owner.options.data[field.name]) == 'object'){
                newatts =  (atts[field.name]|| field.owner.options.data[field.name])[index||0] || {};
            }else{
                newatts = atts[field.name]|| (field.owner.options.data||{})[field.name] ||{};
            }
        }else{
            if(field.array && typeof atts[field.name] == 'object'){
                newatts =  atts[field.name][index||0] || {};
            }else{
                newatts = atts[field.name] ||{};
            } 
        }

        field.fields = _.map(field.fields, gform.createField.bind(this, field, newatts, null, null) );
        if(field.array) {
            _.each(_.extend([],field.fields), gform.inflate.bind(this, newatts) );
            field.reflow()
        }
        field.update();
    }





    return field;
}



