
gform.addConditions = function(field) {

    gform.processConditions.call(field, field.show, function(result){
        var events = (this.visible !== result);
        this.visible = result;

        // this.el.style.display = result ? "block" : "none";
        gform.types[this.type].show.call(this,this.visible);

    
        if(events){
            this.operator.reflow();
            this.owner.trigger('change', this);
        }

    })

    gform.processConditions.call(field, field.edit, function(result){
        this.editable = result;        
        gform.types[this.type].edit.call(this,this.editable);
    })

    //should be able to reduce the number of times the process gets called using objectDefine
    if(!('parse' in field)){
        field.parse = field.show;
    }
    gform.processConditions.call(field, field.parse, function(result){
        this.parsable = result
    })
    if(!('report' in field)){
        field.report = field.show;
    }
    gform.processConditions.call(field, field.report, function(result){
        this.reportable = result
    })


    if(field.required){
        gform.processConditions.call(field, field.required, function(result){
            if(this.required !== result){
                this.required = result;
                gform.types[this.type].setLabel.call(this);
                // this.update({required:result},(e.field == this));
            }
        })
    }


}

//parse form values into JSON object
gform.toJSON = function(name) {
    if(typeof name == 'string' && name.length>0) {
        var field = this.find({map:name},_.toPath(name).length)
        if(!field){
            field = this.find({name:name},_.toPath(name).length)
            if(!field){return undefined;}
        }
        return field.get()
    }
    return gform.reduceShallow.call(this,gform.patch,{},{parsable:true})
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
            if(field.visible||field.reportable){
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

gform.expand = function(atts,arrayManager){
    if(arrayManager instanceof gform.arrayManager){
        _.each(atts,function(att){
            this.addField(att);
        }.bind(arrayManager))
    }
}
//creates multiple instances of duplicatable fields if input attributes exist for them
// gform.inflate = function(atts, fieldIn, ind, list) {
//     debugger;
//     if(fieldIn instanceof gform.arrayManager){
//         debugger;
//         field= fieldIn.field;
//         if(!this.options.strict && typeof atts[field.name] !== 'object' && typeof field.owner.options.data[field.name] == 'object'){
//             atts = field.owner.options.data;
//         }
//         if((typeof atts[field.name] == 'object' && atts[field.name].length > 1)){
//             if(atts[field.name].length> fieldCount){fieldCount = atts[field.name].length}
//         }
//         var fieldCount = field.array.min||0;

//         if(!this.options.strict && typeof atts[field.name] !== 'object' && typeof field.owner.options.data[field.name] == 'object'){
//             atts = field.owner.options.data;
//         }
//         if((typeof atts[field.name] == 'object' && atts[field.name].length > 1)){
//             if(atts[field.name].length> fieldCount){fieldCount = atts[field.name].length}
//         }
//         var initialCount = _.filter(field.parent.fields,
//             function(o) { return (o.name == field.name) && ('array' in o) && !!o.array;}
//         ).length
        
//         for(var i = initialCount; i<fieldCount; i++) {
//             var newfield = gform.createField.call(this, field.parent, atts, field.el, i, _.extend({},field.item,{array:field.array}), null, null,i);
//             fieldIn.instances.splice(_.findIndex(fieldIn.instances, {id: field.id})+1, 0, newfield.field)
//             field = newfield;
//         }

//     }else{
//         var newList = list;
//         //commented this out because I am not sure what its purpose is 
//         // - may need it but it breaks if you have an array following two fields with the same name
//         if(fieldIn.array){
//             newList = _.filter(newList,function(item){return !item.index})
//         }
//         var field = _.findLast(newList, {name: newList[ind].name});

//         if(!field.array && field.fields){
//             if(!this.options.strict){
//                 _.each(field.items, gform.inflate.bind(this, atts[field.name]|| field.owner.options.data[field.name] || {}) );
//             }else{
//                 _.each(field.items, gform.inflate.bind(this, atts[field.name] || {}) );
//             }
//         }
//         if(field.array) {
//             var fieldCount = field.array.min||0;

//             if(!this.options.strict && typeof atts[field.name] !== 'object' && typeof field.owner.options.data[field.name] == 'object'){
//                 atts = field.owner.options.data;
//             }
//             if((typeof atts[field.name] == 'object' && atts[field.name].length > 1)){
//                 if(atts[field.name].length> fieldCount){fieldCount = atts[field.name].length}
//             }
//             var initialCount = _.filter(field.parent.fields,
//                 function(o) { return (o.name == field.name) && ('array' in o) && !!o.array;}
//             ).length
            
//             for(var i = initialCount; i<fieldCount; i++) {
//                 var newfield = gform.createField.call(this, field.parent, atts, field.el, i, _.extend({},field.item,{array:field.array}), null, null,i);
//                 field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id})+1, 0, newfield)
//                 field = newfield;
//             }

//             this.updateActions(field);
//         }
//     }
    
// }
gform.normalizeField = function(fieldIn,parent){
    var parent = parent || this;
    fieldIn.type = fieldIn.type || this.options.default.type || 'text';
    if(!(fieldIn.type in gform.types)){
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
    //WRONG....WRONG....WRONG....
    if(field.array){
        if(typeof field.array !== 'object'){
            field.array = {};
        }
        field.array = _.defaultsDeep(field.array,(gform.types[field.type]||{}).array,{max:5,min:1,duplicate:{enable:'auto'},remove:{enable:'auto'},append:{enable:true}})
        field.array.ref = field.array.ref || gform.getUID();
    }
    
    // field.validate.required = field.validate.required|| field.required || false;
    if(!('multiple' in field) && 'limit' in field && field.limit>1)
    {
        field.multiple = true;
    }
    field.name = field.name || (gform.renderString(fieldIn.legend || fieldIn.label || fieldIn.title)||'').toLowerCase().split(' ').join('_');

    // if(typeof field.validate.required == 'undefined'){field.validate.required = false}
    if(field.name == ''){
        field.name = field.id;
    }
    // if((typeof fieldIn.label == 'undefined' || fieldIn.label == '') && (field.label == '' || typeof field.label == 'undefined') ){fieldIn.label = field.name;}
    field.item = _.extend(fieldIn,{});
    return field;
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
                if(typeof handler == 'function'){
                    this.handlers[event].push(handler);
                    if(typeof ref == 'object'){
                        ref.push(handler);

                    }
                }else{
                    if(typeof this.owner.methods[handler] == 'function'){
                        this.handlers[event].push(this.owner.methods[handler]);
                    }
                }
            }.bind(this,ref))
        }
		return this.owner;
	}.bind(this);
    if(_.isArray(options.handlers)){
        this.handlers = {};
        _.each(options.handlers,function(item){
            if(item !== null && 'event' in item && 'handler' in item)this.on(item.event, item.handler)
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
                if('methods' in this.owner && typeof this.owner.methods[a] == 'function'){
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
                    option = _.reduce(['label','display','value'/*,'cleanlabel'*/],function(option,prop){
                        if(prop in format){
                            if(prop in option){
                                option.original = option.original||{};
                                option.original[prop] = option[prop]
                            }
                            option[prop] = (typeof format[prop] == 'string')? 
                                    gform.renderString(format[prop],option) 
                                : (typeof format[prop] == 'function')? 
                                    format[prop].call(this,option)
                                    : option[prop]
                        }
                        return option;
                    }.bind(this), option)
/*
                    if('cleanlabel' in format){
                        if(typeof format.cleanlabel == 'string'){
                            option.label = gform.renderString(format.cleanlabel,option);
                          }else{
                              if(typeof format.cleanlabel == 'function'){
                                  option.label = format.cleanlabel.call(this.option);
                              }
                        }
                    }
                    */
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

	if('max' in this.optgroup && this.optgroup.max !== '') {
        for(var i = (this.optgroup.min || 0);i<=this.optgroup.max;i=i+(this.optgroup.step || 1)){
            this.optgroup.options.push(""+i);
        }
    }

    if(typeof this.optgroup.action == 'function'){
        this.optgroup.options = this.optgroup.options.concat(pArray.call(this,this.optgroup.action.call(this)));
    }

    if(_.isArray(this.optgroup.options)){
        this.optgroup.options = pArray.call(this,this.optgroup.options);
    }

    if(_.isString(this.optgroup.path) && this.optgroup.path){

        this.collections.on(this.optgroup.path,function(e){
            this.optgroup.options = pArray.call(this.optgroup.map, e.collection);
            if( waitlist.indexOf(e.event) >= 0){
                delete  waitlist[ waitlist.indexOf(e.event)];
            }
            this.eventBus.dispatch('change')
        }.bind(this))

        if(!this.collections.get(this.optgroup.path) || this.collections.get(this.optgroup.path) == 'waiting'){

            if( waitlist.indexOf(this.optgroup.path) == -1){
                waitlist.push(this.optgroup.path);
            }

            if(this.collections.get(this.optgroup.path)!== 'waiting'){
                this.collections.add(this.optgroup.path,'waiting')
                
                gform.ajax({path: (gform.options.rootpath||'')+this.optgroup.path, success:function(data) {
                    this.collections.update(this.optgroup.path,data)
                    if( waitlist.indexOf(this.optgroup.path) >= 0){
                        delete  waitlist[ waitlist.indexOf(this.optgroup.path)];
                    }

                    this.eventBus.dispatch('collection');
                    this.eventBus.dispatch('change',);

                }.bind(this)})
            }
        }else{
            this.optgroup.options = pArray.call(this.optgroup.map, this.collections.get(this.optgroup.path));
        }
    }



    var response = {getobject:function(){
        var temp = {};
        temp = _.map(this.optgroup.options,function(item){

            item.visible = ('visible' in item)?item.visible:true
            item.editable = ('editable' in item)?item.editable:true
            if('map' in item){
                item.options = item.map.getoptions();
                return {optgroup:{label:item.label||'',visible:item.visible,editable:item.editable,options:item.map.getoptions()}}
            }else{return item;}
        })
        return temp;
    }.bind(this),getoptions:function(search){
        var temp = [];
        _.each(this.optgroup.options,function(item){

            item.visible = ('visible' in item)?item.visible:true
            item.editable = ('editable' in item)?item.editable:true
            if('map' in item){
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

gform.collectionManager = function(refObject){
    var collections = refObject||{};
    this.eventBus = new gform.eventBus({owner:'manager',item:'collection',handlers:{}}, this)
    
	return {
		add: function(name, data){
            collections[name] = data;
            this.eventBus.dispatch('change',name);
		}.bind(this),
		get: function(name){
            return (typeof name == 'undefined')?collections:collections[name]
		},
		update: function(name, data){
            if(typeof data !== 'undefined'){
                collections[name] = data;
            }
            this.eventBus.dispatch(name,collections[name]);
            this.eventBus.dispatch('change',name);
		}.bind(this),
		on: this.eventBus.on
	}
}

gform.collections =  new gform.collectionManager()
gform.instances = {};
gform.default = {}; 
gform.options = {autoFocus:true,rootpath:''};
gform.prototype.opts = {
    actions:[{type:'cancel'},{type:'save'}],
    clear:true,
    sections:'',
    suffix: ':',
    rowClass: 'row',
    requiredText: '<span style="color:red">*</span>',
    subsections:false
}




gform.layout = function(field){

    // if(field instanceof gform.arrayManager){
    //     //start here
    //     field.field.parent.container.appendChild(field.el);
    //     // debugger;
    //     // _.each(field.instances,function(myinstance){this.container.appendChild(myinstance.el)}.bind(field))
    // }else if('manager' in field && !!field.manager.container){
    //     var container = field.manager.container;
    //     field.operator = field.manager;
    //     container.appendChild(field.el);

    // }else{
        if(field.columns == 0 || !field.visible){return;}
        var search = {};
        var skipAppend = false;

        if('parent' in field && !!field.parent.container){
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
                }else{
                    if(field.owner.options.clear){
                        search.id = field.target
                    }else{
                        skipAppend = true;
                    }            
                }
            }
            if(field.sibling){
                search.id = field.operator.filter({array:{ref:field.array.ref}},1)[0].row;
            }
            var cRow  = _.findLast(field.operator.rows,search);
            if(!field.sibling || !('id' in search) || typeof cRow == 'undefined'){
                if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > field.owner.options.columns || field.forceRow == true){
                    cRow = search;
                    cRow.id =gform.getUID();
                    cRow.used = 0;
                    var template = '<div></div>';
                    if(typeof gform.types[field.type].row == 'function'){
                        template = gform.types[field.type].row.call(field)||template;
                    }
                    cRow.ref = gform.create(template)
                    cRow.ref.setAttribute("id", cRow.id);
                    cRow.ref.setAttribute("class", field.owner.options.rowClass);
                    cRow.ref.setAttribute("style", "margin-bottom:0;");

                    if(typeof gform.types[field.type].rowSelector == 'string'){
                        cRow.appender = cRow.ref.querySelector(gform.types[field.type].rowSelector);
                    }
                    if(!('appender' in cRow) || cRow.appender == null){
                        cRow.appender = cRow.ref;
                    }
                    field.operator.rows = field.operator.rows || [];
                    field.operator.rows.push(cRow);
                    cRow.container = container;
                    container.appendChild(cRow.ref);
                }
                cRow.used += parseInt(field.columns, 10);
                cRow.used += parseInt(field.offset, 10);
            }
            if(!skipAppend){
                cRow.appender.appendChild(field.el);
            }
            field.row = cRow.id;
        }
    // }
}


gform.arrayManager = function(field){
    field = _.reduce(['reflow','find','filter'],function(field,prop){
        if(prop in gform.types[field.type]){
            field[prop] = gform.types[field.type][prop].bind(field);// || null;
        }
        return field;
    },field)
    this.field = field;
    this.name = this.field.name;
    this.owner = field.owner;
    this.array = field.array;
    this.parsable= true;
    this.focus = function(){};
    this.type = field.type;
    this.satisfied = function(){return true;}
    this.fields =[];
    this.instances = []

    
   
    this.el = gform.create(gform.types[this.field.type].row.call(this.field));
    this.container = this.el;

    if(typeof gform.types[field.type].rowSelector == 'string'){
        this.container = this.el.querySelector(gform.types[this.field.type].rowSelector);
    }
    this.field.operator = this;

    Object.defineProperty(this, "map",{
        get: function(){            
            if(this.field.item.map === false){return this.field.item.map}
            var map = '';
            if(this.field.ischild) {

                map = this.field.parent.map + '.';
            }
            map += this.field.name

            return this.field.item.map || map;
        },
        // enumerable: true
    });    
    Object.defineProperty(this, "toJSON",{
        get: function(){            
            return this.get();
        },
        // enumerable: true
    });
    if(field.array.min !== 0){
        this.instances[0] = field;
    }
    if(typeof gform.types[field.type].row  == "function"){
    }
    this.get= function(){
        return [];
    }
    this.addField = function(value,field){
        if(typeof field == "undefined"){
            field = this.field;//this.instances[this.instances.length-1]
        }else{
        }
 
        // var fieldCount = _.filter(field.parent.fields, 
        //     function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
        // ).length
        var fieldCount = this.instances.length
    
        var newField;
        if(field.editable && fieldCount < (field.array.max || 5)){
            var index = _.findIndex(this.instances, {id: field.id});
            var atts = {};
            atts[field.name] = [value || field.item.value || null];
            // debugger;

            newField = gform.createField.call(field.owner, field.parent, atts, field.el ,null, _.extend({},field.item,{array:field.array}),null,null,fieldCount,this);
            this.instances.splice(index+1, 0, newField)
            gform.addConditions.call(field.owner,newField);
            gform.each.call(newField, gform.addConditions)
    
            // field.operator.reflow();
            _.each(_.filter(this.instances, 
                function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
            ),function(item,index){
                item.index = index;
                gform.types[item.type].setLabel.call(item)
            })
    
            gform.each.call(this.instances, function(field) {
                field.owner.trigger('change', field);
            })
    
            gform.types[newField.type].focus.call(newField);
            field.parent.trigger(['change','input', 'create', 'inserted'],field)
    
            fieldCount++;
        }
        field.owner.updateActions(field);
        // var testFunc = function(selector,status, button){
        // gform.toggleClass(button.querySelector(selector),'hidden', status)
        // }
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
        return newField;
    }
    this.removeField = function(field){
        // var fieldCount =  _.filter(field.parent.fields, 
        //     function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
        // ).length;
        var fieldCount = this.instances.length
        if(field.editable && fieldCount > (field.array.min || 0)) {
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
            var index = _.findIndex(this.instances,{id:field.id});
            this.instances[index].el.parentElement.removeChild(this.instances[index].el)
            // this.instances[index].el
            this.instances.splice(index, 1);
            
            // field.operator.reflow();
            _.each(_.filter(this.instances, 
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
        field.owner.updateActions(field);
        // var testFunc = function(selector,status, button){
        // gform.toggleClass(button.querySelector(selector),'hidden', status)
        // }
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
    
    }

}


gform.createField= function(parent, atts, el, index, fieldIn,i,j, instance, aM) {
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
                path+='.'+this.id
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


    /* MERGE CHANGE */
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
if(false){
    if(field.array){
        if(typeof aM == "undefined"){
            var newatts = {};
            // if(!this.options.strict){
            //     if(field.array && typeof (atts[field.name]|| field.owner.options.data[field.name]) == 'object'){
            //         newatts =  (atts[field.name]|| field.owner.options.data[field.name])[index||0] || {};
            //     }else{
            //         newatts = atts[field.name]|| (field.owner.options.data||{})[field.name] ||{};
            //     }
            // }else{
            //     if(field.array && typeof atts[field.name] == 'object'){
                    newatts =  atts[field.name][index||0] || {};
            //     }else{
            //         newatts = atts[field.name] ||{};
            //     } 
            // }

            field.items = _.map(field.fields, gform.createField.bind(this, field, newatts, null, null) );
            var temp =  new gform.arrayManager(field);


            // Object.defineProperty(temp, "fields", {
            //     get: function(){
            //          return _.reduce(this.items,function(stuff,e){
            //             if(e instanceof gform.arrayManager){
            //                 stuff = stuff.concat(e.instances);
            //             }else{
            //             stuff.push(e);
            //             }
            //             return stuff;
            //         },[]);
            //     },
            //     enumerable: true
            // });
            gform.expand.call(this, atts[field.name],temp)
                // if(field.array) {
                    // _.each(_.map(field.fields, gform.createField.bind(this, temp, newatts, null, null) ), gform.inflate.bind(this, atts[field.name]) );
                //     field.reflow()
                // }
            gform.layout.call(this,temp.field)
            return temp;
        }else{
            field.manager = aM;
            gform.layout.call(this,field)

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
          
                field.items = _.map(field.fields, gform.createField.bind(this, field, newatts, null, null) );
        
                Object.defineProperty(field, "fields", {
                    get: function(){
                         return _.reduce(this.items,function(stuff,e){
                            if(e instanceof gform.arrayManager){
                                stuff = stuff.concat(e.instances.length?e.instances:e);
                            }else{
                            stuff.push(e);
                            }
                            return stuff;
                        },[]);
                    },
                    enumerable: true
                });
        ///look here - commented this out but need to confirm that is ok - seems to be so far
        
        
        
                // if(field.array) {
                //     _.each(field.fields, gform.inflate.bind(this, newatts) );
                //     field.reflow()
                // }
                field.update();
            }
            return field;
        }
    }else{
        gform.layout.call(this,field)

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
      
            field.items = _.map(field.fields, gform.createField.bind(this, field, newatts, null, null) );
    
            Object.defineProperty(field, "fields", {
                get: function(){
                     return _.reduce(this.items,function(stuff,e){
                        if(e instanceof gform.arrayManager){
                            stuff = stuff.concat(e.instances.length?e.instances:e);

                        }else{
                        stuff.push(e);
                        }
                        return stuff;
                    },[]);
                },
                enumerable: true
            });
    ///look here - commented this out but need to confirm that is ok - seems to be so far
    
    
    
            // if(field.array) {
            //     _.each(field.fields, gform.inflate.bind(this, newatts) );
            //     field.reflow()
            // }
            field.update();
        }
        return field;
    }
}

return field;
}



  
