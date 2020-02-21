var gform = function(optionsIn, el){
    "use strict";
    //event management        

    var data = _.merge({},optionsIn)

    this.methods = data.methods||{};

    this.eventBus = new gform.eventBus({owner:'form',item:'field',handlers:data.events||{}}, this)
	this.on = this.eventBus.on;
	// this.sub = this.on;
	this.trigger = function(a,b,c){
        if(typeof a == 'string'){ 
            a = [a];
        }
        var events = _.extend([],a);

        if(typeof b == 'object') {
            _.each(a, function(item){
                if(item.indexOf(':') == '-1'){
                    events.unshift(item+':'+b.name)
                    events.unshift(item+':'+b.path)
                    events.unshift(item+':'+b.relative)
                }
            })
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
    this.options.fields = this.options.fields.concat(this.options.actions)
    if (typeof this.options.data == 'string') {
        if(typeof window.location[this.options.data] !== 'undefined'){
            this.options.data = window.location[this.options.data].substr(1).split('&').map(function(val){return val.split('=');}).reduce(function ( total, current ) {total[ current[0] ] = decodeURIComponent(current[1]);return total;}, {});
        }
    }

    //set flag on all root fieldsets as a section
    if(this.options.sections){
        _.each(_.filter(this.options.fields,{type:'fieldset'}),function(item,i){
            item.index = i;
            item.section = true;
            item.id = gform.getUID();
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

    var create = function(){
        if(typeof this.el == 'undefined'){
            this.options.renderer = 'modal';
            this.el = gform.create(gform.render(this.options.template || 'modal_container', this.options))
            // document.querySelector('body').appendChild(this.el)
            gform.addClass(this.el, 'active')

            this.on('close', function(e){e.form.modal('hide')});
            // this.sub('cancel', function(e){
            //     gform.removeClass(e.form.el, 'active')
            //     // e.form.destroy();
            //     // document.body.removeChild(e.form.el);
            //     // delete this.el;
            // });
            this.on('save', function(e){
                // console.log(e.form.toJSON())
                gform.removeClass(e.form.el, 'active')
            });
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

        this.fields = _.map(this.options.fields, gform.createField.bind(this, this, this.options.data||{}, null, null))

        _.each(this.fields, gform.inflate.bind(this, this.options.data||{}))

        this.reflow()
        // _.each(this.fields, function(field) {
        //     field.owner.trigger('change:' + field.name,field.owner, field);
        // })
        gform.each.call(this, gform.addConditions)
        gform.each.call(this, function(field) {
            field.owner.trigger('change', field);
        })
        if(!this.options.private){
            gform.instances[this.options.name] = this;
        }
    }

    this.restore = create.bind(this);
    this.toJSON = gform.toJSON.bind(this);
    if(typeof this.options.onGet == 'function'){
        this.get = function(){
            return this.options.onGet(this.toJSON(null, arguments));
        }.bind(this)
    }else{
        this.get = this.toJSON;
    }
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
                            gform.inflate.call(this.owner,attr,field,_.findIndex(field.parent.fields,{id:field.id}),field.parent.fields);
                        // }

                        var fieldCount = this.filter({array:{ref:field.array.ref}},1).length

                        var testFunc = function(selector,status, button){
                            gform.toggleClass(button.querySelector(selector),'hidden', status)
                        }
                        _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
                        _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
            
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
        // _.find(this.fields, {name: name}).set(value);
    }.bind(this),

    this.isActive = false;

    this.destroy = function() {
        this.isActive = false;
        // debugger;
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
        gform.types[this.fields[0].type].focus.call(this.fields[0])
    }





    this.listener = function(e){
        var field;
        if(e.target.dataset.id){
           field = gform.findByID.call(this,e.target.dataset.id)
        }
       if(e.target.classList.contains('gform-add')){

           e.stopPropagation();
           // var fieldCount =  _.countBy(field.parent.fields, {name: field.name,array: true}).true;
           var fieldCount = _.filter(field.parent.fields, 
               function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
           ).length

           if(field.editable && fieldCount < (field.array.max || 5)){
               var index = _.findIndex(field.parent.fields, {id: field.id});
               var atts = {};
               atts[field.name] = [field.item.value || null];
               var newField = gform.createField.call(this, field.parent, atts, field.el ,null, field.item,null,null,fieldCount);
               field.parent.fields.splice(index+1, 0, newField)
               gform.addConditions.call(this,newField);
               gform.each.call(newField, gform.addConditions)

               field.operator.reflow();
               _.each(_.filter(field.parent.fields, 
                   function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
               ),function(item,index){
                   // item.update({index:index})
                   item.index = index;
                   // item.label = gform.renderString(item.item.label, item);
                   // item.el.querySelector('label').innerHTML = item.label
                   gform.types[item.type].setLabel.call(item)

               })

               gform.each.call(field.owner, function(field) {
                   field.owner.trigger('change', field);
               })

               gform.types[newField.type].focus.call(newField);
               field.parent.trigger(['change','input', 'create', 'inserted'],field)

               fieldCount++;
           }

        //    var testFunc = function(status, button){
        //        gform.toggleClass(button,'hidden', status)
        //    }

           var testFunc = function(selector,status, button){
            gform.toggleClass(button.querySelector(selector),'hidden', status)
           }
           _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
           _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))

       }
       if(e.target.classList.contains('gform-minus')){
           e.stopPropagation();
           // var fieldCount =  _.countBy(field.parent.fields, {name: field.name,array: true}).true;
           var fieldCount =  _.filter(field.parent.fields, 
               function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
           ).length;
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
            //    if(!field.target) {
                   _.each(_.filter(field.parent.fields, 
                       function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
                   ),function(item,index){
                       // item.update({index:index})
                       item.index = index;
   
                       // item.label = gform.renderString(item.item.label, item);
                       // item.el.querySelector('label').innerHTML = item.label
                       gform.types[item.type].setLabel.call(item)

                   })

            //    }else{
            //        this.container.querySelector(field.target ).removeChild(field.el);
            //    }
                field.parent.trigger(['change','input','removed'],field)
                fieldCount--;
           }else{
               if(field.editable)field.set(null);
           }           

        //    var testFunc = function(status, button){
        //        gform.toggleClass(button,'hidden', status)
        //    }
        //    _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))

        //    _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))

           var testFunc = function(selector,status, button){
            gform.toggleClass(button.querySelector(selector),'hidden', status)
           }
           _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
           _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))

       }
   }.bind(this)

    this.el.addEventListener('click', this.listener)
    this.trigger('initialized',this);
    this.isActive = true;
    this.reflow();
    return this;
                  
}
gform.addConditions = function(field) {

    gform.processConditions.call(field, field.show, function(result){
        var events = (this.visible !== result);
        this.el.style.display = result ? "block" : "none";
        this.visible = result;
    
        if(events){
            this.operator.reflow();
            this.parent.trigger('change', this);
        }

    })
    gform.processConditions.call(field, field.edit, function(result){
        this.editable = result;        
        gform.types[this.type].edit.call(this,this.editable);
    })
    if(typeof field.parse == 'undefined'){
        field.parse = field.show;
    }
    gform.processConditions.call(field, field.parse, function(result){
        this.parsable = result
    })
    if(typeof field.report == 'undefined'){
        field.report = field.show;
    }
    gform.processConditions.call(field, field.report, function(result){
        this.reportable = result
    })
    if(field.required){
        gform.processConditions.call(field, field.required, function(result,e){
            if(this.required !== result){
                this.update({required:result},(e.field == this));
            }
        })
    }


}
gform.each = function(func){
    _.each(this.fields, function(field){
        func(field);
        if(typeof field.fields !== 'undefined'){
            gform.each.call(field,func);
        }
    })
}

gform.find = function(oname){
    var name;
    var temp;
    if(typeof oname == 'string'){
        name = oname.split('.');
        temp = _.find(this.fields, {name: name.shift()})
    }else if(typeof oname == 'number'){
    //    debugger;
        // temp =this.fields[oname];// _.find(this.fields, {name: name.shift()})
        // name = oname;
    }else if(typeof oname == 'object'){
        return  gform.filter.call(this, oname)[0] || false;
    }
    if(typeof temp !== 'undefined'){
        if(typeof temp.find !== 'undefined'){
            if(temp.name == oname || typeof oname == 'number'){
                return temp;
            }
            return temp.find(name.join('.'));
        }else{
            return temp;
        }
    }else{
        if(typeof this.parent !== 'undefined' && typeof this.parent.find == 'function'){
            return this.parent.find(oname);
        }
    }
}
gform.findByID = function(id){
    return  gform.filter.call(this, {id:id},10)[0] || false;
}


gform.filter = function(search,depth){
    var temp = [];
    if(typeof search == 'string'){
        search = {name: search}
    }
    var depth = (depth||1);
    depth--;
    // debugger;

    _.each(this.fields, function(depth,field){
        if(_.isMatch(field, search)){
            temp.push(field)
        }
        if(!!depth && typeof field.fields !== 'undefined'){
            temp = temp.concat(gform.filter.call(field,search,depth));
        }
    }.bind(null,depth))
    return temp;
}

