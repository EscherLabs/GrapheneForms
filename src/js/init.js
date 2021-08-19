

gform.collections =  new gform.collectionManager()
gform.instances = {};
gform.prototype.options = {
    autoFocus:true,
    rootpath:'',
    actions:[{type:'cancel'},{type:'save'}],
    rowClass: 'row',
    default:{
        type: 'text',
        suffix: ':',
        requiredText: '<span style="color:red">*</span>',
        validate: [],
        valid: true,
        parsable:true,
        reportable:true,
        visible:true,
        editable:true,
        fillable:true,
        array:false
    },
    clear:true,
    sections:'',
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
    // return gform.reduceShallow.call(this,gform.patch,{},{parsable:true})
    return gform.reduceItems.call(this,gform.patch,{},{parsable:true})

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


gform.addConditions = function(field) {

    gform.processConditions.call(field, field.show, function(result){
        var events = (this.visible !== result);
        this.visible = result;

        gform.types[this.type].show.call(this,this.visible);

        if(events) {
            (this.am||this.owner).reflow();
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

// gform.expand = function(atts,arrayManager){
//     if(arrayManager instanceof gform.arrayManager){
//         _.each(atts,function(att){
//             this.addField(att);
//         }.bind(arrayManager))
//     }
// }
//creates multiple instances of duplicatable fields if input attributes exist for them
// gform.inflate = function(atts, fieldIn, ind, list) {
//     debugger;
//     if(fieldIn.array) {

//         fieldIn.items = _.map(fieldIn.fields, gform.createField.bind(this, fieldIn, atts, null, null) );
//         // var temp =  new gform.arrayManager(field);


//         // Object.defineProperty(temp, "fields", {
//         //     gedt: function(){
//         //          return _.reduce(this.items,function(stuff,e){
//         //             if(e instanceof gform.arrayManager){
//         //                 stuff = stuff.concat(e.instances);
//         //             }else{
//         //             stuff.push(e);
//         //             }
//         //             return stuff;
//         //         },[]);
//         //     },
//         //     enumerable: true
//         // });

//         fieldIn.am = true;
//     }
//     // return;
//     if(fieldIn instanceof gform.arrayManager){
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
//         //newList[ind].name >> fieldIn.name should fix above comments
//         var field = _.findLast(newList, {name: fieldIn.name});
    
//         if(!field.array && field.fields){
//             if(!this.options.strict){
//                 _.each(_.extend([],field.fields), gform.inflate.bind(this, atts[field.name]|| field.owner.options.data[field.name] || {}) );
//             }else{
//                 _.each(_.extend([],field.fields), gform.inflate.bind(this, atts[field.name] || {}) );
//             }
//             // field.reflow()
//         }
//         if(field.array) {
//             var fieldCount = field.array.min||0;
    
//             if(!this.options.strict && typeof atts[field.name] !== 'object' && typeof field.owner.options.data[field.name] == 'object'){
//                 atts = field.owner.options.data;
//             }
//             if((typeof atts[field.name] == 'object' && atts[field.name] !== null && atts[field.name].length > 1)){
//                 if(atts[field.name].length> fieldCount){fieldCount = atts[field.name].length}
//             }
//             var initialCount = _.filter(field.parent.fields,
//                 function(o) { return (o.name == field.name) && ('array' in o) && !!o.array;}
//             ).length
            
//             for(var i = initialCount; i<fieldCount; i++) {
//                 var newfield = gform.createField.call(this, field.parent, atts, field.el, i, _.extend({},field.item,{array:field.array}), null, null,i);
//                 field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id})+1, 0, newfield)
//                 gform.addConditions.call(this,newfield);
//                 field = newfield;
//             }
//             // var testFunc = function(status, button){
//             //     gform.toggleClass(button,'hidden', status)
//             // }
//             // if(field.name == "options")
//             // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))
    
//             // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))
//             this.updateActions(field);
//             // var fieldCount = field.operator.filter({array:{ref:field.array.ref}},1).length
    
//             // var testFunc = function(selector,status, button){
//             //     gform.toggleClass(button.querySelector(selector),'hidden', status)
//             // }
//             // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
//             // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
    
    
//         }
//     }
    
// }
// gform.normalizeField = function(fieldIn,parent){
//     var parent = parent || this;
//     fieldIn.type = fieldIn.type || this.options.default.type || 'text';
//     if(!(fieldIn.type in gform.types)){
//         console.warn('Field type "'+fieldIn.type+'" not supported - using text instead');
//         fieldIn.type = 'text';
//     }
//     //work gform.default in here
//     var field = _.assignIn({
//         id: gform.getUID(), 
//         // type: 'text', 
//         label: fieldIn.legend || fieldIn.title || (gform.types[fieldIn.type]||gform.types['text']).defaults.label || fieldIn.name,
//         validate: [],
//         valid: true,
//         parsable:true,
//         reportable:true,
//         visible:true,
//         editable:true,
//         parent: parent,
//         fillable:true,
//         array:false,
//         columns: this.options.columns||gform.columns,
//         offset: this.options.offset||gform.offset||0,
//         ischild:!(parent instanceof gform)
//     }, this.options.default,(gform.types[fieldIn.type]||gform.types['text']).defaults, fieldIn)
//     if(typeof field.value == "function" || (typeof field.value == "string" && field.value.indexOf('=') === 0))delete field.value;

//     //keep required separate
//     //WRONG....WRONG....WRONG....
//     if(field.array){
//         if(typeof field.array !== 'object'){
//             field.array = {};
//         }
//         field.array = _.defaultsDeep(field.array,(gform.types[field.type]||{}).array,{max:5,min:1,duplicate:{enable:'auto'},remove:{enable:'auto'},append:{enable:true}})
//         field.array.ref = field.array.ref || gform.getUID();
//     }
    
//     // field.validate.required = field.validate.required|| field.required || false;
//     if(!('multiple' in field) && 'limit' in field && field.limit>1)
//     {
//         field.multiple = true;
//     }
//     field.name = field.name || (gform.renderString(fieldIn.legend || fieldIn.label || fieldIn.title)||'').toLowerCase().split(' ').join('_');

//     // if(typeof field.validate.required == 'undefined'){field.validate.required = false}
//     if(field.name == ''){
//         field.name = field.id;
//     }
//     // if((typeof fieldIn.label == 'undefined' || fieldIn.label == '') && (field.label == '' || typeof field.label == 'undefined') ){fieldIn.label = field.name;}
//     field.item = _.extend(fieldIn,{});
//     return field;
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
                
                gform.ajax({path: (this.field.owner.options.rootpath||'')+this.optgroup.path, success:function(data) {
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

gform.arrayManager = function(field){
    _.reduce(['reflow','find','filter'],(manager, prop)=>{
        if(prop in gform.types[field.type]){
            manager[prop] = gform.types[field.type][prop].bind(manager);// || null;
        }
        return manager;
    }, this)
    this.field = field;
    this.name = this.field.name;
    this.owner = field.owner;
    this.array = field.array;
    this.array.min = (this.array.min == 0)?0:this.array.min||1;
    this.parsable= true;
    this.focus = function(){};
    // this.type = 'am';//field.type;
    this.satisfied = function(){
        var value = value||this.get();
        return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'object' && _.isEmpty(value)));
    }
    this.fields =[];
    this.instances = [];
    this.id = gform.getUID();
    this.field.array.refid = this.id;
   
    // this.el = gform.create(gform.types[this.field.type].row.call(this.field));
    this.el = gform.types[this.field.type].array.template(this);
    this.container = gform.types[field.type].array.container||this.el;

    if(typeof gform.types[field.type].array.container == 'string'){
        this.container = this.el.querySelector(gform.types[this.field.type].array.container);
    }
    this.rowManager = gform.rowManager(this);
    this.reflow = gform.reflow.bind(this)

    Object.defineProperty(this, "display",{
        get: function(){            
            return _.reduce(this.instances,(displayResult,instance)=>{
                displayResult+= ('<div>'+instance.display+'</div>');
                return displayResult;
            }, '<div>')+'</div>'
        },
        enumerable: true
    });    


    Object.defineProperty(this, "label",{
        get: function(){            
            return this.internalLabel||this.field.array.label||this.field.label;
        },
        set:function(value){this.internalLabel = value;},
        enumerable: true
    });    

    // this.field.operator = this;
    gform.addConditions.call(this.owner,this);

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
        enumerable: true
    });
    if(typeof gform.types[field.type].row  == "function"){
    }
    this.get= function(){
        return _.map(this.instances, instance=>instance.get())

        // return [];
    }
    this.addField = function(options,field){
        if(typeof field == "undefined"){
            field = this.field;//this.instances[this.instances.length-1]
        }
        
        if(!field.editable || this.instances.length >= (field.array.max || 5)){return false;}

        //var index = _.findIndex(this.instances, {id: field.id});
        var index = (_.findIndex(this.instances, {id: field.id})+1)||this.instances.length;
        var newField = field.owner.fieldMethods.cultivate({...options, index: index}, this.field)

        this.instances.splice(index, 0, newField)
        gform.addConditions.call(field.owner,newField);
        gform.each.call(newField, gform.addConditions)

        _.each(_.filter(this.instances,
            function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
        ),function(item,index){
            item.index = index;
            gform.types[item.type].setLabel.call(item)
        })
        gform.types[newField.type].focus.call(newField);


        newField.parent.trigger(['change','input', 'create', 'inserted'],newField)
        newField.owner.updateActions(newField);

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
            field.am.reflow();
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
    }
}

//    this.add = gform.createField.bind(this, this, this.options.data||{}, null, null);
//gform.till
gform.field = {
    cultivate: function(form){
        return (options, field) => {
            options = {
                parent: form,
                owner: form,
                el: null,
                instance: null,
                data:undefined,
                am: null,
                ...options
            }
            
            field = form.fieldMethods.normalize(options, field);
            field.owner = form;

            if(typeof options.data == 'object' && field.name in options.data){
                options.data = options.data[field.name];
            }else{
                delete options.data;
                if(form.options.strict == false){
                    if(typeof form.options.data == 'object' && field.name in form.options.data){
                        options.data = form.options.data[field.name];
                    }
                }
            }

            if(field.array && !field.am){
                let am = new gform.arrayManager(field);
                field.am = am;
                if(typeof options.data == "object"){
                    _.each(options.data, (data, i) => {
                        am.addField({...options, data: {[field.name]:data}, index: i}, field)
                    })
                }
                let index = am.instances.length;
                while(index < field.array.min) {
                    am.addField({...options, data: ((options.data||{})[field.name]||[])[index]||(gform.types[field.type].base == 'section')?{}:"", index: index}, field);//am.addField({},field);
                    index++;
                }
                return am;
            }


            if(typeof form.options.data == 'object' && 'data' in form.options.data){
                Object.defineProperty(field, "data", {
                    get: () => {
                        return form.options.data.data
                    },
                    enumerable: true
                });
            }




            //get value from passed in value
            // if(field.fillable){

            //     if(field.array){
            //         field.value =  options.data;
            //     }else{
            //         field.value = options.data[field.name]
            //     }

                //should be able to compine these and just conditionally set localValue
                // test thouroughly though

                // if(!form.options.strict){
                //     const rootValue = form.options.data[field.name]

                //     if(field.array && typeof (localValue || rootValue) == 'object'){
                //         field.value =  (localValue || rootValue)[options.index||0] || {};
                //     }else{
                //         field.value = _.defaults({data:_.selectPath(options.data,field.item.map||field.name)},{value:rootValue},field).value
                //     }
                // }else{
                //     if(field.array && typeof localValue == 'object'){
                //         field.value =  localValue || {};
                //     }else{
                //         field.value =  _.defaults({value:_.selectPath(options.data,field.item.map||field.name)},field).value                
                //     }    
                // }

            // }

            field = _.reduce(['value','label','placeholder','help','info','pre','post'], (field, attr) => {
                if(typeof field[attr] == 'string' && field.raw !== true){
                    field[attr] = gform.renderString((typeof field.item[attr] == 'string')? field.item[attr] : field[attr], field)
                }
                return field;
            }, field)
            //Define properties
            /*------------------------------------------*/

            if(typeof field.item.value === 'function' || (typeof field.item.method === 'string' && typeof field.owner.methods[field.item.method] == 'function') ) {
                field.derivedValue = (e) => { 
                    field.set((field.owner.methods[field.item.method] || field.item.value).call(null, {form:field.owner,field:field,initial:field,...e}),true)
                    return field.internalValue;
                }
            } else if(typeof field.item.value === 'string' && field.item.value.indexOf('=') === 0) {
                field.derivedValue = () => {
                    const data = field.owner.get();
                    field.formula = gform.renderString(field.item.value.substr(1), data)
                    try {
                        if(field.formula.length) {
                            if(typeof math !== 'undefined') {
                                var result  = math.eval(field.formula, data);
                                if(typeof result == 'object' && 'entries' in result){
                                    result = _.last(result.entries);
                                    if(typeof result._data == 'object') result = result._data;
                                }
                                field.formula = _.isFinite(result) ? result.toFixed((field.item.precision || 0)) : _.isArray(result) ? result : '';
                            }
                        }
                    }catch(e){ field.formula = ''; }
                    return field.formula;
                }
            }


            field.set = (value, silent)=>{
                //not sure we should be excluding objects - test how to allow objects
                if('fields' in this && typeof value == 'object'){value = _.pick(value, _.map(field.fields, "name"))}
        
                if(field.internalValue != value || value == null){// && typeof value !== 'object') {
                    if(!gform.types[field.type].set.call(field,value)){
                        field.internalValue = value;
        
                        if(!silent){
                            field.trigger(['change'],field);
                        };
                    };
                }
                return field.internalValue;
            }
            if(field.fillable){

                // if(field.array && typeof options.data == 'object' && typeof options.data[field.name] == 'object' && !!options.data[field.name] ){
                //     field.value =  options.data[field.name][options.index||0];
                // }
                // if(typeof options.data == 'undefined'){
                //     field.value = form.call('resetValue', field);
                // }else{
                //     field.value =  _.defaults({value:_.selectPath(options.data,field.item.map||field.name)},field,{value:''}).value
                // }
                if(typeof field.derivedValue == 'function') {
                    field.value = field.owner.call('resetValue',field);
                    field.value = field.derivedValue();
                    field.owner.on('input', (e)=>{
                        e.initial = field;
                        var oldv = field.value;
                        var newv =  field.derivedValue(e);
                        if(newv != oldv && e.default){
                            field.set.call(null,newv);
                            if(e.field !== field && e.continue){
                                e.form.trigger("input",field)
                            }
                        }
                    });
                }else{
                    field.value = ('data' in options)?options.data:(("value" in field.item)?field.item.value:form.call('resetValue', field));
                }
                // field.value =  _.defaults({value:_.selectPath(options.data,field.item.map||field.name)},field).value
                options.data = ('data' in options)?options.data:field.value;
                
            }
            field.internalValue = field.value;

            Object.defineProperty(field, "value", {
                // get: (typeof field.derivedValue == 'function')?()=>field.derivedValue():
                get:() => field.internalValue,
                set: val => {
                    field.set(val, true);
                },
                enumerable: true
            });

            //Define properties
            /*------------------------------------------*/
            Object.defineProperty(field, "active", {
                get: ()=>(field.isActive && field.parent.active && field.editable && field.parsable && field.visible),
                enumerable: true
            });
        
            Object.defineProperty(field, "display", {
                get: ()=>{
                    if('display' in field.item && typeof field.item.display == 'function'){
                        return field.display.call(field)
                    }
                    if('display' in gform.types[field.type]){
                        return gform.types[field.type].display.call(field)
                    }
                    return field.toString();
                },
                enumerable: true
            });
            Object.defineProperty(field, "sibling",{
                get: ()=>{
                    return field.am instanceof gform.arrayManager;
                    // var types = field.parent.filter({array:{ref:field.array.ref}},1);
                    // return (types.length && types[0] !== field );
                },
                enumerable: true
            });
            Object.defineProperty(field, "isSatisfied",{
                get: ()=>field.satisfied(field.get()),
            });



            Object.defineProperty(field, "path",{
                get: ()=>{
                    let path = '/';
                    if(field.ischild) {
                        path = field.parent.path + '.';
                    }
                    path += field.name
                    if(field.array){
                        path+='.'+field.id
                    }
                    return path;
                }
            });
            Object.defineProperty(field, "map",{
                get: ()=>{            
                    if(field.item.map === false){return field.item.map}
                    let map = '';
                    if(field.ischild) {
                        map = field.parent.map + '.';
                    }
                    map += field.name
                    if(field.array){
                        map+='.'+field.index;
                    }
        
                    return field.item.map || map;
                },
            });
            Object.defineProperty(field, "source",{
                get: ()=>{            
                    if(field.item.source === false){return field.item.source}
                    var source = '';
                    if(field.ischild) {
                        source = field.parent.source + '.';
                    }
                    source += field.name
                    if(field.array){
                        source+='.'+field.index;
                    }
        
                    return field.item.source  || source || field.map;
                },
            });



            Object.defineProperty(field, "relative",{
                get: ()=>{
                    var path = '/';
                    if(field.ischild) {
                        path = field.parent.relative + '.';
                    }
                    path += field.name
                    return path;
                }
            });

            /*------------------------------------------*/




            field.trigger = (gform.types[field.type].trigger) ? gform.types[field.type].trigger.bind(field) : field.parent.trigger;
            field.columns = _.min([field.columns, form.options.columns]);// (field.columns > form.options.columns)? form.options.columns: field.columns;

            field = _.reduce([
                'get',
                'toString',
                'satisfied',
                'render',
                'update',
                'destroy',
                'focus',
                'reflow',
                'find',
                'filter'
            ], (field, prop)=>{
                if(!(prop in field) && prop in gform.types[field.type]){
                    field[prop] = form.bind(prop, field)// gform.types[field.type][prop].bind(field);// || null;
                }
                return field;
            }, field)

            Object.defineProperty(field, "toJSON",{
                get: ()=>{            
                    return field.get();
                },
                enumerable: true
            });

            field.el = form.call('create', field);
        
            switch(typeof field.container){
                case "string":
                    field.container =  field.el.querySelector(field.container);
                    break;
                case "undefined":
                    field.container =  field.el.querySelector('fieldset') || field.el || null;
                    break;
            }

            if(field.section) form.el.querySelector('.'+form.options.sections+'-content').appendChild(field.el);

            form.call('initialize', field)
            field.isActive = true;

            //apply data on field to metadata tags
            if(_.isArray(field.item.data)){
                field.meta = field.item.data;
                _.each(field.meta, function(meta){
                    if(typeof meta.key == 'string' && meta.key !== "" && !(meta.key in field)){
                        Object.defineProperty(field, meta.key,{
                            get: function(key, field){
                                return _.find(field.meta, {key: key}).value;
                            }.bind(null, meta.key, field),
                            set: function(key, field, value){
                                _.find(field.meta, {key: key}).value = value;
                                field.parent.trigger(meta.key, field);
                            }.bind(null, i.key, field),
                            configurable: true,            
                            enumerable: true
                        });
                    }
                })
            }
            

            if(field.fields){
                field.items = _.map(field.fields, form.fieldMethods.cultivate.bind(null, {
                    data: options.data,
                    parent: field
                }))
                
                Object.defineProperty(field, 'fields',{
                    get:() => _.reduce(field.items, (fields, item) => {
                        if(item instanceof gform.arrayManager){
                            fields = fields.concat(item.instances);
                        }else{
                            fields.push(item)
                        }
                        return fields;
                    }, [])
                })
            }
            return field;
        }
    },
    normalize: function(form){
        return (options, field) => {
            var parent = options.parent || form;

            if(!('type' in field) || !(field.type in gform.types)){
                console.warn('Field type "'+field.type+'" not supported - using '+(form.options.default.type || 'text')+' instead');
                field.type = form.options.default.type;
            }
            field.item = _.clone(field);

            const {index, id, ...rest} = field;
            field = {
                id: gform.getUID(),
                index: options.index||index||field.instance||0,
                label: field.legend || field.title || (gform.types[field.type]||gform.types['text']).defaults.label || field.name,
                parent: parent,
                columns: options.columns||form.options.columns,
                offset: options.offset||gform.offset||0,
                ischild:!(parent instanceof gform),
                format:{},
                ...form.options.default,
                ...(gform.types[field.type]||gform.types['text']).defaults,
                ...rest,
            }

            //keep required separate
            //WRONG....WRONG....WRONG....
            if(field.array){
                if(typeof field.array !== 'object'){
                    field.array = {};
                }
                field.array = _.defaultsDeep(field.array,(gform.types[field.type]||{}).array,{max:5,min:1,duplicate:{enable:'auto'},remove:{enable:'auto'},append:{enable:true}})
                field.array.ref = field.array.ref || gform.getUID();
            }
            
            if(!('multiple' in field)) field.multiple = ('limit' in field && field.limit>1);
            
            field.name = (field.name || (gform.renderString(field.legend || field.label || field.title, field)||'').toLowerCase().split(' ').join('_') || field.id) +'';
            return field;
        }
    }
};



gform.rowManager = (options) => {
    let rows = options.rows || []
    let {rowClass, columns, rowTemplate, container, rowSelector} = { 
        rowClass: 'row',
        columns:  gform.prototype.options.columns,
        rowTemplate: '<div></div>',
        container: gform.create(gform.renderString('<div></div>', options)),
        // rowSelector:(options.owner || options).call('rowSelector', options.field),
        // templateSelector:(options.owner || options).call('templateSelector', options.field) || "*",
        ...(options.owner || options).call('array', options.field),
        ...options
    };
    const get = options => {
        if(options.forceRow)return add(options);
        let row = rows[rows.length-1] || add(options);
        if(columns !== -1 && (row.used + options.size) > columns)row = add(options) 
        return row;
    }

    const add = options => {
        let cRow = {
            ref: gform.create(rowTemplate,rowSelector),
            id: gform.getUID(),
            used: 0
        };
        // if(!(cRow.ref instanceof Element))cRow.ref = gform.create("<div></div>");
        cRow.ref.setAttribute("id", cRow.id);
        gform.addClass(cRow.ref, rowClass)
        // cRow.ref.setAttribute("style", "margin-bottom:0;");
        Object.defineProperty(cRow, "field", {
            set: field => {
                if(field.el instanceof Node){
                    ((typeof rowSelector == 'undefined')? cRow.ref : cRow.ref.querySelector(rowSelector) || cRow.ref).appendChild(field.el)
                    cRow.used += field.columns;
                    cRow.used += field.offset;
                }else{
                    console.warn('Field element must be a node');
                }
            }
        });
        rows.push(cRow);

        container.appendChild(cRow.ref);
        return cRow
    }

    const clear = options => {
        _.each(rows, cRow => {
            if(typeof cRow !== 'undefined'){
                try{container.removeChild(cRow.ref);}catch(e){}
            }
        })
        container = (typeof options == 'object' && 'container' in options)?options.container:container
        rows = [];
    }

    const insert = field => {
        field.columns = ('columns' in field)?parseInt(field.columns,10):gform.prototype.options.columns;
        field.offset = parseInt(field.offset, 10)||0;
        let size = (field.columns + field.offset);
        if(columns !== -1){
            if(size > columns) {
                console.warn('Requested size "'+size+'" exceeds row size');
                if(field.columns > columns){
                    console.warn('Requested columns "'+field.columns+'" exceeds row size, using column size of '+ columns);
                    field.columns = columns;
                    size = (field.columns + field.offset);
                }
                if(size>columns){
                    console.warn('Requested offset of '+field.offset+' pushes size over maximum row size of '+columns+' using offset of '+ (columns-field.columns));
                    field.offset = (columns-field.columns);
                    size = (field.columns + field.offset);
                }
            }
        }

        let row = get({size: size, ...field});
        row.field = field;
        // debugger;
        // if(typeof gform.types[field.type].rowSelector == 'string'){
        //     cRow.appender = cRow.ref.querySelector(gform.types[field.type].rowSelector);
        // }
        // if(!('appender' in cRow) || cRow.appender == null){
        //     cRow.appender = cRow.ref;
        // }
        // field.operator.rows = field.operator.rows || [];
        // field.operator.rows.push(cRow);
        // cRow.container = container;
        // container.appendChild(cRow.ref);
    
        // cRow.used += parseInt(field.columns, 10);
        // cRow.used += parseInt(field.offset, 10);

        // if(!skipAppend){
        //     cRow.appender.appendChild(field.el);
        // }



    }
    let api = {get: get, add: add, clear: clear, insert:insert};
    Object.defineProperty(api, "rows", {
        get: ()=>rows
    });

    return api;
}

// gform.layout = function(field){

//     // if(field instanceof gform.arrayManager){
//     //     //start here
//     //     field.field.parent.container.appendChild(field.el);
//     //     // debugger;
//     //     // _.each(field.instances,function(myinstance){this.container.appendChild(myinstance.el)}.bind(field))
//     // }else if('manager' in field && !!field.manager.container){
//     //     var container = field.manager.container;
//     //     field.operator = field.manager;
//     //     container.appendChild(field.el);

//     // }else{
//         if(field.columns == 0 || !field.visible){return;}
//         var search = {};
//         var skipAppend = false;

//         if('parent' in field && !!field.parent.container){
//             var container = field.parent.container;

//             field.operator = field.parent;

//             if(typeof field.target == 'function'){
//                 field.target = field.target.call(field)
//             }
//             if(typeof field.target == 'string'){
//                 var temp = field.owner.el.querySelector(field.target);
//                 if(typeof temp !== 'undefined' && temp !== null){
//                     search ={target:field.target};
//                     container = temp;
//                     field.operator = field.owner;
//                 }else{
//                     if(field.owner.options.clear){
//                         search.id = field.target
//                     }else{
//                         //used when populating an html block with field positions predefined  -- make an option
//                         skipAppend = true;
//                     }            
//                 }
//             }
//             // if(field.sibling){
//                 // search.id = field.operator.filter({array:{ref:field.array.ref}},1)[0].row;
//             // }
//             var cRow  = _.findLast(field.operator.rows,search);
//             if(!field.sibling || !('id' in search) || typeof cRow == 'undefined'){
//                 if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > field.owner.options.columns || field.forceRow == true){
//                     cRow = search;
//                     cRow.id =gform.getUID();
//                     cRow.used = 0;
//                     var template = '<div></div>';
//                     if(typeof gform.types[field.type].row == 'function'){
//                         template = gform.types[field.type].row.call(field)||template;
//                     }
//                     cRow.ref = gform.create(template)
//                     cRow.ref.setAttribute("id", cRow.id);
//                     cRow.ref.setAttribute("class", field.owner.options.rowClass);
//                     cRow.ref.setAttribute("style", "margin-bottom:0;");

//                     if(typeof gform.types[field.type].rowSelector == 'string'){
//                         cRow.appender = cRow.ref.querySelector(gform.types[field.type].rowSelector);
//                     }
//                     if(!('appender' in cRow) || cRow.appender == null){
//                         cRow.appender = cRow.ref;
//                     }
//                     field.operator.rows = field.operator.rows || [];
//                     field.operator.rows.push(cRow);
//                     cRow.container = container;
//                     container.appendChild(cRow.ref);
//                 }
//                 cRow.used += parseInt(field.columns, 10);
//                 cRow.used += parseInt(field.offset, 10);
//             }
//             if(!skipAppend){
//                 cRow.appender.appendChild(field.el);
//             }
//             field.row = cRow.id;
//         }
//     // }
// }

gform.reflow = function(options){
    if(typeof this.rowManager == 'object'){
        this.rowManager.clear(options);
        return _.reduce(this.items||this.instances, (error, item) => {
            this.rowManager.insert(item)
            error = gform.reflow.call(item)
            return error;
        }, false)
    }
}
// gform.reflowOld = function(){
//     //capture focused element
//     var activeEl = document.activeElement;




//     if(this.isActive || (typeof this.owner !== 'undefined' && this.owner.isActive)){
//         //remove all existing rows
//         _.each(this.rows, (cRow)=>{
//             if(typeof cRow !== 'undefined'){
//                 try{cRow.container.removeChild(cRow.ref);}catch(e){}
//             }
//         })    
//         this.rows = [];


//         // gform.each.call(this, function(field){
//         //     if(!field.section){// && (this.options.clear || field.isChild)){
//         //         gform.layout.call(this,field)
//         //     }else{
//         //         if(field.section){
//         //             field.owner.el.querySelector('.'+field.owner.options.sections+'-content').appendChild(field.el);
//         //         }
//         //     }
//         // })
//         gform.reduceItems((item)=>{
//             if(!item.section){// && (this.options.clear || field.isChild)){
//                 gform.layout.call(this, item)
//             }else{
//                 if(item.section){
//                     item.owner.el.querySelector('.'+item.owner.options.sections+'-content').appendChild(item.el);
//                 }
//             }
//         })
//     }




//     //restore focus to element if it is still shown
//     var temp = this.find({id:activeEl.id});
//     if(temp)temp.focus();
// }
