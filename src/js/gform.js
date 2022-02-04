var gform = function (optionsIn, el) {
    "use strict";
    // const [cultivate] = Object.keys(gform.utils).map(method =>  gform.utils[method](this))
    this.fieldMethods = _.reduce(gform.field, (result, method, key) => {
        result[key] = method(this);
        return result;
    }, {})
    this.fieldAttr = (attr, field, ...rest) => (field[attr] || gform.types[field.type || 'text'][attr])
    this.call = (method, field, ...rest) => {
        field = field || this;
        let actor = (typeof field[method] == 'function') ? field[method] : gform.types[field.type || 'text'][method];
        return (typeof actor == 'function') ? actor.call(field, ...rest) : actor;
    };
    this.bind = (method, field, ...rest) => ((field[method] == Object.prototype[method]) ? gform.types[field.type || 'text'][method] : field.method).bind(field, ...rest);

    //event management        
    this.updateActions = function (am) {

        // var fieldCount = am.instances.length;//field.parent.filter({array:{ref:field.array.ref}},1).length
        const { array, id, instances, container } = am;
        const { max = 5, min } = array;
        var testFunc = function (selector, status, button) {
            gform.toggleClass(button.querySelector(selector), 'hidden', status)
        }
        if (array.duplicate.enable == "auto") {
            _.each(container.querySelectorAll('.gform_isArray'), testFunc.bind(null, '[data-ref=' + id + '].actions .gform-add', (instances.length >= max)))
        }
        if (array.remove.enable == "auto") {
            _.each(container.querySelectorAll('.gform_isArray'), testFunc.bind(null, '[data-ref=' + id + '].actions .gform-minus', !(instances.length > min)))
        }
        if (array.append.enable == "auto") {
            testFunc.call(null, '[data-id=' + id + '].gform-append', (instances.length >= (max || 5)), container)
        }

    }

    var data = _.merge(optionsIn.options || {}, optionsIn)
    var sections = [];

    this.methods = data.methods || {};

    this.eventBus = new gform.eventBus({ owner: 'form', item: 'field', handlers: data.events || {} }, this)
    this.on = this.eventBus.on;
    this.dispatch = this.eventBus.dispatch;
    this.valid = true;

    this.trigger = function (a, b, c) {
        if (typeof a == 'string') {
            a = [a];
        }
        var events = _.extend([], a);

        if (typeof b == 'object' && 'owner' in b && b.owner instanceof gform) {
            _.each(a, function (item) {
                if (item.indexOf(':') == '-1') {
                    events.unshift(item + ':' + b.name)
                    events.unshift(item + ':' + b.path)
                    events.unshift(item + ':' + b.relative)

                    var search = b;
                    while ('parent' in search && !(search.parent instanceof gform) && typeof search.parent !== 'undefined' && search.parent !== false) {
                        search = search.parent;
                        events.push(item + ':' + search.name)
                        events.push(item + ':' + search.path)
                        events.push(item + ':' + search.relative)
                    }
                    // if(id){
                    // b = this.find({id:id})
                    // }
                }
            }.bind(this))
        }
        this.dispatch(_.uniq(events), b, c);
    }.bind(this)

    this.errors = {};

    // this.sub = this.on;
    this.popin = function () {

    }
    // _.map(data.events,function(event,index){
    //     if(!_.isArray(event)){
    //         this.eventBus.handlers[index]=[event];
    //     }
    // }.bind(this))
    this.on('reset', function (e) {
        e.form.set(e.form.options.data);
    });
    this.on('clear', function (e) {
        e.form.set();
    });
    if (typeof data.collections == 'object') {
        this.collections = data.collections;
    } else {
        this.collections = gform.collections;
    }
    // this.sub = function (event, handler, delay) {
    //     delay = delay || 0;
    //     this.on(event, _.debounce(handler, delay));
    //     return this;
    // }.bind(this);

    //initalize form
    // this.options = _.assignIn({fields:[], legend: '',strict:true, default:gform.default||{}, data:'search', columns:gform.columns,name: gform.getUID()},this.opts, data);
    // this.options2 = _.assign({fields:[], legend: '',strict:true, default:gform.default, data:'search', columns:gform.columns,name: gform.getUID()},this.opts, data);
    this.options = { fields: [], legend: '', strict: true, data: 'search', columns: gform.columns, name: gform.getUID(), ...this.options, ...data, default: { ...this.options.default, ...data.default } };

    // this.options = {fields:[], legend: '',strict:true, data:'search', columns:gform.columns,name: gform.getUID(),...this.options, ...data};

    if (typeof this.options.onSet == 'function') {
        data = this.options.onSet(data)
    }

    //merge actions into fields 
    if ('actions' in this.options && _.isArray(this.options.actions)) this.options.fields = (this.options.fields || []).concat(this.options.actions);

    //attempt to retrieve initialization data from various sources hash, url, etc
    if (typeof this.options.data == 'string') {
        if (typeof window.location[this.options.data] !== 'undefined') {
            this.options.data = window.location[this.options.data].substr(1).split('&').map(function (val) { return val.split('='); }).reduce(function (total, current) { total[current[0]] = decodeURIComponent(current[1]); return total; }, {});
        } else {
            gform.ajax({
                path: (this.options.rootpath || '') + this.options.data, success: function (data) {
                    this.set(data)
                }.bind(this)
            })
        }
    }

    //set flag on all root fieldsets as a section
    if (this.options.sections) {
        _.each(_.filter(this.options.fields, { type: 'fieldset' }), function (item, i) {
            item.index = i;
            item.section = true;
            item.id = item.id || gform.getUID();
            return item
        })
    }

    // set up the root element
    // this.el = el || data.el;
    // if(typeof this.el == 'string'){
    //     this.el = document.querySelector(this.el+'');
    // }else if(typeof this.el == 'object'){
    //     this.el;
    // }else{
    //     el = '';
    // }

    this.attach = (el) => {
        switch (typeof el) {
            case 'undefined':
                for (let i = 0; i < sections.length; i++) {
                    this.el.removeChild(sections[i]);
                }
                break;
            case 'string':
                el = document.querySelector(el + '');
            case 'object':
                if (!el instanceof Node || this.el == el) false;
                this.el = el
                for (let i = 0; i < sections.length; i++) {
                    this.el.appendChild(sections[i]);
                }
                this.container = this.el.querySelector('form') || this.el;
                break;
        }

    }
    this.attach(el || data.el);

    this.add = (field) => {
        this._items.push(this.fieldMethods.cultivate({
            data: this.options.data,
        }, field));
        this.reflow();
    }
    this.trigger('initialize', this);

    // this.add = gform.createField.bind(this, this, this.options.data||{}, null, null);

    // signature.fields.push(signature.add({type:'signaturePad',required:true,label:"Signature",hideLabel:true,help:_.find(_.find(flow,{name:mappedData.state}).actions,{name:e.field.name}).signature_text||"Please Sign Above",name:"signature"}))


    var create = function () {
        if (typeof this.el == 'undefined') {
            this.options.renderer = 'modal';
            this.el = gform.create(gform.render(this.options.template || 'modal_container', this.options))
            // document.querySelector('body').appendChild(this.el)
            // gform.addClass(this.el, 'active')

            this.on('close', function (e) {
                if (typeof e.field == 'undefined') {
                    e.form.modal('hide');
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
            // this.el.querySelector('.close').addEventListener('click', function(e){
            //     this.trigger('cancel', this)}.bind(this)
            // )
            document.addEventListener('keyup', function (e) {
                if (e.key === "Escape") { // escape key maps to keycode `27`
                    this.trigger('cancel', this)
                }
            }.bind(this));
        }
        if (this.options.clear && !(this.options.renderer == 'modal')) {
            this.el.innerHTML = "";
            // this.el.innerHTML = gform.render(this.options.sections+'_container', this.options);
            // var temp = gform.create('<div>'+gform.render(this.options.sections+'_container', this.options)+'</div>')
            let container = gform.create('<div>' + gform.renderString(this.options.container || (gform.stencils[this.options.sections + '_container'] || gform.stencils['_container']), this.options) + '</div>');
            _.each(container.childNodes, (a, b, node) => {
                sections.push(node[0]);
                this.el.appendChild(node[0]);
            }
            )
        }
        this.container = this.el.querySelector('form') || this.el;

        this.rowManager = gform.rowManager(this);


        // this.newadd = this.fieldMethods.cultivate.bind(null, {
        //     data:this.options.data
        // });
        this._items = _.map(this.options.fields, this.fieldMethods.cultivate.bind(null, {
            data: this.options.data
        }))

        Object.defineProperty(this, 'items', {
            get: () => {
                return this._items
            }
        }
        )
        Object.keys(gform.iterators).forEach(i => {
            this.items[i] = gform.iterators[i].bind(this)
        })

        Object.defineProperty(this, 'fields', {
            get: () => {
                return _.reduce(this._items, (fields, item) => {
                    if (item instanceof gform.arrayManager) {
                        fields = fields.concat(item.instances);
                    } else {
                        fields.push(item)
                    }
                    return fields;
                }, [])
            }
        })
        // this.fields = _.reduce(this._items,(fields, item)=>{
        //     if(item.type === "am"){
        //         fields = fields.concat(item.instances);
        //     }else{
        //         fields.push(item)
        //     }
        //     return fields;
        // },[])

        // this.fields = [];
        // this.fields = _.map(this.options.fields, this.add)
        // _.each(_.extend([],this.fields), gform.inflate.bind(this, this.options.data||{}))

        // this.reflow()
        // _.each(this.fields, function(field) {
        //     field.owner.trigger('change:' + field.name,field.owner, field);
        // })
        this.items.each.call(this, gform.addConditions)
        gform.each.call(this, function (field) {
            field.owner.trigger('change', field);
        })
    }
    this.infoEl = gform.create(gform.render('_tooltip'))
    this.infoEl.querySelector('.info-close').addEventListener('click', function (e) {
        this.el.removeChild(this.infoEl)
        this.popper.destroy()
        this.popper = null;
    }.bind(this));
    this.popper = null;

    ['toJSON', 'toString', 'reflow', 'find', 'filter'].map((method) => {
        this[method] = gform[method].bind(this);
    })


    this.restore = create.bind(this);
    this.get = this.toJSON;

    this.set = function (name, value) {
        if (typeof this.options.onSet == 'function') {
            value = this.options.onSet(value)
        }
        if (typeof name == 'string') {
            this.find(name).set(value)
        }
        if (typeof name == 'object') {
            _.each(name, function (item, index) {
                let field = this.items.find(index);
                if (typeof field == 'undefined' || field == null) return;
                field.set(item);
                // var field = this.find(index);
                // if (typeof field !== 'undefined' && field.fillable) {
                //     if (field.array && _.isArray(item)) {
                //         var list = this.filter({ array: { ref: field.array.ref } }, 1)

                //         if (list.length > 1) {
                //             _.each(list.slice(1), function (field) {
                //                 var index = _.findIndex(field.parent.fields, { id: field.id });
                //                 field.parent.fields.splice(index, 1);
                //             })
                //         }

                //         if (_.isArray(item)) {
                //             field.set(item[0]);
                //         }

                //         // if(!this.owner.options.strict){
                //         // _.each(field.fields, gform.inflate.bind(this.owner, atts[field.name]|| field.owner.options.data[field.name] || {}) );
                //         // }else{
                //         var attr = {};
                //         attr[field.name] = item;
                //         gform.inflate.call(this.owner || this, attr, field, _.findIndex(field.parent.fields, { id: field.id }), field.parent.fields);
                //         // }

                //         // var fieldCount = this.filter({array:{ref:field.array.ref}},1).length

                //         // var testFunc = function(selector,status, button){
                //         //     gform.toggleClass(button.querySelector(selector),'hidden', status)
                //         // }
                //         // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
                //         // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))

                //         field.operator.reflow();
                //         // this.updateActions(field);



                //     } else {
                //         // gform.inflate.bind(this, this.options.data||{})
                //         if (typeof field !== 'undefined') {
                //             field.set(item);
                //         }
                //     }
                // }
            }.bind(this))
        }
        // if(typeof name == 'undefined'){
        if (name == null) {
            gform.each.call(this, function (field) {
                field.set('');
            })
        }
        this.trigger('set');
        return this;
        // _.find(this.fields, {name: name}).set(value);
    }.bind(this),

        this.isActive = false;
    Object.defineProperty(this, "active", {
        get: () => (this.isActive),
        enumerable: true
    });
    this.destroy = function () {
        this.isActive = false;
        this.trigger(['close', 'destroy']);
        this.el.removeEventListener('click', this.listener)


        gform.each.call(this, (field) => {
            if (typeof gform.types[field.type].destroy == "function") gform.types[field.type].destroy.call(field);
        })
        //pub the destroy methods for each field
        // _.each(function() {if(typeof this.destroy === 'function') {this.destroy();}});
        //Clean up affected containers
        while (!!sections.length) {
            let section = sections.pop();
            if (this.el.contains(section)) this.el.removeChild(section);

        }
        if (this.el.contains(this.container)) {
            this.container.parentElement.removeChild(this.container)
        }
        // this.el.innerHTML = "";


        // for(var i = this.fieldsets.length-1;i >=0; i--) { $(this.fieldsets[i]).empty(); }

        //Dispatch the destroy method of the renderer we used
        // if(typeof this.renderer.destroy === 'function') { this.renderer.destroy(); }

        //Remove the global reference to our form
        delete gform.instances[this.options.name];

        this.trigger('destroyed');
        delete this.eventBus;
        return this
    };

    if (!this.options.private) {
        if (typeof gform.instances[this.options.name] !== 'undefined' && gform.instances[this.options.name] !== this) {
            gform.instances[this.options.name].destroy();
        }
        gform.instances[this.options.name] = this;
    }
    create.call(this)

    //setup tab navigation if tabs exist
    var tabs = this.el.querySelector('ul.tabs')
    if (tabs !== null) {
        tabs.addEventListener('click', function (e) {
            if (e.target.nodeName == 'LI') {
                e.preventDefault();
                gform.removeClass(this.el.querySelector('ul.tabs .active'), 'active')
                gform.removeClass(this.el.querySelector('.tab-pane.active'), 'active')
                gform.addClass(e.target, 'active')
                gform.addClass(this.el.querySelector(e.target.parentElement.attributes.href.value), 'active')
            }
        }.bind(this))
    }

    //handle autofocus
    // if(typeof this.options.autoFocus == 'undefined'){
    //     this.options.autoFocus = gform.options.autoFocus;
    // }
    if (this.options.autoFocus && this.fields.length) {
        var field = this.find({ visible: true })
        if (field) {
            window.setTimeout(gform.types[this.find({ visible: true }).type].focus.bind(this.find({ visible: true })), 0);
        }
        // gform.types[this.fields[0].type].focus.call(this.fields[0])
    }




    // listen for built in events - add, minus, append, and info
    this.listener = function (e) {
        var field;
        var target = e.target;
        var activeField = gform.iterators.find.call(this, { id: document.activeElement.id });
        if (activeField !== null && e.detail === 0 && !e.pointerType) {
            if (activeField.am instanceof gform.arrayManager) {
                target = activeField.el.querySelector('.gform-add') || activeField.am.el.querySelector('.gform-append')
            } else {

                let index = activeField.parent.fields.indexOf(activeField);
                if (index >= 0 && typeof activeField.parent.fields[index + 1] !== 'undefined') activeField.parent.fields[index + 1].focus();
                // e.stopPropagation();
                // e.preventDefault();
                // return false;
            }
        }
        if (e.target.classList.value.indexOf('gform-') < 0 && e.target.parentElement && e.target.parentElement.classList.value.indexOf('gform-') >= 0) {
            target = e.target.parentElement;
        }
        if (typeof target.dataset.id !== 'undefined') {
            // console.error('ID not set on element'); return false;
            field = gform.iterators.find.call(this, { id: target.dataset.id }, 10) || false;
            if (typeof field == 'undefined') { console.error('Field not found with id:' + target.dataset.id); return false; }
        }
        if (typeof target.dataset.ref !== 'undefined') {
            // console.error('ID not set on element'); return false;
            field = gform.iterators.find.call(this, { id: target.dataset.ref }, 10) || false;
            if (typeof field == 'undefined') { console.error('Field not found with id:' + target.dataset.id); return false; }
        }

        if (target.classList.contains('gform-add')) {
            e.stopPropagation();
            e.preventDefault();
            var newField = field.am.addField(null, field);

            if (!newField) return;
            if (newField.array.duplicate.clone == true) {
                newField.set(field.get())
                // if(gform.types[newField].base == "section"){
                //     newField.trigger(['change','input'],newField)
                // }
            }

            gform.addConditions.call(field.owner, newField);
            (('items' in newField) ? newField.items : gform).each.call(newField, gform.addConditions)

            if (newField.owner.fieldAttr('base', newField) == "section" && "fields" in newField && newField.fields.length) {
                _.each(newField.fields, (field) => field.trigger(['change', 'input'], field))
                // newField.trigger(['change','input'],newField);
            }
            field.am.reflow();
            gform.types[newField.type].focus.call(newField);
        }
        if (target.classList.contains('gform-minus')) {
            e.stopPropagation();
            e.preventDefault();
            field.am.removeField(field);
        }
        if (target.classList.contains('gform-append')) {
            e.stopPropagation();
            e.preventDefault();

            var newField = field.addField();
            if (!newField) return;

            gform.addConditions.call(field.owner, newField);
            (('items' in newField) ? newField.items : gform).each.call(newField, gform.addConditions)

            this.trigger('appended', newField);

            field.reflow();
            gform.types[newField.type].focus.call(newField);

            // var am = gform.iterators.filter.call(this,{id:target.dataset.ref});
            // // var field = 
            // if(am.length){
            //     this.trigger('appended', am[0].addField());
            //     am[0].reflow()
            // }
            // // var field = gform.addField.call(this,
            //     _.last((this.find({id:target.dataset.parent}) || this).filter({array:{ref:target.dataset.ref}},10))
            // )
        }
        if (target.classList.contains('gform-info')) {
            e.stopPropagation();
            e.preventDefault();

            if (field.infoEl) {
                var show = true;
                if (this.popper !== null) {
                    show = (this.popper.state.elements.reference != target)
                    this.el.removeChild(this.infoEl)
                    this.popper.destroy()
                    this.popper = null;
                }

                if (show) {
                    this.infoEl.querySelector('.tooltip-body').innerHTML = gform.render('_info', field);
                    this.popper = Popper.createPopper(e.target, this.infoEl, {
                        placement: 'top-end',
                        modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
                    });
                    this.el.appendChild(this.infoEl)
                }
            }
        }
    }.bind(this)
    this.el.addEventListener('click', this.listener)
    this.trigger('initialized', this);
    this.isActive = true;
    this.reflow();
    return this;
}