//parse form values into JSON object
gform.toJSON = function(name) {
    if(typeof name == 'string' && name.length>0) {
        name = name.split('.');
        var field = _.find(this.fields, {name: name.shift()});
        if(typeof field !=='undefined'){
            return field.get(name.join('.'));
        }
        return undefined;
    }
    var obj = {};
    _.each(this.fields, function(field) {
        if(field.parsable){
            if(field.array){
                obj[field.name] = obj[field.name] || [];
                if(!Array.isArray(obj[field.name])){
                    obj[field.name] = [];
                }
                obj[field.name].push(field.get());
            }else{
                obj[field.name] = field.get();
            }
        }
    }.bind(this))
    return obj;
}
gform.toString = function(name,report){
    if(!report){
        if(typeof name == 'string' && name.length>0) {
            name = name.split('.');
            return _.find(this.fields, {name: name.shift()}).toString(name.join('.'));
        }
        var obj = "";
        _.each(this.fields, function(field) {
            if(field.reportable){
                // var fieldString = field.toString();
                obj += field.toString();
            }
        })
        return obj;
    }else{
        if(typeof name == 'string' && name.length>0) {
            name = name.split('.');
            return _.find(this.fields, {name: name.shift()}).toString(name.join('.'),report);
        }
        var obj = {};
        _.each(this.fields, function(field) {
            if(field.visible){
                if(field.array){
                    obj[field.name] = obj[field.name]||[];
                    obj[field.name].push(field.toString(name,true))
                }else{
                    obj[field.name] = field.toString(name,true);
                }
            }
        })
        return obj;
    }
}
gform.m = function (n,t,e,r){var i,o=gform.m,a="";function f(n,t){return n=null!=(n=n[(t=t.pop?t:t.split(".")).shift()])?n:"",0 in t?f(n,t):n}t=Array.isArray(t)?t:t?[t]:[],t=r?0 in t?[]:[1]:t;for(i=0;i<t.length;i++){var s,l="",p=0,g="object"==typeof t[i]?t[i]:{};(g=Object.assign({},e,g))[""]={"":t[i]},n.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,function(n,t,e,r,i,c,u){p?l+=p&&!i||1<p?n:t:(a+=t.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,function(n,t,e,r,i,c){return t?f(g,t):r?f(g,c):i?o(f(g,c),g):e?"":new Option(f(g,c)).innerHTML}),s=c),i?--p||(u=f(g,u),/^f/.test(typeof u)?a+=u.call(g,l,function(n){return o(n,g)}):a+=o(l,u,g,s),l=""):++p})}return a}

gform.instances = {};

//creates multiple instances of duplicatable fields if input attributes exist for them
gform.inflate = function(atts, fieldIn, ind, list) {
    var newList = list;
    //commented this out because I am not sure what its purpose is 
    // - may need it but it breaks if you have an array following two fields with the same name
    if(fieldIn.array){
        newList = _.filter(newList,function(item){return !item.index})
    }
    var field = _.findLast(newList, {name: newList[ind].name});

    if(!field.array && field.fields){
        if(!this.options.strict){
            _.each(field.fields, gform.inflate.bind(this, atts[field.name]|| field.owner.options.data[field.name] || {}) );
        }else{
            _.each(field.fields, gform.inflate.bind(this, atts[field.name] || {}) );
        }
        // field.reflow()
    }
    if(field.array) {
        var fieldCount = field.array.min||0;

        if(!this.options.strict && typeof atts[field.name] !== 'object' && typeof field.owner.options.data[field.name] == 'object'){
            atts = field.owner.options.data;
        }
        if((typeof atts[field.name] == 'object' && atts[field.name].length > 1)){
            if(atts[field.name].length> fieldCount){fieldCount = atts[field.name].length}
        }
        var initialCount = _.filter(field.parent.fields,
            function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array;}
        ).length
        
        for(var i = initialCount; i<fieldCount; i++) {
            var newfield = gform.createField.call(this, field.parent, atts, field.el, i, field.item, null, null,i);
            field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id})+1, 0, newfield)
            field = newfield;
        }
        // var testFunc = function(status, button){
        //     gform.toggleClass(button,'hidden', status)
        // }
        // if(field.name == "options")debugger;
        // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))

        // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))
        var fieldCount = field.operator.filter({array:{ref:field.array.ref}},1).length

        var testFunc = function(selector,status, button){
            gform.toggleClass(button.querySelector(selector),'hidden', status)
        }
        _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
        _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))


    }
}
gform.normalizeField = function(fieldIn,parent){
    var parent = parent || this;
    fieldIn.type = fieldIn.type || this.options.default.type || 'text';
    if(typeof gform.types[fieldIn.type] == 'undefined'){
        console.warn('Field type "'+fieldIn.type+'" not supported - using text instead');
        fieldIn.type = 'text';
    }
    //work gform.default in here
    var field = _.assignIn({
        id: gform.getUID(), 
        // type: 'text', 
        label: fieldIn.legend || fieldIn.title || (gform.types[fieldIn.type]||gform.types['text']).defaults.label || fieldIn.name,
        validate: [],
        valid: true,
        parsable:true,
        reportable:true,
        visible:true,
        editable:true,
        parent: parent,
        fillable:true,
        array:false,
        columns: this.options.columns||gform.columns,
        offset: this.options.offset||gform.offset||0,
        ischild:!(parent instanceof gform)
    }, this.opts, gform.default,this.options.default,(gform.types[fieldIn.type]||gform.types['text']).defaults, fieldIn)
    if(typeof field.value == "function" || (typeof field.value == "string" && field.value.indexOf('=') === 0))delete field.value;

    //keep required separate
    if(field.array){
        if(typeof field.array !== 'object'){
            field.array = {};
        }
        field.array.ref = field.array.ref || gform.getUID();
    }
    
    // field.validate.required = field.validate.required|| field.required || false;
    if(typeof field.multiple == 'undefined' && typeof field.limit !== 'undefined' && field.limit>1)
    {
        field.multiple = true;
    }
    field.name = field.name || (gform.renderString(fieldIn.label || fieldIn.title)||'').toLowerCase().split(' ').join('_');

    // if(typeof field.validate.required == 'undefined'){field.validate.required = false}
    if(field.name == ''){
        field.name = field.id;
    }
    // if((typeof fieldIn.label == 'undefined' || fieldIn.label == '') && (field.label == '' || typeof field.label == 'undefined') ){fieldIn.label = field.name;}
    field.item = _.extend(fieldIn,{});
    return field;
}



gform.ajax = function(options){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {

        if(request.readyState === 4) {
            if(request.status === 200) { 
                options.success(JSON.parse(request.responseText));
            } else {
                console.log(request.responseText);
                if(typeof options.error == 'function'){options.error(request.responseText)};
            }
        }
    }
    request.open(options.verb || 'GET', options.path);
    request.send();
}

gform.default ={}; 
gform.options = {autoFocus:true};
gform.prototype.opts = {
    actions:[{type:'cancel'},{type:'save'}],
    clear:true,
    sections:'',
    suffix: ':',
    rowClass: 'row',
    requiredText: '<span style="color:red">*</span>'
}

gform.eventBus = function(options, owner){
	this.options = options || {owner:'form',item:'field'};
    this.owner = owner||this;
    this.on = function (event, handler, ref) {
        if(typeof event != 'undefined'){

            var events = event.split(' ');
            // if (typeof this.handlers[event] !== 'object') {
            // this.handlers[event] = [];
            // }
            _.each(events,function(ref,event){
                this.handlers[event] = this.handlers[event] ||[];
                // if(typeof handler == 'function'){
                    this.handlers[event].push(handler);
                    if(typeof ref == 'object'){
                        ref.push(handler);

                    }
                // }else{
                //     if(typeof this[handler] == 'function'){
                //         this.handlers[event].push(this[handler]);
                //     }
                // }
            }.bind(this,ref))
        }
		return this.owner;
	}.bind(this);
    if(_.isArray(options.handlers)){
        this.handlers = {};
        _.each(options.handlers,function(item){
            this.on(item.event, item.handler)
        }.bind(this))
    }else{
        this.handlers = _.extend({},options.handlers);
    }
    _.each(this.handlers,function(a,b,c){
        if(typeof a == 'function'){
            c[b] = [a];
        }else if(typeof a == 'string'){
            if(typeof this[a] == 'function'){
                c[b] = [this[a]];
            }else{
              if(typeof this.owner[a] == 'function'){
                c[b] = [this.owner[a]];
              }else{
                if(typeof this.owner.methods !== 'undefined' && typeof this.owner.methods[a] == 'function'){
                  c[b] = [this.owner.methods[a]];
                }else{
                  if(typeof window[a] == 'function'){
                    c[b] = [window[a]];
                  }else{
                    c[b] = null;
                  }
                }
              }
            }
        }
    }.bind(this))

	this.dispatch = function (e,f,a) {
		a = a || {};
		a[this.options.owner] = this.owner;
		if(typeof f !== 'undefined'){
		    a[this.options.item] = f;
		}
        a.default = true;
        a.continue = true;
        a.preventDefault = function(){this.default = false;}.bind(a)
        a.stopPropagation = function(){this.continue = false;}.bind(a)
		var events = [];
		if(typeof e == 'string'){
		    events.push(e)
		}else{events = events.concat(e)}
		_.each(events, function(args,event){
            args.event = event;
            
            var f = function (handler) {
                if(a.continue){
                    if(typeof handler == 'function'){
                        handler.call(owner, args);
                    }
                }
            }.bind(this)
            _.each(this.handlers[event], f);
            _.each(this.handlers['*'], f);
		}.bind(this, a))
        return a;
        
	}.bind(this)

}
// gform.prototype.sub = function (event, handler) {
//     var events = event.split(' ');
//     if (typeof this.handlers[event] !== 'object') {
//     this.handlers[event] = [];
//     }
//     _.each(events,function(event){
//         this.handlers[event].push(handler);
//     }.bind(this))
//     return this;
// };
// gform.prototype.on = gform.prototype.sub;
// gform.prototype.trigger = function (e,f,a) {
//     var a = a || {};
//     a[this.options.owner||'form'] = this;
//     if(typeof f !== 'undefined'){
//         a[this.options.item||'field'] = f;
//     }

//     var events = []
//     if(typeof e == 'string'){
//         events.push(e)
//     }else{events = events.concat(e)}
//     _.each(events, function(args,event){
//         args.event = event;
//         var f = function (handler) {
//             handler.call(null,args);
//         }.bind(this)
//         _.each(this.handlers[event], f);
//         _.each(this.handlers['*'], f);
//     }.bind(this, a))
//     return this;
// }



// gform.optionsObj = function(opts, value, count){
// 	// If max is set on the field, assume a number set is desired. 
// 	// min defaults to 0 and the step defaults to 1.
// 	if(typeof opts.max !== 'undefined' && opts.max !== '') {
//         for(var i = (opts.min || 0);i<=opts.max;i=i+(opts.step || 1)){
//             opts.options.push(""+i);
//         }
//     }
//     if(typeof opts.options == 'string' || typeof opts.url == 'string') {
//         opts.path = opts.url || opts.options;
//         opts.options = {label:'-'};
//         opts.options[opts.path] = false;
//         opts.url = null;
//         gform.ajax({path: opts.path, success:function(data) {
//             this.options = data;
//             this.options = gform.mapOptions.call(this, this, this.value);
//             this.update()
//         }.bind(this)})
// 		return opts;
//     }

