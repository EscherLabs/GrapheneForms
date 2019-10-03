var gform = function(data, el){
    "use strict";
    //event management

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
                }
            })
        }
        this.dispatch(_.uniq(events),b,c);
    }.bind(this)
	this.dispatch = this.eventBus.dispatch;
    // debugger;
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
    this.options.fields = this.options.fields.concat(this.options.actions)
    if (typeof this.options.data == 'string') {
        this.options.data = window.location[this.options.data].substr(1).split('&').map(function(val){return val.split('=');}).reduce(function ( total, current ) {total[ current[0] ] = decodeURIComponent(current[1]);return total;}, {});
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
        gform.each.call(this, function(field) {
            field.owner.trigger('change:' + field.name, field);
        })
        if(!this.options.private){
            gform.instances[this.options.name] = this;
        }
    }

    this.restore = create.bind(this);
    this.get = this.toJSON = gform.toJSON.bind(this);
    this.toString = gform.toString.bind(this)
    this.reflow = gform.reflow.bind(this)
    this.find = gform.find.bind(this)
    this.filter = gform.filter.bind(this)

    this.set = function(name, value) {
        if(typeof name == 'string'){
            this.find(name).set(value)
        }
        if(typeof name == 'object'){
            _.each(name,function(item,index){
                var temp = this.find(index);
                if(typeof temp !== 'undefined'){
                    temp.set(item);
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
    if((this.options.autoFocus || gform.options.autoFocus) && this.fields.length){

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
                   field.owner.trigger('change:' + field.name, field);
               })

               gform.types[newField.type].focus.call(newField);
               field.parent.trigger(['change','input', 'create', 'inserted'],field)

               fieldCount++;
           }

           var testFunc = function(status, button){
               gform.toggleClass(button,'hidden', status)
           }
           _.each(field.operator.el.querySelectorAll('[data-name="'+field.name+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))

           _.each(field.operator.el.querySelectorAll('[data-name="'+field.name+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))

       }
       if(e.target.classList.contains('gform-minus')){
           e.stopPropagation();
           // var fieldCount =  _.countBy(field.parent.fields, {name: field.name,array: true}).true;
           var fieldCount =  _.filter(field.parent.fields, 
               function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
           ).length;
           if(field.editable && fieldCount > (field.array.min || 1)) {
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

           var testFunc = function(status, button){
               gform.toggleClass(button,'hidden', status)
           }
           _.each(field.operator.el.querySelectorAll('[data-name="'+field.name+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))

           _.each(field.operator.el.querySelectorAll('[data-name="'+field.name+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))
       }
   }.bind(this)

    this.el.addEventListener('click', this.listener)
    this.trigger('initialized',this);
    this.isActive = true;
    this.reflow();
    return this;
                  
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
    return  gform.filter.call(this, {id:id})[0] || false;
}


gform.filter = function(search){
    var temp = [];

    _.each(this.fields, function(field){
        if(_.isMatch(field, search)){
            temp.push(field)
        }
        if(typeof field.fields !== 'undefined'){
            temp = temp.concat(gform.filter.call(field,search));
        }
    })
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
gform.toString = function(name){
    if(typeof name == 'string' && name.length>0) {
        name = name.split('.');
        return _.find(this.fields, {name: name.shift()}).toString(name.join('.'));
    }
    var obj = "";
    _.each(this.fields, function(field) {
            var fieldString = field.toString();
            obj += fieldString;
    })
    return obj;
}
gform.m = function (l,a,m,c){function h(a,b){b=b.pop?b:b.split(".");a=a[b.shift()]||"";return 0 in b?h(a,b):a}var k=gform.m,e="";a=_.isArray(a)?a:a?[a]:[];a=c?0 in a?[]:[1]:a;for(c=0;c<a.length;c++){var d="",f=0,n,b="object"==typeof a[c]?a[c]:{},b=_.assign({},m,b);b[""]={"":a[c]};l.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,function(a,c,l,m,p,q,g){f?d+=f&&!p||1<f?a:c:(e+=c.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,function(a,c,e,f,g,d){return c?h(b,c):f?h(b,d):g?k(h(b,d),b):e?"":(new Option(h(b,d))).innerHTML}),n=q);p?--f||(g=h(b,g),e=/^f/.test(typeof g)?e+g.call(b,d,function(a){return k(a,b)}):e+k(d,g,b,n),d=""):++f})}return e}

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
        field.reflow()
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
        var testFunc = function(status, button){
            gform.toggleClass(button,'hidden', status)
        }
        _.each(field.operator.el.querySelectorAll('[data-name="'+field.name+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))

        _.each(field.operator.el.querySelectorAll('[data-name="'+field.name+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))
        
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
        name: (gform.renderString(fieldIn.label || fieldIn.title)||'').toLowerCase().split(' ').join('_'), 
        id: gform.getUID(), 
        // type: 'text', 
        label: fieldIn.legend || fieldIn.title || (gform.types[fieldIn.type]||gform.types['text']).defaults.label || fieldIn.name,
        validate: [],
        valid: true,
        parsable:true,
        visible:true,
        editable:true,
        parent: parent,
        array:false,
        columns: this.options.columns||gform.columns,
        offset: this.options.offset||gform.offset||0,
        ischild:!(parent instanceof gform)        
    }, this.opts, gform.default,this.options.default,(gform.types[fieldIn.type]||gform.types['text']).defaults, fieldIn)
    //keep required separate
    // field.validate.required = field.validate.required|| field.required || false;
    if(typeof field.multiple == 'undefined' && typeof field.limit !== 'undefined' && field.limit>1)
    {
        field.multiple = true;
    }

    // if(typeof field.validate.required == 'undefined'){field.validate.required = false}
    if(field.name == ''){field.name = field.id;}
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
    this.handlers = _.extend({},options.handlers);
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
		var a = a || {};
		a[this.options.owner] = this.owner;
		if(typeof f !== 'undefined'){
		    a[this.options.item] = f;
		}
        a.default = true;
        a.continue = true;
        a.preventDefault = function(){this.a.default = false;}.bind(this)
        a.stopPropagation = function(){this.a.continue = false;}.bind(this)
		var events = [];
		if(typeof e == 'string'){
		    events.push(e)
		}else{events = events.concat(e)}
		_.each(events, function(args,event){
            args.event = event;
            var f = function (handler) {
                if(a.continue){
                    handler.call(owner, args);
                }
            }.bind(this)
            _.each(this.handlers[event], f);
            _.each(this.handlers['*'], f);
		}.bind(this, a))
        return a;
        
	}.bind(this)
	this.on = function (event, handler) {
		var events = event.split(' ');
		if (typeof this.handlers[event] !== 'object') {
		this.handlers[event] = [];
		}
		_.each(events,function(event){
            if(typeof handler == 'function'){
                this.handlers[event].push(handler);
            }else{
                if(typeof this[handler] == 'function'){
                    this.handlers[event].push(this[handler]);
                }
            }
		}.bind(this))
		return this.owner;
	}.bind(this);
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