//     return _.map(opts.options, function(opts,item, i){
//         if(typeof item === 'object' && item.type == 'optgroup'){
//             // var optgroup = {label:item.label};
//             item.options = gform.optionsObj.call(this, _.merge({options:[]},gform.default, item),value,count);
//             item.id = gform.getUID();

//             gform.processConditions.call(this, item.edit, function(id, result){
//                 var op = this.el.querySelectorAll('[data-id="'+id+'"]');
//                 for (var i = 0; i < op.length; i++) {
//                       op[i].disabled = !result;
//                   }
//             }.bind(this,item.id))            
//             gform.processConditions.call(this, item.show, function(id, result){
//                 var op = this.el.querySelectorAll('[data-id="'+id+'"]');
//                 for (var i = 0; i < op.length; i++) {
//                       op[i].hidden = !result;
//                   }
//             }.bind(this,item.id))
//             count += item.options.length;

//             return {optgroup:item};
//         }else{
//             if(typeof item === 'string' || typeof item === 'number' || typeof item == 'boolean') {
//                 item = {label: item, value:item};
//             }
//             item.index = item.index || ""+count;
            
//             if(typeof opts.format !== 'undefined'){

//                 if(typeof opts.format.label !== 'undefined' ){
//                     item.label = gform.renderString(opts.format.label,item);
//                 }
//                 if(typeof opts.format.value !== 'undefined' ){
//                     item.value = gform.renderString(opts.format.value,item);
//                 }
//             }
//             // _.assignIn(item,{label: gform.renderString(opts.format.label,item), value: gform.renderString(opts.format.value,item) });
//             if(item.value == value || (this.multiple && (value.indexOf(item.value)>=0) )) { item.selected = true;}
            
//             // if(item.value == value) { item.selected = true;}
//             count+=1;
//             item.i = count;
//             return item;
//         }

//     }.bind(this,opts))
// }

// /* Process the options of a field for normalization */
// gform.mapOptions = function(opts, value, count) {

//     count = count||0;
//     var newOpts = {options:[]};
//     if(typeof opts.options == 'object' && !_.isArray(opts.options)){
//         _.merge(newOpts.options, opts.options);    
//         // newOpts.options = opts.options;
//     }
    
//     if(typeof opts.options == 'function') {
//         newOpts.action = opts.options;
//         opts.options = newOpts.action.call(this);
//     }

//     opts = _.merge({options:[]}, gform.default, opts);        

//     newOpts.options =  gform.optionsObj.call(this,opts,value,count);
//     return newOpts.options;
// }



gform.mapOptions = function(optgroup, value, count,collections,waitlist){
    waitlist = waitlist||[];

    if(optgroup.owner instanceof gform){
        this.field = optgroup;
    }
    this.collections = collections;
    this.eventBus = new gform.eventBus({owner:'field',item:'option'}, this)
    this.optgroup = _.extend({},optgroup);
    count = count||0;
    var format = this.optgroup.format;

    
    function pArray(opts){
        return _.map(opts,function(item){
            if(typeof item === 'object' && item.type == 'optgroup'){
                item.map = new gform.mapOptions(_.extend({format:format},item),value,count,this.collections,waitlist);
                item.map.on('*',function(e){
                    this.eventBus.dispatch(e.event);
                }.bind(this))

                item.id = gform.getUID();

                gform.processConditions.call(this.field, item.edit, function(id, result,e){
                    // if(typeof e.field.el !== 'undefined'){
                    //     var op = e.field.el.querySelectorAll('[data-id="'+id+'"]');
                    //     for (var i = 0; i < op.length; i++) {
                    //         op[i].disabled = !result;
                    //     }
                    // }
                    _.find(this.optgroup.options,{id:id}).editable = result

                    this.eventBus.dispatch('change')

                }.bind(this,item.id))
                gform.processConditions.call(this.field, item.show, function(id, result,e,){
                    // if(typeof e.field.el !== 'undefined'){
                    //     var op = e.field.el.querySelectorAll('[data-id="'+id+'"]');
                    //     for (var i = 0; i < op.length; i++) {
                    //         op[i].hidden = !result;
                    //     }
                    // }
                    _.find(this.optgroup.options,{id:id}).visible = result

                    this.eventBus.dispatch('change')
                }.bind(this,item.id))

                // count += item.options.length;
                count += item.map.getoptions().length;
                return item;
            }else{
                var option = _.extend({},item)
                option.data = item;
                if(typeof item === 'string' || typeof item === 'number' || typeof item == 'boolean') {
                    option.label = option.value = item;
                }
                option.index = item.index || ""+count;
                if(typeof format !== 'undefined'){

                    if(typeof format.label !== 'undefined' ){
                        if(typeof format.label == 'string'){
                            option.label = gform.renderString(format.label,option);
                          }else{
                              if(typeof format.label == 'function'){
                                  option.label = format.label.call(this.option);
                              }
                        }
                    }
                    if(typeof format.display !== 'undefined' ){
                        if(typeof format.display == 'string'){
                            option.display = gform.renderString(format.display,option);
                          }else{
                              if(typeof format.display == 'function'){
                                  option.display = format.display.call(this.option);
                              }
                        }
                    }
                    if(typeof format.value !== 'undefined' ){
                        if(typeof format.value == 'string'){
                          option.value = gform.renderString(format.value,option);
                        }else{
                            if(typeof format.value == 'function'){
                                option.value = format.value.call(this,option);
                            }
                        }
                    }
                    if(typeof format.cleanlabel !== 'undefined' ){
                        if(typeof format.cleanlabel == 'string'){
                            option.label = gform.renderString(format.cleanlabel,option);
                          }else{
                              if(typeof format.cleanlabel == 'function'){
                                  option.label = format.cleanlabel.call(this.option);
                              }
                        }
                    }
                }
                if(option.value == value || (/*this.multiple && */typeof value !=='undefined' && value !== null && value.length && (value.indexOf(option.value)>=0) )) { option.selected = true;}

                count+=1;
                option.i = count;
                return option;
            }
        }.bind(this))
    }

    this.optgroup.options = this.optgroup.options || [];
    // optgroup.options = optgroup.options || optgroup.path || optgroup.action;
    
    switch(typeof this.optgroup.options){
        case 'string':
            this.optgroup.path = this.optgroup.path || this.optgroup.options;
            this.optgroup.options = []
        break;
        case 'function':
            this.optgroup.action = this.optgroup.options;
            this.optgroup.options = []
        break;
    }

    // If max is set on the field, assume a number set is desired. 
    // min defaults to 0 and the step defaults to 1.
	if(typeof this.optgroup.max !== 'undefined' && this.optgroup.max !== '') {
        for(var i = (this.optgroup.min || 0);i<=this.optgroup.max;i=i+(this.optgroup.step || 1)){
            this.optgroup.options.push(""+i);
        }
    }

    if(typeof this.optgroup.action !== 'undefined'){
        this.optgroup.options = this.optgroup.options.concat(pArray.call(this,this.optgroup.action.call(this)));
    }

    if(_.isArray(this.optgroup.options)){
        this.optgroup.options = pArray.call(this,this.optgroup.options);
    }

    if(typeof this.optgroup.path !== 'undefined'){


        this.collections.on(this.optgroup.path,function(e){
            this.optgroup.options = pArray.call(this.optgroup.map, e.collection);
            this.eventBus.dispatch('change')
        }.bind(this))

        if(typeof this.collections.get(this.optgroup.path) === 'undefined'){
            this.collections.add(this.optgroup.path,[])
            if( waitlist.indexOf(this.optgroup.path)){
                waitlist.push(this.optgroup.path);
            }
            gform.ajax({path: this.optgroup.path, success:function(data) {
                this.collections.update(this.optgroup.path,data)
                if( waitlist.indexOf(this.optgroup.path) >= 0){
                    delete  waitlist[ waitlist.indexOf(this.optgroup.path)];
                    // waitlist = 
                }

                this.eventBus.dispatch('collection');
                this.eventBus.dispatch('change');

            }.bind(this)})
        }else{
            this.optgroup.options = pArray.call(this.optgroup.map, this.collections.get(this.optgroup.path));
        }
    }



    var response = {getobject:function(){
        var temp = {};
        temp = _.map(this.optgroup.options,function(item){
            if(typeof item.map !== 'undefined'){
                item.options = item.map.getoptions();
                if(typeof item.visible == 'undefined'){
                    item.visible = true;
                }if(typeof item.editable == 'undefined'){
                    item.editable = true;
                }
                return {optgroup:{label:item.label||'',visible:item.visible,editable:item.editable,options:item.map.getoptions()}}
            }else{return item;}
        })
        return temp;
    }.bind(this),getoptions:function(search){
        var temp = [];
        _.each(this.optgroup.options,function(item){
            if(typeof item.map !== 'undefined'){
                temp = temp.concat(item.map.getoptions())
            }else{temp.push(item)}
        })
        if(typeof search !== 'undefined'){
            return _.find(temp,search)
        }
        return temp;
    }.bind(this),on:this.eventBus.on,handlers:this.handlers,optgroup:this.optgroup}

    Object.defineProperty(response, "waiting",{
        get: function(){
            // return true;
            return _.compact(waitlist).length>0;
        }
    });
    return response;
}
// gform.mapOptions.prototype.handlers = {initialize: []}
// gform.mapOptions.prototype.on = gform.prototype.sub;
// gform.mapOptions.prototype.trigger = gform.prototype.trigger;



gform.collectionManager = function(refObject){
    var collections = refObject||{};
    this.eventBus = new gform.eventBus({owner:'manager',item:'collection',handlers:{}}, this)
    
	return {
		add: function(name, data){
			collections[name] = data;
		},
		get: function(name){
			return collections[name];
		},
		update: function(name, data){
            if(typeof data !== 'undefined'){
                collections[name] = data;
            }
			this.eventBus.dispatch(name,collections[name]);
		}.bind(this),
		on: this.eventBus.on
	}
}


gform.collections =  new gform.collectionManager()

gform.render = function(template, options) {
    return gform.m(gform.stencils[template || 'text'] || gform.stencils['text'], _.extend({}, gform.stencils, options))
  }
  gform.create = function(text) {
   return document.createRange().createContextualFragment(text).firstChild;
  }
  gform.renderString = function(string,options) {
    return gform.m(string || '', options || {})
  }
  
  // add some classes. Eg. 'nav' and 'nav header'
  gform.addClass = function(elem, classes) {
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
        elem.className = _.chain(elem.className).split(/[\s]+/).union(classes.split(' ')).join(' ').value();
    }
    // return elem;
  };
  gform.hasClass = function(elem, classes) {
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
       return  (elem.className.indexOf(classes) !== -1);
    }
    // return elem;
  };
  gform.removeClass = function(elem, classes){
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
        elem.className = _.chain(elem.className).split(/[\s]+/).difference(classes.split(' ')).join(' ').value();
    }
    // return elem
  };
  gform.toggleClass = function(elem, classes, status){
    //   if(typeof status == 'undefined'){
    //       if(typeof classes == 'string'){
    //           classes = classes.split(' ');
    //       }
    //       debugger;
    //     _.each(classes,function(c){
    //         gform.toggleClass(elem,!gform.hasClass(elem,c))
    //     })
    //   }else{
        if(status){
            gform.addClass(elem,classes)
        }else{
            gform.removeClass(elem,classes)
        }
    //  }
    // return elem
  };
  
gform.VERSION = '0.0.1.1';
gform.i = 0;
gform.getUID = function() {
    return 'f' + (gform.i++);
};
gform.about = function(){
    return _.extend({version:gform.VERSION},gform.THEME,{types:_.keys(gform.types)})
};



gform.rows = {
    add:function(parent){
            var temp = gform.getUID();
            cRow = {};
            cRow.used = 0;
            cRow.ref  = document.createElement("div");
            cRow.ref.setAttribute("id", temp);
            cRow.ref.setAttribute("class", this.options.rowClass);
            cRow.ref.setAttribute("style", "margin-bottom:0;");
            parent.rows[temp] = cRow;
            parent.container.appendChild(cRow.ref);
            return cRow
    },
    remove:function(){

    }
}
gform.layout = function(field){

    if(field.columns >0 && field.visible){
        var search = {};
        if(typeof field.parent !== 'undefined'){
            var container = field.parent.container;

            field.operator = field.parent;

            if(typeof field.target == 'function'){
                field.target = field.target.call(field)
            }
            if(typeof field.target == 'string'){
                var temp = field.owner.el.querySelector(field.target);
                if(typeof temp !== 'undefined' && temp !== null){
                    search ={target:field.target};
                    container = temp;
                    field.operator = field.owner;
                }
            }
            
            var cRow  = _.findLast(field.operator.rows,search);
    
            if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > field.owner.options.columns || field.forceRow == true){
                cRow = search;
                cRow.id =gform.getUID();
                cRow.used = 0;
                cRow.ref = document.createElement("div");
                cRow.ref.setAttribute("id", cRow.id);
                cRow.ref.setAttribute("class", field.owner.options.rowClass);
                cRow.ref.setAttribute("style", "margin-bottom:0;");
                field.operator.rows = field.operator.rows || [];
                field.operator.rows.push(cRow);
                cRow.container = container;
                container.appendChild(cRow.ref);
            }
            cRow.used += parseInt(field.columns, 10);
            cRow.used += parseInt(field.offset, 10);
            cRow.ref.appendChild(field.el);
            field.row = cRow.id;
        }
    }
}
gform.createField = function(parent, atts, el, index, fieldIn,i,j, instance) {
    var field = gform.normalizeField.call(this,fieldIn,parent) 
    field.owner = this;
    if(field.columns > this.options.columns) { field.columns = this.options.columns; }

    if(field.fillable){
        if(!this.options.strict){
            if(field.array && typeof (atts[field.name] || field.owner.options.data[field.name]) == 'object'){
                field.value =  (atts[field.name] || field.owner.options.data[field.name])[index||0] || {};
            }else{
                // field.value =  atts[field.name] || field.owner.options.data[field.name] || field.value;
                field.value = _.defaults({value:atts[field.name]},{value:field.owner.options.data[field.name]},field).value
            }
        }else{
            if(field.array && typeof (atts[field.name] || field.owner.options.data[field.name]) == 'object'){
                field.value =  atts[field.name] || {};
            }else{
                field.value =  _.defaults({value:atts[field.name]},field).value
                
            }    
        }
    }

    if(field.array && typeof atts[field.name] == 'object'){
        if(field.fillable){field.value =  atts[field.name][index||0];}
    }else{

        // if(field.item.value !== 0){
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
                    f.set.call(null,f.derivedValue.call(null,e));
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
                if(field.fillable){field.value = _.defaults({value:atts[field.name],},field,{value:''}).value;}
            }
        // } else {
        //     field.value = 0;
        // }
    }


    field.index = field.index||instance||0;
    field.label = gform.renderString(field.item.label||field.label,field);
    // field.index = ;

    field.satisfied = field.satisfied || gform.types[field.type].satisfied.bind(field);
    field.update = gform.types[field.type].update.bind(field);
    field.destroy = gform.types[field.type].destroy.bind(field);
    if(gform.types[field.type].trigger){
        field.trigger = gform.types[field.type].trigger.bind(field);
    }else{
        field.trigger = field.owner.trigger;
    }
    
    field.active = function() {
        return this.parent.active() && this.editable && this.parsable && this.visible;
    }
    field.set = function(value, silent){
        //not sure we should be excluding objects - test how to allow objects
        if(this.value != value || value == null){// && typeof value !== 'object') {
            if(!gform.types[this.type].set.call(this,value)){
                this.value = value;

                if(!silent){
                    this.parent.trigger(['change'],this);
                    // this.parent.trigger('change',this);this.parent.trigger('change:'+this.name,this)
                };
            };
        }
    }.bind(field)

    field.get = field.get || gform.types[field.type].get.bind(field);
    field.toString = gform.types[field.type].toString.bind(field);

    field.render = field.render || gform.types[field.type].render.bind(field);
    
    field.el = gform.types[field.type].create.call(field);
debugger;
    field.container =  field.el.querySelector('fieldset')|| field.el || null;
    if(typeof gform.types[field.type].reflow !== 'undefined'){
        field.reflow = gform.types[field.type].reflow.bind(field) || null;
    }    
    if(typeof gform.types[field.type].find !== 'undefined'){
        field.find = gform.types[field.type].find.bind(field) || null;
    }    
    if(typeof gform.types[field.type].filter !== 'undefined'){
        field.filter = gform.types[field.type].filter.bind(field) || null;
    }


            //if(!this.options.clear) field.target = field.target;//||'[name="'+field.name+'"],[data-inline="'+field.name+'"]';

    if(!field.section){// && (this.options.clear || field.isChild)){
        gform.layout.call(this,field)
    }else{
        if(field.section){
            field.owner.el.querySelector('.'+field.owner.options.sections+'-content').appendChild(field.el);
        }
    }

    gform.types[field.type].initialize.call(field);
    field.isActive = true;
    Object.defineProperty(field, "path",{
        get: function(){
            var path = '/';
            if(this.ischild) {
                path = this.parent.path + '.';
                // if(this.parent.array){
                //     path += this.parent.index + '.';
                // }
            }
            path += this.name
            if(this.array){
                path+='.'+this.id
            }


            return path;
            // return _.find(field.meta,{key:key}).value;
        }
    });
    Object.defineProperty(field, "relative",{
        get: function(){
            var path = '/';
            if(this.ischild) {
                path = this.parent.relative + '.';
                // if(this.parent.array){
                //     path += this.parent.index + '.';
                // }
            }
            path += this.name
            return path;
            // return _.find(field.meta,{key:key}).value;
        }
    });
    Object.defineProperty(field, "count",{
        get: function(){
            return (this.index||0)+1;
        }
    });
    if(field.fields){
        var newatts = {};
        if(field.array && typeof (atts[field.name]|| field.owner.options.data[field.name]) == 'object'){
            newatts =  (atts[field.name]|| field.owner.options.data[field.name])[index||0] || {};
        }else{
            newatts = atts[field.name]|| (field.owner.options.data||{})[field.name] ||{};
        }
        field.fields = _.map(field.fields, gform.createField.bind(this, field, newatts, null, null) );
        if(field.array) {
            _.each(field.fields, gform.inflate.bind(this, newatts) );
            field.reflow()
        }
    }

    if(_.isArray(field.data)){
        _.each(field.data,function(i){
            if(typeof i.key == 'string' && i.key !== "" && typeof field[i.key] == 'undefined'){
                Object.defineProperty(field, i.key,{
                    get: function(key,field){
                        return _.find(field.data,{key:key}).value;
                    }.bind(null,i.key,field),
                    set: function(key,field,value){
                        _.find(field.data,{key:key}).value = value;
                        field.parent.trigger(i.key,field);
                    }.bind(null,i.key,field),
                    configurable: true
                });
            }
        })
    }

    return field;
}