gform.mapOptions = function(optgroup, value, count,collections){
    this.collections = collections;
    this.eventBus = new gform.eventBus({owner:'field',item:'option'}, this)
    this.optgroup = _.extend({},optgroup);
    count = count||0;
    var format = this.optgroup.format;
    function pArray(opts){
        return _.map(opts,function(item){

            if(typeof item === 'object' && item.type == 'optgroup'){
                item.map = new gform.mapOptions(_.extend({format:format},item),value,count,this.collections);
                item.map.on('*',function(e){
                    this.eventBus.dispatch(e.event)
                }.bind(this))
                item.id = gform.getUID();

                gform.processConditions.call(this, item.edit, function(id, result){
                    var op = this.el.querySelectorAll('[data-id="'+id+'"]');
                    for (var i = 0; i < op.length; i++) {
                        op[i].disabled = !result;
                    }
                }.bind(this,item.id))            
                gform.processConditions.call(this, item.show, function(id, result){
                    var op = this.el.querySelectorAll('[data-id="'+id+'"]');
                    for (var i = 0; i < op.length; i++) {
                        op[i].hidden = !result;
                    }
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
                }
                if(option.value == value || (/*this.multiple && */typeof value !=='undefined' && value.length && (value.indexOf(option.value)>=0) )) { option.selected = true;}

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
            gform.ajax({path: this.optgroup.path, success:function(data) {
                
                this.collections.update(this.optgroup.path,data)
                // this.optgroup.options = pArray.call(this.optgroup.map, data);
                // this.eventBus.dispatch('change')
            }.bind(this)})
        }else{
            this.optgroup.options = pArray.call(this.optgroup.map, this.collections.get(this.optgroup.path));
        }

    }


    return {getobject:function(){
        var temp = {};
        temp = _.map(this.optgroup.options,function(item){
            if(typeof item.map !== 'undefined'){
                item.options = item.map.getoptions();
                return {optgroup:{label:item.label||'',options:item.map.getoptions()}}
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
        // debugger;
        if(typeof search !== 'undefined'){
            return _.find(temp,search)
        }
        return temp;
    }.bind(this),on:this.eventBus.on,handlers:this.handlers,optgroup:this.optgroup};
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
   return document.createRange().createContextualFragment(text).firstElementChild;
  }
  gform.renderString = function(string,options) {
    return gform.m(string || '', options || {})
  }
  
  
  // add some classes. Eg. 'nav' and 'nav header'
  gform.addClass = function(elem, classes) {
    elem.className = _.chain(elem.className).split(/[\s]+/).union(classes.split(' ')).join(' ').value();
    // return elem;
  };
  gform.removeClass = function(elem, classes){
    elem.className = _.chain(elem.className).split(/[\s]+/).difference(classes.split(' ')).join(' ').value();
    // return elem
  };
  gform.toggleClass = function(elem, classes, status){
      if(status){
        gform.addClass(elem,classes)
      }else{
        gform.removeClass(elem,classes)

      }
    // return elem
  };
  
gform.VERSION = '0.0.0.9';
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
        var container = field.parent.container;

        field.operator = field.parent;

        if(typeof field.item.target == 'function'){
            field.target = field.item.target.call(field)
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
gform.createField = function(parent, atts, el, index, fieldIn,i,j, instance) {
    var field = gform.normalizeField.call(this,fieldIn,parent) 
    field.owner = this;
    if(field.columns > this.options.columns) { field.columns = this.options.columns; }

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

    if(field.item.value !== 0){
        if(field.array && typeof atts[field.name] == 'object'){
            field.value =  atts[field.name][index||0];
        }else{
            if(typeof field.item.value === 'function') {
                //uncomment this when ready to test function as value for input
                field.valueFunc = field.item.value;
                field.derivedValue = function(e) {
                    
                    return e.field.valueFunc.call(null, e);
                };
                // field.item.value = field.item.value;// = field.derivedValue({form:field.owner,field:field});
                delete field.value;
                field.owner.on('initialized', function(f,e) {
                    e.field = f;
                    f.set.call(null,f.derivedValue(e));
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
                field.value = field.derivedValue();
                field.owner.on('input', function(f) {
                    f.set.call(null,f.derivedValue());
                }.bind(null,field));
                field.owner.on('initialized', function(f,e) {
                    f.set.call(null,f.derivedValue());
                }.bind(null,field));

            }  else {
                //may need to search deeper in atts?
                // field.value =  atts[field.name] || field.value || '';
                field.value = _.defaults({value:atts[field.name],},field,{value:''}).value
            }
        }
    } else {
        field.value = 0;
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
    if(field.fields){
        var newatts = {};
        if(field.array && typeof (atts[field.name]|| field.owner.options.data[field.name]) == 'object'){
            newatts =  (atts[field.name]|| field.owner.options.data[field.name])[index||0] || {};
        }else{
            newatts = atts[field.name]|| field.owner.options.data[field.name] ||{};
        }
        field.fields = _.map(field.fields, gform.createField.bind(this, field, newatts, null, null) );
        if(field.array) {
            _.each(field.fields, gform.inflate.bind(this, newatts) );
            field.reflow()
        }
    }
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
    if(field.required){
        gform.processConditions.call(field, field.required, function(result){
            if(this.required !== result){
                this.update({required:result});
            }
        })
    }
    return field;
}



gform.reflow = function(){
    if(this.isActive || (typeof this.owner !== 'undefined' && this.owner.isActive)){
        _.each(this.rows,function(item,i){
            if(typeof item !== 'undefined'){
                item.container.removeChild(item.ref);
            }
            // delete this.rows[i];
        }.bind(this))    
        this.rows = [];
        _.each(this.fields,function(field){
            gform.layout.call(this,field)
        }.bind(this))
    }
}