gform.reflow = function(){
    if(this.isActive || (typeof this.owner !== 'undefined' && this.owner.isActive)){
        _.each(this.rows,function(item,i){
            if(typeof item !== 'undefined'){
                try{item.container.removeChild(item.ref);}catch(e){}
            }
            // delete this.rows[i];
        }.bind(this))    
        this.rows = [];
        _.each(this.fields,function(field){
            gform.layout.call(this,field)
        }.bind(this))
    }
}
gform.types = {
  'input':{
      base:'input',
      defaults:{},
      setup:function(){
          gform.types[this.type].setLabel.call(this)
      },
      setLabel:function(){
        // if(!this.item.label){
            var label = gform.renderString((this.format||{title:null}).title||this.item.title|| this.item.label||this.label, this);
            if(this.required){
                label+=this.requiredText+this.suffix;
            }
            var labelEl = this.el.querySelector('label');
            if(labelEl !== null){
                labelEl.innerHTML = label
            }
        // }
      },
      create: function(){
          var tempEl = document.createElement("span");
          tempEl.setAttribute("id", this.id);
          gform.addClass(tempEl,gform.columnClasses[this.columns])
          gform.addClass(tempEl,gform.offsetClasses[this.offset])
          gform.toggleClass(tempEl,'gform_isArray',!!this.array)

        //   if(this.owner.options.clear){
            // tempEl.setAttribute("class", gform.columnClasses[this.columns]+' '+gform.offsetClasses[this.offset]);
        //   }
          tempEl.innerHTML = this.render();
          return tempEl;
      },
      render: function(){
        //   return gform.render(this.type, this);
          return gform.render(this.type, this).split('value=""').join('value="'+_.escape(this.value)+'"')

      },
      destroy:function(){
          this.el.removeEventListener('change',this.onchangeEvent );		
        //   this.el.removeEventListener('change',this.onchange );		
          this.el.removeEventListener('input', this.onchangeEvent);
      },
      initialize: function(){
        //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.onchangeEvent = function(input){
            //   this.input = input;
              this.value = this.get();
              if(this.el.querySelector('.count') != null){
                var text = (this.value+"").length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }
            //   this.update({value:this.get()},true);
            //   gform.types[this.type].focus.call(this)
                gform.types[this.type].setup.call(this);
              this.parent.trigger(['change'], this,{input:this.value});
              if(input){
                this.parent.trigger(['input'], this,{input:this.value});
              }
          }.bind(this)
          this.input = this.input || false;
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

          this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
      },
      update: function(item, silent) {
        var oldDiv = this.el;

        if(typeof item !== 'undefined' && (
            typeof item.options !== undefined ||
            typeof item.max !== undefined ||
            typeof item.action !== undefined 
            )
            && typeof this.mapOptions !== 'undefined'){
            delete this.mapOptions;
            this.item = _.defaults({},item,this.item);

            // this.item.options = _.assign([],this.item.options,item.options);
            this.options = _.extend([],this.item.options);
            this.max = this.item.max;
            this.min = this.item.min;
            this.path = this.item.path;
            this.action = this.item.action;
        }
        // else if(typeof this.mapOptions !== 'undefined'){
        //     debugger;
        // }
        if(typeof item === 'object') {
            _.extend(this, item);
            this.item = _.extend(this.item, item);
        }
        //should be able to remove the or and just use this.item.label
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        // var oldDiv = document.getElementById(this.id);
        // debugger;
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        this.destroy();
        this.el = gform.types[this.type].create.call(this);
        oldDiv.parentNode.replaceChild(this.el,oldDiv);
        gform.types[this.type].initialize.call(this);
        this.el.style.display = this.visible ? "block" : "none";
        gform.types[this.type].edit.call(this,this.editable);

        if(!silent) {
            this.parent.trigger(['change'], this);
        }
        if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
        
      },
      get: function() {
          return this.el.querySelector('input[name="' + this.name + '"]').value;
      },
      set: function(value) {
          this.el.querySelector('input[name="' + this.name + '"]').value = value;
      },
      toString: function(name,report){
          if(!report){
            return '<dt>'+this.label+'</dt> <dd>'+(this.value||'(empty)')+'</dd><hr>'
          }else{
              return this.value
          }
      },
      satisfied: function(value) {
          value = value||this.value;
          if(_.isArray(value)){return !!value.length;}
          return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'number' && isNaN(value)));            
      },
      edit: function(state) {
          this.el.querySelector('[name="'+this.name+'"]').disabled = !state;
      },find:function() {
          return this;
      },
      focus:function() {
        //   debugger;
          this.el.querySelector('[name="'+this.name+'"]').focus();
        //   this.el.querySelector('[name="'+this.name+'"]').focus();
          var temp = this.value;
          this.set('');
          this.set(temp);
        //   this.el.querySelector('[name="'+this.name+'"]').select();
      }
      //display
  },
//   'textarea':,
  'bool':{

      base:'bool',
      defaults:{options:[false, true]},
      render: function() {
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(!this.strict && this.options[0]==false && this.options[1]==true){
            this.value = (!!this.value);
        }

        if(typeof this.mapOptions == 'undefined'){

          this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
          this.mapOptions.on('change',function(){
              this.options = this.mapOptions.getoptions()
              this.update();
          }.bind(this))
        }
        this.options = this.mapOptions.getoptions()

        //   this.selected = (this.value == this.options[1].value);
          return gform.render(this.type, this);

      },
      setLabel:function(){
        var label = gform.renderString((this.format||{title:null}).title||this.item.title|| this.item.label||this.label, this);
        if(this.required){
            label+=this.requiredText+this.suffix;
        }
        var labelEl = this.el.querySelector('label[for='+this.name+']');
        if(labelEl !== null){
            labelEl.innerHTML = label
        }
          
      },
      initialize: function(){
          this.onchangeEvent = function(input){
              this.value = this.get();
              (_.find(this.options,{selected:true})||{selected:null}).selected = false;
              (_.find(this.options,{value:this.value})||this.options[0]||{value:""}).selected = true;
              gform.types[this.type].setup.call(this);

              this.parent.trigger(['change','input'], this,{input:this.value});
          }.bind(this)
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
          this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
      },
      set: function(value) {
        //   this.selected = (value == this.options[1].value);
          this.el.querySelector('input[name="' + this.name + '"]').checked = (value == this.options[1].value);
      },
      get: function() {
          return this.options[this.el.querySelector('input[name="' + this.name + '"]').checked?1:0].value
      },satisfied: function(value) {

        value = value||this.value;
        return value == this.options[1].value;
      },
      toString: function(name,report){
        if(!report){
          return '<dt>'+this.label||this.display||this.name+'</dt> <dd>'+(this.value||'(empty)')+'</dd><hr>'

        }else{
            return this.value
        }
    }
  },
  'collection':{

    base:'collection',
      defaults:{format:{label: '{{{label}}}',  value: function(item){
          if(item.value !== 'undefined'){
            return item.value;
          }else{
            return (item.label || item.index).toLowerCase().split(' ').join('_');
          }
	}}},
      toString: function(name,report){
        if(!report){
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        if(typeof lookup !== 'undefined'){
                            returnVal+='<dd>'+lookup.label+'</dd>'                        
                        }
                        return returnVal;
                    }.bind(this),'<dt>'+this.label+'</dt> ')+'<hr>'
                }else{
                    return '<dt>'+this.label+'</dt> <dd>(no selection)</dd><hr>';
                }
            }else{
                return '<dt>'+this.label+'</dt> <dd>'+((_.find(this.list,{value:this.value})||{label:""}).label||'(no selection)')+'</dd><hr>';
            }
        }else{
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        returnVal.push(lookup.label)
                        return returnVal;
                    }.bind(this),[])+'<hr>'
                }else{
                    return '';
                }
            }else{
                return (_.find(this.list,{value:this.value})||{label:""}).label;
            } 
        }
      },
      render: function() {

        if(typeof this.mapOptions == 'undefined'){
            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            this.mapOptions.on('change', function(){

                this.options = this.mapOptions.getobject()
                this.list = this.mapOptions.getoptions();
                if(!this.mapOptions.waiting){
                    if(this.multiple){
                        if(!_.isArray(this.value)){
                            this.value = [this.value]
                        }
                        // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                        _.each(this.value,function(value){
                            (_.find(this.list,{value:value})||{selected:null}).selected = true;
                        }.bind(this))
        
                    }else{
                        (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                        (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                    }
                }
                this.update();
            }.bind(this))

            this.mapOptions.on('collection',function(e){
                e.field.field.owner.trigger("collection",e.field.field)
            })
            }
            this.options = this.mapOptions.getobject();
            this.list = this.mapOptions.getoptions();

            if(!this.mapOptions.waiting){
                if(this.multiple){
                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                    }
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))

                }else{
                    var search = _.find(this.list,{value:this.value});
                    if(typeof search == 'undefined'){
                        if(this.other||false){
                            this.value = 'other';
                        }else{
                            // this.value = ""
                        }
                    }
                    if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                        this.options.push({label:"Other", value:'other',})
                    }
        
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                }
            }
            return gform.render(this.type, this);        
      },
      setup:function(){

        if(this.multiple && typeof this.limit !== 'undefinded'){
            if(this.get().length >= this.limit){
                this.maxSelected = true;
                _.each(this.el.querySelector('select').options,function(item){
                    item.disabled = !item.selected;
                })
            }else if (this.maxSelected) {
                this.maxSelected = false;
                _.each(this.el.querySelector('select').options,function(item){
                    item.disabled = false;
                })  
            }
            if(this.el.querySelector('.count') != null){
                var text = this.get().length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }
          }
          gform.types[this.type].setLabel.call(this)
      },
      initialize: function() {       
        //   debugger;
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value =  this.get();

            //   (_.find(this.list,{selected:true})||{selected:null}).selected = false;
            //   (_.find(this.list,{value:this.value})||{selected:null}).selected = true;

            if(this.multiple){
                if(!_.isArray(this.value)){
                    this.value = [this.value]
                  }
                // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                _.each(this.value,function(value){
                    (_.find(this.list,{value:value})||{selected:null}).selected = true;
                }.bind(this))

            }else{
                (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
            }


            if(this.el.querySelector('.count') != null){
                var text = this.value.length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
            }

            gform.types[this.type].setup.call(this);
            this.parent.trigger(['change','input'], this,{input:this.value});

          }.bind(this));

          gform.types[this.type].set.call(this,this.value);
        //   gform.types[this.type].setup.call(this);

      },
      get: function() {
          var value = this.el.querySelector('select').value;
          search = _.find(this.list,{i:parseInt(value,10)});
          if(typeof search == 'undefined'){
            if(this.other){
                value = "other";
            }else{
                value = null;
            }
          }else{
            value = search.value;
          }
          
         
          if(this.multiple){
            var that = this;
            value = _.transform(this.el.querySelector('select').options,function(orig,opt){
                if(opt.selected){
                    var option = _.find(that.list,{i:parseInt(opt.value)});
                    if(typeof option !== 'undefined'){
                        orig.push(option.value)
                    }
                }
            },[])
          }
        //   this.option = _.find()
          return value;
      },
      set: function(value) {

        //   _.each(this.options.options, function(option, index){
        //       if(option.value == value || parseInt(option.value) == parseInt(value)) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
        //   }.bind(this))
        if(this.multiple){
            if(!_.isArray(value)){
                value = [value]
            }
          if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
          _.each(this.el.querySelector('select').options, function(option){
            //  option.selected = (value.indexOf(option.value)>=0)
             var search = _.find(this.list,{i:parseInt(option.value)})
             option.selected =  (typeof search !== 'undefined' && value.indexOf(search.value)>=0);
          }.bind(this))
        }else{
            var search = _.find(this.list,{value:value});
            if(typeof search !== 'undefined'){
                this.el.querySelector('select').value = search.i;
            }else{
                this.el.querySelector('select').value = null;
            }
        }
        if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
        
      },
      focus:function() {

        var search = this.name;
        if(this.multiple){search+='[]'}
          this.el.querySelector('[name="'+search+'"]').focus();
      },edit: function(state) {
        var search = this.name;
        if(this.multiple){search+='[]'}

        this.isEditable = state||this.isEditable||true;

        if(typeof this.mapOptions !== 'undefined' && this.mapOptions.waiting){
          this.el.querySelector('[name="'+search+'"]').disabled = true;

        }else{
          this.el.querySelector('[name="'+search+'"]').disabled = !this.isEditable;

        }
      }
  },
  'section':{

    base:'section',
    filter: function(search,depth){
        return gform.filter.call(this,search,depth);
    },
    setLabel:function(){
        if(!!this.item.label){
            var label = gform.renderString(this.item.label||this.label, this);
            if(this.required){
                label+=this.requiredText+this.suffix;
            }
            var labelEl = this.el.querySelector('fieldset#'+this.id+'>legend')
            if(labelEl !== null){
                labelEl.innerHTML = label
            }
        }
      },
      create: function() {
          var tempEl = gform.create(this.render());
          gform.addClass(tempEl,gform.columnClasses[this.columns])
          gform.addClass(tempEl,gform.offsetClasses[this.offset])
          gform.toggleClass(tempEl,'gform_isArray',!!this.array)

          return tempEl;
      },
      initialize: function() {
          //handle rows
          this.rows = [];
      },        
      render: function() {
          if(this.section){
              return gform.render(this.owner.options.sections+'_fieldset', this);                
          }else{
              return gform.render('_fieldset', this);                
          }
      },      
      update: function(item, silent) {

        if(typeof item === 'object') {
            _.extend(this.item,item);
        }
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        // var oldDiv = document.getElementById(this.id);
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
          this.el.style.display = this.visible ? "block" : "none";
          gform.types[this.type].edit.call(this,this.editable);

          this.container =  this.el.querySelector('fieldset')|| this.el || null;
          this.reflow();
          if(!silent) {
            //   this.parent.trigger('change:'+this.name, this);
            //   this.parent.trigger('change', this);
              this.parent.trigger(['change'], this);
          }
        },
      get: function(name) {
          return gform.toJSON.call(this, name)
      },
      toString: function(name, report) {
          if(!report){
            return '<h4>'+this.label+'</h4><hr><dl style="margin-left:10px">'+gform.toString.call(this, name)+'</dl>';
          }else{
            return gform.toString.call(this, name,report);
          }
      },
      set: function(value){

        if(value == null || value == ''){
            gform.each.call(this, function(field) {
                field.set('');
            })
        }else{
            _.each(value,function(item,index){
                var field = this.find(index);
                if(field.array && _.isArray(item)){
                    var list = this.filter({array:{ref:field.array.ref}},1)

                    if(list.length > 1){
                        _.each(list.slice(1),function(field){
                            var index = _.findIndex(field.parent.fields,{id:field.id});
                            field.parent.fields.splice(index, 1);
                        })
                    }

                    var testFunc = function(selector,status, button){
                        gform.toggleClass(button.querySelector(selector),'hidden', status)
                    }
                    if(_.isArray(item)){
                        field.set(item[0]);
                    }

                    // if(!this.owner.options.strict){
                        // _.each(field.fields, gform.inflate.bind(this.owner, atts[field.name]|| field.owner.options.data[field.name] || {}) );
                    // }else{
                        var attr = {};
                        attr[field.name] = item;
                        gform.inflate.call(this.owner,attr,field,_.findIndex(field.parent.fields,{id:field.id}),field.parent.fields);
                    // }

                    var fieldCount = this.filter({array:{ref:field.array.ref}},1).length

                    _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
                    _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
         
                    field.operator.reflow();



                }else{
                    // gform.inflate.bind(this, this.options.data||{})
                    if(typeof field !== 'undefined'){
                        field.set(item);
                    }
                }
            }.bind(this))
        }
        return true;

      },
      find: function(name) {
          return gform.find.call(this, name)
      },
      reflow: function() {
          gform.reflow.call(this)
      },
      focus:function() {
          if(typeof this.fields !== 'undefined' && this.fields.length){
            gform.types[this.fields[0].type].focus.call(this.fields[0]);
          }
      },
      satisfied: function(value) {
          value = value||this.get();
          return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'object' && _.isEmpty(value)));            
      },
      trigger: function(a,b,c){
        // if(typeof a == 'string' && typeof b == 'object') {
        //     this.parent.dispatch(a+b.name,b,c);
        //     this.parent.dispatch(a,b,c);
        // }else{
        //     this.dispatch(a,b,c);
        // }
        if(typeof a == 'string'){ 
            a = [a];
        }
        var events = _.extend([],a);

        _.each(a, function(item){
            if(item.indexOf(':') == '-1'){
                events.unshift(item+':'+this.name)
            }
        }.bind(this))
        // a.unshift(a+':'+this.name)
        this.parent.trigger(_.uniq(events),b,c);

      }
  },
  'button':{
    base:'button',
    toString: function(){return ''},
      defaults:{parse:false, columns:2, target:".gform-footer"},
      create: function() {
          var tempEl = gform.create(this.render());
          tempEl.setAttribute("id", this.id);
          // tempEl.setAttribute("class", tempEl.className+' '+gform.columnClasses[this.columns]);
          return tempEl;
      },
      initialize: function() {
          this.action = this.action || (this.label||'').toLowerCase().split(' ').join('_'), 
          this.onclickEvent = function(){
              if(this.editable) {
                  this.parent.trigger(this.action, this);
              }
          }.bind(this)
          this.el.addEventListener('click',this.onclickEvent );	
      },        
      render: function() {
          return gform.render('button', this);
      },
      satisfied: function(value) {
          return this.editable && this.visible;
      },
      update: function(item, silent) {
          
          if(typeof item === 'object') {
              _.extend(this, this.item, item);
          }
        //   this.label = gform.renderString(this.item.label, this);
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        //   var oldDiv = document.getElementById(this.id);
        //   var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
          this.el.style.display = this.visible ? "block" : "none";
          gform.types[this.type].edit.call(this,this.editable);


      },        
      destroy:function() {		
          this.el.removeEventListener('click', this.onclickEvent);
      },
      get: function(name) {
          return null
      },
      set: function(value) {
      },
      edit: function(state) {
          this.editable = state;
          this.el.disabled = !state;
          gform.toggleClass(this.el,'disabled',!state)

      },
      focus:function() {
        this.el.focus();
      }
  }
};

// remove the added classes
gform.types['text'] = gform.types['password'] = gform.types['color'] = gform.types['input'];
gform.types['number']= _.extend({}, gform.types['input'],{get:function(){
    return parseInt(this.el.querySelector('input[name="' + this.name + '"]').value,10);
}, render: function(){
    return gform.render(this.type, this).split('value=""').join('value="'+this.value+'"')
},});
gform.types['hidden']   = _.extend({}, gform.types['input'], {defaults:{columns:false},toString: function(){return ''}});
gform.types['output']   = _.extend({}, gform.types['input'], {
    toString: function(){return ''},
    render: function(){
        this.display = gform.renderString((this.format|| {}).value||'{{{value}}}', this);
        return gform.render(this.type, this);
    },
    get: function() {
        return this.value;
    },
    set: function(value) {
        this.value = value;
        this.display = gform.renderString((this.format|| {}).value||'{{{value}}}', this);
        // gform.renderString(this.template, this);
        this.el.querySelector('output').innerHTML = this.display;

    },
});

gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{validate: [{ type:'valid_email' }]}});

gform.types['textarea'] = _.extend({}, gform.types['input'], {
      set: function(value) {
          this.el.querySelector('textarea[name="' + this.name + '"]').value = value;
      },
      get: function() {
          return this.el.querySelector('textarea[name="' + this.name + '"]').value;
      }
  });
gform.types['switch'] = gform.types['checkbox'] = _.extend({}, gform.types['input'], gform.types['bool']);
gform.types['fieldset'] = _.extend({}, gform.types['input'], gform.types['section']);
gform.types['select']   = _.extend({}, gform.types['input'], gform.types['collection'],{
    render: function() {
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){
          this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
          this.mapOptions.on('change', function(){

            this.options = this.mapOptions.getobject()
            this.list = this.mapOptions.getoptions()

            if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                this.options.push({label:"Other", value:'other'})
                this.list.push({label:"Other", value:'other'})
            }
    
            if(typeof this.placeholder == 'string'){
                // this.value = this.value || -1
                this.options.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
                this.list.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
            }
            if(!this.mapOptions.waiting){
                if(this.multiple){

                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                    }
                    // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))

                }else{
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    // (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                    var search = _.find(this.list,{value:this.value});
                    if(typeof search == 'undefined'){
                        if(typeof this.placeholder == 'string'){
                            this.value = '';
                        }else{
                            this.value = (this.list[0]||{value:""}).value
                            if(this.list.length){
                            this.list[0].selected = true;
                            }
                        }
                    }else{
                        search.selected = true;
                    }
                }
            }
              this.update();
          }.bind(this))
          this.mapOptions.on('collection',function(e){
            e.field.field.owner.trigger("collection",e.field.field)
          })
        //   this.mapOptions.on('collection',function(e){
        //     console.log(this.mapOptions.waiting)
        //   }.bind(this))
        }
        this.options = this.mapOptions.getobject();
        this.list = this.mapOptions.getoptions()

        // var search = _.find(this.list,{value:this.value});
        // if(typeof search == 'undefined'){
        //     if(this.other||false){
        //         this.value = 'other';
        //     }else{
        //         if(typeof this.placeholder == 'string'){
        //             this.value = '';
        //         }else{
        //             this.value = (this.list[0]||{value:""}).value
        //         }
        //     }
        // }
        
        // if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
        //     this.options.push({label:"Other", value:'other'})
        //     this.list.push({label:"Other", value:'other'})
        // }

        if(typeof this.placeholder == 'string'){
            // this.value = this.value || -1
            this.options.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
            this.list.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
        }

        // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
        // (_.find(this.list,{value:this.value})||{value:""}).selected = true;
        if(!this.mapOptions.waiting){
            if(this.multiple){
                if(!_.isArray(this.value)){
                    this.value = [this.value]
                }
                (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                _.each(this.value,function(value){
                    (_.find(this.list,{value:value})||{selected:null}).selected = true;
                }.bind(this))

            }else{
    
                if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                    this.options.push({label:"Other", value:'other'})
                    this.list.push({label:"Other", value:'other'})
                }
                (_.find(this.list,{selected:true})||{selected:null}).selected = false;

                var search = _.find(this.list,{value:this.value});
                if(typeof search == 'undefined'){
                    if(this.other||false){
                        this.value = 'other';
                    }else{
                        if(typeof this.placeholder == 'string'){
                            this.value = '';
                        }else{
                            this.value = (this.list[0]||{value:""}).value
                            if(this.list.length){
                            this.list[0].selected = true;
                            }
                        }
                    }
                }else{
                    search.selected = true;
                }
            }
        }
        return gform.render('select', this);
    }
});
gform.types['range']   = _.extend({}, gform.types['input'], gform.types['collection'],{
  get: function(){
      return (this.el.querySelector('[type=range]')||{value:''}).value; 
  },
  set:function(value){
      this.el.querySelector('[type=range]').value = value;   
  }
});

gform.types['radio'] = _.extend({}, gform.types['input'], gform.types['collection'], {
  setup: function(){
    if(this.multiple && typeof this.limit !== 'undefinded'){        
        if(this.get().length>= this.limit){
            this.maxSelected = true;
            _.each(this.el.querySelectorAll('[type=checkbox]'),function(item){
                item.disabled = !item.checked;
            })
        }else if (this.maxSelected) {
            this.maxSelected = false;
            _.each(this.el.querySelectorAll('[type=checkbox]'),function(item){
                item.disabled = false;
            })  
        }
        if(this.el.querySelector('.count') != null){
          var text = this.get().length;
          if(this.limit>1){text+='/'+this.limit;}
          this.el.querySelector('.count').innerHTML = text;
        }
    }
    
        // if(this.other){
        //     this.el.querySelector('input').style.display = (this.value == 'other')?"inline-block":"none";
        // }

        gform.types[this.type].setLabel.call(this)
    },      
    render: function() {
        if(typeof this.item.size !== 'undefined'){
            this.size = Math.floor(((gform.columns || 12)/this.item.size))
        }
        if(typeof this.mapOptions == 'undefined'){
            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            this.mapOptions.on('change', function(){
                this.options = this.mapOptions.getoptions()
                this.list = this.mapOptions.getoptions()
                if(this.multiple){
                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                      }
                    // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))
    
                }else{
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                }
                this.update();
            }.bind(this))

            this.mapOptions.on('collection',function(e){
                e.field.field.owner.trigger("collection",e.field.field)
            })
            }
            this.options = this.mapOptions.getoptions();
            this.list = this.mapOptions.getoptions()
            if(!this.mapOptions.waiting){
                if(this.multiple){
                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                    }
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))

                }else{
                    var search = _.find(this.list,{value:this.value});
                    if(typeof search == 'undefined'){
                        if(this.other||false){
                            this.value = 'other';
                        }else{
                            // this.value = ""
                        }
                    }
                    if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                        this.options.push({label:"Other", value:'other',})
                    }
        
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                }
            }

            return gform.render(this.type, this);        
      },
  get: function(){
      if(this.multiple){

        var that = this;
          return _.transform(this.el.querySelectorAll('[type="checkbox"]:checked'),function(value,item){
            //   debugger;
              value.push(_.find(that.list,{i:parseInt(item.value)}).value).bind
            },[])
      }else{
        return (_.find(this.list,{i:parseInt((this.el.querySelector('[type="radio"]:checked')||{value:null}).value)}) ||{value:''}).value;
        // return (this.el.querySelector('[type="radio"]:checked')||{value:''}).value; 
      }
  },
  set:function(value){
    if(this.multiple){
        if(!_.isArray(value)){
          value = [value]
        }
        if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
        _.each(this.el.querySelectorAll('[type=checkbox]'), function(option){
        //    option.checked = (value.indexOf(option.value)>=0)
           var search = _.find(this.list,{i:parseInt(option.value)})
           option.selected =  (typeof search !== 'undefined' && value.indexOf(search.value)>=0);

           
        }.bind(this))
      
      }else{
        var index = (_.find(this.list,{value:value})||{i:''}).i
        var el = this.el.querySelector('[value="'+index+'"]');
        if(el !== null){
            el.checked = 'checked';
        }
      }
      if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
  },
  edit: function(state) {
      _.each(this.el.querySelectorAll('input'),function(item){
          item.disabled = !state;            
      })
  },	
  focus: function(){
    this.el.querySelector('[type="radio"],[type="checkbox"]').focus();
  }
});

gform.types['scale']    = _.extend({}, gform.types['radio']);
gform.types['checkboxes']    = _.extend({}, gform.types['radio'],{multiple:true});
gform.types['grid'] = _.extend({}, gform.types['input'], gform.types['section'], gform.types['collection'],{
    render: function() {
        // this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){

            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            
            this.mapOptions.on('change',function(){
                this.options = this.mapOptions.getobject()
                this.list = this.mapOptions.getoptions()
                this.update();
            }.bind(this))
        }
        this.options = this.mapOptions.getobject()
        this.list = this.mapOptions.getoptions()

        this.fields = _.map(this.fields, function(field){
            return _.assignIn({
                name: (gform.renderString(field.label)||'').toLowerCase().split(' ').join('_'), 
                id: gform.getUID(), 
                label: field.name,     
            }, field)
    
        })

        return gform.render(this.type, this);
    },
    setup: function(){
        if(this.multiple && typeof this.limit !== 'undefinded'){
            _.each(this.fields,function(field){
                var value = this.value[field.name]||[];
                if(value.length >= this.limit){
                    field.maxSelected = true;
                    _.each(this.el.querySelectorAll('[type=checkbox][name="' + field.id + '"]'),function(item){
                        item.disabled = !item.checked;
                    })
                }else if (field.maxSelected) {
                    field.maxSelected = false;
                    _.each(this.el.querySelectorAll('[type=checkbox][name="' + field.id + '"]'),function(item){
                        item.disabled = false;
                    })  
                }
            }.bind(this))
        }

        gform.types[this.type].setLabel.call(this)
    },
    initialize: function() {
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value =  this.get();
              gform.types[this.type].setup.call(this);
              this.parent.trigger(['change','input'], this,{input:this.value});

          }.bind(this));
          gform.types[this.type].setup.call(this);
          this.rows = [];
          this.fields = _.map(this.fields,function(item){item.type='hidden';return item;})
      },
    get: function(){
        if(this.multiple){
            return _.transform(this.fields,function(result,field){
                result[field.name]= _.transform(this.el.querySelectorAll('[type="checkbox"][name="' + field.id + '"]:checked'),function(value,item){value.push(item.value)},[])
            }.bind(this),{})

        }else{
            return _.transform(this.fields,function(result,field){result[field.name]=(this.el.querySelector('[type="radio"][name="' + field.id + '"]:checked')||{value:''}).value}.bind(this),{})
        }
    },
    set:function(value){
        if(this.multiple){
            _.each(this.fields,function(value,field){
                if(typeof this.limit !== 'undefinded' && value != null && (value.length > this.limit)){return true}
                _.each(this.el.querySelectorAll('[name="' + field.id + '"][type=checkbox]'), function(value,option){
                option.checked = (value.indexOf(option.value)>=0)
                }.bind(this,value[field.name]))

            }.bind(this,value))
        }else{
            _.each(this.fields,function(field){
                var el = this.querySelector('[name="' + field.id + '"][value="'+value[field.name]+'"]');
                if(el !== null) {
                    el.checked = 'checked';
                }
            }.bind(this))
        }
        this.value = value;
        gform.types['grid'].setup.call(this)
    },
    focus:function() {
        // this.fields[0].name
        this.el.querySelector('[name="'+this.fields[0].id+'"]').focus();
    }
});



gform.types['custom_radio'] = _.extend({}, gform.types['input'], gform.types['collection'], {
    set: function(value) {
        this.el.querySelector('[data-value="'+value+'"]').click();
    },		
    defaults: {
        selectedClass: 'btn btn-success',
        defaultClass: 'btn btn-default',
    },
    get: function() {
        return (this.el.querySelector('.' +  this.selectedClass.split(' ').join('.'))||({dataset:{value:""}})).dataset.value;
    },
    toggle:function(e){
        var elem = this.el.querySelector('.' + this.selectedClass.split(' ').join('.'));
        gform.toggleClass(elem, this.selectedClass, false)
        gform.toggleClass(elem, this.defaultClass, true)
        gform.toggleClass(e.target, this.defaultClass, false)
        gform.toggleClass(e.target, this.selectedClass, true)
        this.owner.trigger('change', this);
        this.owner.trigger('input', this);
    },
    initialize: function() {
        var anchors = this.el.querySelectorAll('a');
        for (const anchor of anchors) {
            anchor.removeEventListener('click', gform.types[this.type].toggle.bind(this));
            anchor.addEventListener('click', gform.types[this.type].toggle.bind(this));
            
          }
        // this.el.querySelectorAll('a').removeEventListener('click', gform.types[this.type].toggle.bind(this));
        
    }
  });

//   gform.types['custom_check'] = _.extend({}, gform.types['input'], gform.types['bool'], {
//     set: function(value) {
//         this.el.querySelector('[data-value="'+value+'"]').click();
//     },		
//     defaults: {
//         selectedClass: 'btn btn-success ',
//         defaultClass: 'btn btn-default',
//     },
//     get: function() {
//         return (this.el.querySelector('.' +  this.selectedClass.split(' ').join('.'))||({dataset:{value:""}})).dataset.value;
//     },
//     initialize: function() {
//         this.$el = $(this.el.querySelector('.custom-group'));
//         this.$el.children('a').off();
//         // this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

//         this.$el.children('a').on('click', function(e){
//             this.$el.children('.' + this.selectedClass.split(' ').join('.')).toggleClass(this.selectedClass + ' ' + this.defaultClass);
//             $(e.target).closest('a').toggleClass(this.selectedClass + ' ' + this.defaultClass);


//             this.owner.trigger('change', this);
//             this.owner.trigger('input', this);
//         }.bind(this));
//     }
//   });



//tags
//upload
//base64
gform.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'show' || conditions === 'edit'  || conditions === 'parse') {
			conditions = this.item[conditions];
		}
		if(typeof conditions !== 'undefined' && conditions.indexOf('method:') == 0){
			if(typeof this.owner.methods !== 'undefined' && typeof this.owner.methods[conditions.split('method:')[1]] == 'function'){
				func.call(this, this.owner.methods[conditions.split('method:')[1]].call(null,{form:this.owner,field:this}),{form:this.owner,field:this})
			}
		}
	}
	if (typeof conditions === 'boolean') {
		func.call(this, conditions,{form:this.owner,field:this})
	}
	if (typeof conditions === 'function') {
		func.call(this, conditions.call(null,{form:this.owner,field:this}),{form:this.owner,field:this})
	}
	if (typeof conditions === 'object') {
		var callback = function(rules,func,e){
			func.call(this, gform._rules.call(this, rules),e)
		}.bind(this, conditions, func)
		gform._subscribeByName.call(this, conditions, callback)
	}
	return true;
};

gform._subscribeByName = function(conditions, callback){
	for(var i in conditions) {
		if(typeof conditions[i].conditions == 'object'){
			gform._subscribeByName.call(this, conditions[i].conditions, callback)
		}else{
			var temp = this.parent.find(conditions[i].name);
			if((conditions[i].name||this.name).indexOf('/')!==0 && typeof temp !== 'undefined'){

				
				// if(typeof temp !== "undefined"){
					this.eventlist = this.eventlist||[];
					// debugger;

					this.owner.on('change:' + temp.path, callback, this.eventlist)

				// }else{
				// 	this.owner.on('change:' + (this.parent.find(conditions[i].name||this.name)||this.parent).path||(conditions[i].name||this.name), callback)
				// }
			}else{
				this.owner.on('change:' + (conditions[i].name||this.name), callback)
			}
		}
	}
}

gform._rules = function(rules, op){
	var op = op||'and';
	return _.reduce(rules,function(result, rule){
		var s;
		if(typeof rule.conditions !== 'undefined'){
			s = gform._rules.call(this, rule.conditions,rule.op);
		}else{
			s = gform.conditions[rule.type](this, rule);
		}
		if(op == 'or'){
			return result || s;
		}else{
			return result && s;
		}
	}.bind(this),(op == 'and'))
}

gform.conditions = {
	requires: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name})[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}
		return looker.satisfied();
	},
	// valid_previous: function(gform, args) {},
	not_matches: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name})[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = looker[args.attribute||'value'];

		if(typeof val== "object" && val !== null && localval !== null){
			return (val.indexOf(localval) == -1);
		}else{
			return (val !== localval);
		}
	},
	test: function(field, args) {
		return args.test.call(this, field, args);
	},
	contains: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name})[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args.value;
		var targetField = looker;
		var localval = null;
		if(typeof targetField !== 'undefined'){
			if(targetField.array != false){
				localval = field.parent.find(args.name).parent.get()[args.name]
			}else{
				localval = targetField.value;
			}
		}else{
			looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth)[0];
			if(typeof looker == 'undefined'){
				return false;
			}
		}

		if(typeof val == "object" && val !== null && localval !== null){
			if(typeof localval == 'object'){
				return (_.intersection(val,localval).length >0)
			}else if(typeof localval == 'string'){
				return _.some(val, function(filter) { return (localval.indexOf(filter) >= 0); });				
			}
		}else{
			return (typeof localval !== 'undefined'  && localval.indexOf(val) !== -1 )
		}
	},
	matches: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name})[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = looker[args.attribute||'value'];
		if(typeof val== "object" && val !== null && localval !== null){
			return (val.indexOf(localval) !== -1);
		}else{
			return (val == localval);
		}
	},

	matches_bool: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name})[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = looker[args.attribute||'value'];
		return (val == "false" || !val) == (localval == "false" || !localval)
	},
	matches_numeric: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name})[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = parseInt(looker[args.attribute||'value']);
		if(typeof val== "object" && val !== null && localval !== null){
			return (_.map(val,function(vals){return parseInt(vals);}).indexOf(localval) !== -1);
		}else{
			return (parseInt(val) == localval);
		}
	}
}; gform.prototype.errors = {};
gform.prototype.validate = function(force){
	this.valid = true;
	_.each(this.fields, gform.validateItem.bind(null, force))
	if(!this.valid){
		this.trigger('invalid',{errors:this.errors});
	}else{
		this.trigger('valid');
	}
	this.trigger('validation');
	return this.valid;
};
gform.handleError = gform.update;

gform.validateItem = function(force,item){
	var value = item.get();
	if(force || !item.valid || item.required || item.satisfied(value)){
		item.valid = true;
		item.errors = '';
		if(item.parsable && typeof item.validate === 'object'){
			var errors = gform.validation.call(item,item.validate);
			if(item.required){
				var type = (item.satisfied(item.get()) ? false : '{{label}} is required')
				if(type) {
					errors.push(gform.renderString(item.required.message || type, {label:item.label,value:value, args:item.required}));
				}
			}
			errors = _.compact(errors);
			if((typeof item.display === 'undefined') || item.visible) {
				item.valid = !errors.length;
				item.errors = errors.join('<br>')
				gform.handleError(item);
			}

		}
		
	}
	if(item.parsable){
		//validate sub fields
		if(typeof item.fields !== 'undefined'){
			_.each(item.fields, gform.validateItem.bind(null,force))
		}
	}
	if(item.errors) {
		item.owner.trigger('invalid:'+item.name, {errors:item.errors});
	}else{
		item.owner.trigger('valid:'+item.name);
	}
	item.owner.errors[item.name] = item.errors;
	item.owner.valid = item.valid && item.owner.valid;


};

gform.validation = function(rules, op){
	var op = op||'and';
	var value = this.get();
	var errors =  _.map(rules, function(v, it){
		if(typeof it.type == 'string'){
			if(typeof it.conditions == 'undefined' || gform._rules.call(this, it.conditions)){
					var type = v[it.type].call(this, value, it);
					if(type){	
						return gform.renderString(it.message || type, {label:this.label,value:value, args:it});
					}
			}
		}else if(typeof it.tests !== 'undefined'){
			return gform.validation.call(this,it.tests,it.op).join('<br>');
		}
	}.bind(this, gform.validations))
	if(op == 'and' || _.compact(errors).length == rules.length){
		return errors;
	}else{
		return [];
	}
}

gform.regex = {
	numeric: /^[0-9]+$/,
	decimal: /^\-?[0-9]*\.?[0-9]+$/,
	url: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
	date: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
	email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i
};

gform.validations = 
{	
	none:function(value) {
			return false;
	},
	required:function(value) {
			return (this.satisfied(value) ? false : '{{label}} is required');
	},
	pattern: function(value, args) {
		var r = args.regex;
		if(typeof r == 'string'){
			if(typeof gform.regex[r] !== 'undefined'){
				r = gform.regex[r]
			}else{
				
				r = new RegExp(args.regex, args.flags);
			}
		}
		return r.test(value) || value === '' ? false : args.message;
	},
	custom: function(value, args) {

		if(typeof args.test === 'function' || (typeof args.test === 'string' && typeof this.owner.methods[args.test] == 'function') ) {
			args.test = this.owner.methods[args.test] || args.test;
		}
		// return args.test.call(this, value, args);
		args.field = this;
		args.form = this.owner;
		args.value = value
		return args.test.call(null, args);

	},
	matches:function(value, args) {
		var temp = this.parent.find(args.name);
		if(typeof temp == 'undefined'){return "Matching field not defined";}
		args.label = temp.label;
		args.value = temp.get();
		return (value == args.value ? false : '"{{label}}" does not match the "{{args.label}}" field');
	},
	date: function(value) {
			return gform.regex.date.test(value) || value === '' ? false : '{{label}} should be in the format MM/DD/YYYY';
	},
	valid_url: function(value) {
		return gform.regex.url.test(value) || value === '' ? false : '{{label}} must contain a valid Url';
	},
	valid_email: function(value) {
			return gform.regex.email.test(value) || value === '' ? false : '{{label}} must contain a valid email address';
	},
	length:function(value, args){
		if (!gform.regex.numeric.test(args.max) && !gform.regex.numeric.test(args.min)) {
			return 'Invalid length requirement';
		}

		if(typeof args.max == 'number' && typeof args.min == 'number' && args.min == args.max){
			if(args.min == value.length){
				return false
			}else{
				return '{{label}} must be exactly '+args.min+' characters in length';
			}
		}
		if(typeof args.max == 'number' && value.length > args.max){
			return '{{label}} must not exceed '+args.max+' characters in length'
		}
		if(typeof args.min == 'number' && value.length>0 && value.length < args.min){
			return '{{label}} must be at least '+args.min+' characters in length'
		}
		return false
	},
	numeric: function(value, args) {
		if(!(gform.regex.decimal.test(value) || value === '')){
			return '{{label}} must contain only numbers';
		}
		if(typeof args.min == 'number' && parseFloat(value) < parseFloat(args.min)){
			return '{{label}} must contain a number greater than {{args.min}}'
		}
		if(typeof args.max == 'number' && parseFloat(value) > parseFloat(args.max)){
			return '{{label}} must contain a number less than {{args.max}}'
		}
	}
};