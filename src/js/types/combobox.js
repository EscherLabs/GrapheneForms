gform.stencils.combobox = `
<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
	<div class="combobox-container">
		<div class="input-group" style="width:100%" contentEditable="false"> 
		{{#pre}}<span class="input-group-addon">{{{pre}}}</span>{{/pre}}
        <div style="" {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control {{^editable}}readonly disabled{{/editable}}" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" {{#editable}}contentEditable{{/editable}} type="combobox" data-type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{name}}" value="{{value}}" ></div>
        <ul class="combobox-list dropdown-menu "></ul>
        <span class="input-group-addon dropdown-toggle" style="" data-dropdown="dropdown"> <span class=" status-icon" data-dropdown="dropdown"></span>  </span> 
		</div>
        </div>
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`;

gform.types['combobox'] = _.extend({}, gform.types['input'], {
    base: "collection",
    destroy: function () {
        this.el.removeEventListener('change', this.onchangeEvent);
        this.el.removeEventListener('input', this.onchangeEvent);
        this.combo.removeEventListener('blur', this.handleBlur)

    },
    itemTemplate: '<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{i}}" class="dropdown-item">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>',
    satisfied: function (value) {
        value = value || this.value;
        if (this.strict) {
            value = (_.find(this.options, { value: value }) || { value: "" }).value;
        }
        if (_.isArray(value)) { return !!value.length; }
        return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'number' && isNaN(value)));
    },
    toString: function (name, display) {
        if (!display) {
            return '<dt>' + this.label + '</dt> <dd>' + (((typeof this.combo !== 'undefined') ? this.combo.innerText : this.get()) || '(empty)') + '</dd><hr>'
        } else {
            return (typeof this.combo !== 'undefined') ? this.combo.innerText : this.get();
        }
    },
    focus: function () {
        if (!this.active) return;
        var node = this.el.querySelector('[type=combobox]');
        if (node !== null) {
            node.focus();
            if (node.textContent == '') return;
            var sel = window.getSelection();
            var focus = sel.focusNode;

            if (focus !== null && focus !== document) {
                var range = document.createRange();
                range.selectNode(focus);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

    },
    render: function () {
        if (typeof this.mapOptions == 'undefined') {
            this.mapOptions = new gform.mapOptions(this, this.value, 0, this.owner.collections)
            this.mapOptions.on('change', function () {
                this.options = this.mapOptions.getoptions()
                if (this.shown) {
                    this.renderMenu();
                }
                if (typeof this.value !== 'undefined') {
                    gform.types[this.type].set.call(this, this.value);
                }
            }.bind(this))
        }
        this.options = this.mapOptions.getoptions();
        this.internalValue = this.value || "";
        return gform.render('combobox', this);
    },
    get: function () {
        return ((this.strict) ? (_.find(this.options, { value: this.value }) || { value: "" }) : this).value;

    },
    set: function (value, silent, input) {
        // console.log('input:' + input);

        value = (typeof value == "string") ? value.replace((/  |\r\n|\n|\r/gm), "") : value
        var item = _.find(this.options, { value: value }) || _.find(this.options, { label: value })
        if (typeof item !== 'undefined') {
            if (!input || (input == 'nosearch' && (this.el.querySelector('[type=combobox]') !== document.activeElement || this.combo.innerText !== item.label))) {
                this.combo.innerText = item.label;
                gform.addClass(this.el.querySelector('.combobox-container'), 'combobox-selected');
            }
            this.internalValue = item.value;
        } else {
            if (typeof this.search == 'string' && typeof this.owner.methods[this.search] !== 'function' && input !== 'nosearch') {
                gform.removeClass(this.el.querySelector('.combobox-container'), 'loaded');
                gform.ajax({
                    sourceID: 'set' + this.id,
                    path: gform.renderString(this.search, { value: value }), success: this.searchData.bind(this, value)
                })
            } else if ((typeof this.search == "function" || typeof this.owner.methods[this.search] == 'function') && input !== 'nosearch') {
                gform.removeClass(this.el.querySelector('.combobox-container'), 'loaded');

                async function asyncCall() {
                    return await new Promise(function (resolve) {

                        let response = (this.owner.methods[this.search] || this.search).call(this, { value: value }, resolve)
                        if (typeof response == 'object') {
                            resolve(response);
                        }
                    }.bind(this));

                }

                ;
                // const promise1 = new Promise((resolve, reject) => {
                //     setTimeout(resolve, 500, 'one');
                // });

                const promise2 = new Promise((resolve, reject) => {
                    setTimeout(resolve, 2000, []);
                });

                Promise.race([asyncCall.call(this), promise2]).then(this.searchData.bind(this, value));

            }
            this.internalValue = value || "";

            if ('el' in this) {
                if (this.combo.innerHTML !== value) {
                    this.combo.innerHTML = value;
                    gform.types.combobox.focus.call(this);
                }

                if (typeof value == 'undefined' || (typeof value !== 'undefined' && this.combo.innerText !== value)) {
                    this.combo.innerText = this.value || "";

                    this.trigger(['undefined'], this);
                }
                gform.toggleClass(this.el.querySelector('.combobox-container'), 'combobox-selected', this.value !== "");
            }

        }
        gform.types[this.type].setLabel.call(this);
        if (!silent) {
            this.parent.trigger(['change'], this);
        }
    },
    edit: function (state) {
        this.editable = state;
        this.el.querySelector('.form-control').setAttribute("contenteditable", state ? "true" : "false");
        gform.toggleClass(this.el, 'disabled', !state)
    },
    initialize: function () {
        this.onchangeEvent = _.debounce(function (input) {
            this.renderMenu();
            this.set(this.combo.innerText, false, true);
            this.parent.trigger(['input'], this, { input: this.value });
        }.bind(this), 300)
        // }.bind(this)
        gform.types[this.type].setup.call(this);
        this.processOptions = function (option) {

            option.visible = ('visible' in option) ? option.visible : true
            option.editable = ('editable' in option) ? option.editable : true

            if (typeof option.optgroup !== 'undefined') {
                if (typeof option.optgroup.options !== 'undefined' && option.optgroup.options.length) {
                    _.each(option.optgroup.options, this.processOptions.bind(this))
                }
            } else {
                option = this.createLI(false, option)
            }
        }
        this.createLI = function (force, option) {

            if (typeof option !== 'undefined' && typeof option !== 'object') {
                option = { label: option, value: option }
            }
            option.i = (option.i || (++index));
            // if (typeof this.format !== 'undefined') {
            //     if (typeof this.format.label !== 'undefined') {
            //         option.label = gform.renderString(this.format.label, option);
            //     }
            //     if (typeof this.format.display !== 'undefined') {
            //         option.display = gform.renderString(this.format.display, option);
            //     }
            //     if (typeof this.format.value == 'string') {
            //         option.value = gform.renderString(this.format.value, option);
            //     } else if (typeof this.format.value == 'function') {
            //         option.value = this.format.value.call(this, option)
            //     }
            // }
            if (!('processed' in option)) {

                option = _.reduce(['label', 'display', 'value'/*,'cleanlabel'*/], function (format, option, prop) {
                    if (prop in format) {
                        if (prop in option) {
                            option.original = option.original || {};
                            option.original[prop] = option[prop]
                        }
                        option[prop] = (typeof format[prop] == 'string') ?

                            (format[prop] in option) ? option[format[prop]] : gform.renderString(format[prop], option)

                            : (typeof format[prop] == 'function') ?
                                format[prop].call(this, option)
                                : option[prop]
                    }
                    option.processed = true;
                    return option;
                }.bind(this, this.format), option)
            }
            option.visible = ('visible' in option) ? option.visible : true
            option.editable = ('editable' in option) ? option.editable : true
            if (this.filter !== false && (force || this.combo.innerText == "" || _.score(option.label.toLowerCase(), this.combo.innerText.toLowerCase()) > .6)) {
                var li = document.createElement("li");
                li.innerHTML = gform.renderString(gform.types[this.type].itemTemplate, option);
                this.menu.appendChild(li);
                option.filter = true;
            } else {
                // if (this.filter == false) {
                //     var li = document.createElement("li");
                //     li.innerHTML = gform.renderString(gform.types[this.type].itemTemplate, option);
                //     this.menu.appendChild(li);
                // }
                option.filter = false;
            }
            return option;
        }.bind(this)
        this.searchData = function (value, data) {
            if (data.length > 0 && this.combo.innerText == value) {
                if (!this.active) return;
                this.menu.style.display = 'none';
                this.shown = false;
                this.menu.innerHTML = "";

                index = this.options.length;
                this.options = this.mapOptions.getoptions();

                this.menu.innerHTML = "";
                this.options = this.options.concat(_.map(data, this.createLI.bind(null, true)))

                if (typeof this.custom == 'object') {
                    var li = document.createElement("li");
                    li.innerHTML = gform.renderString('<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{custom.name}}" class="dropdown-item">{{{custom.display}}}</a>', this);
                    this.menu.appendChild(li);
                }

                var first = this.menu.querySelector('li');
                if (first !== null) {
                    gform.addClass(first, 'active')
                } else {
                    this.internalValue = null;
                }
                var item = _.find(this.options, { value: value }) || _.find(this.options, { label: value })
                this.shown = (typeof item == 'undefined' && data.length > 0) && this.el.contains(document.activeElement);
                this.menu.style.display = (this.shown) ? 'block' : 'none';

                this.set((item || { value: value }).value, true, 'nosearch')

                this.parent.trigger(['change'], this, { input: this.value });
            }
            gform.addClass(this.el.querySelector('.combobox-container'), 'loaded');

        }
        this.renderMenu = function () {
            if (!this.active) return;
            this.menu.style.display = 'none';
            this.shown = false;
            this.menu.innerHTML = "";
            this.options = this.mapOptions.getoptions();
            _.each(this.options, this.processOptions.bind(this))

            var first = this.menu.querySelector('li');
            if (first !== null) {
                gform.addClass(first, 'active')
                this.menu.style.display = 'block';
                this.shown = true;
            }
            if (typeof this.search == 'undefined') {
                if (typeof this.custom == 'object') {

                    this.menu.style.display = 'block';
                    this.shown = true;

                    var li = document.createElement("li");
                    li.innerHTML = gform.renderString('<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{custom.name}}" class="dropdown-item">{{{custom.display}}}</a>', this);
                    this.menu.appendChild(li);
                }
            }

        }
        this.shown = false;
        this.input = this.input || false;
        this.menu = this.el.querySelector('ul')
        this.combo = this.el.querySelector('.form-control');
        this.set = gform.types[this.type].set.bind(this);

        this.select = function (index) {
            if (!isNaN(parseInt(index))) {
                var item = _.find(this.options, { i: parseInt(index) })
                this.set(item.value);
                this.parent.trigger(['input'], this, { input: this.value });

                this.menu.style.display = 'none';
                this.shown = false;
                gform.types.combobox.focus.call(this);
            } else {
                if (typeof this.custom == 'object' && this.custom.name == index) {
                    if (typeof this.custom.action == 'function') {
                        this.custom.action.call(this, { form: this.owner, field: this, event: this.custom.name })
                    }
                    this.parent.trigger(index, this);

                }
            }
        }
        $(this.el).on('click', ".dropdown-item", function (e) {
            ;
            if (e.currentTarget.dataset.editable != "false" && e.currentTarget.dataset.editable != false) this.select(e.currentTarget.dataset.index);
            e.stopPropagation();
        }.bind(this))

        this.el.addEventListener('mouseup', function (e) {
            if (typeof e.target.dataset.dropdown !== "undefined" && this.editable) {

                e.stopPropagation();
                if (this.el.querySelector('.combobox-selected') !== null) {
                    this.set(null, false, 'nosearch');
                    this.parent.trigger(['input'], this, { input: "" });
                    this.renderMenu();
                } else {
                    if (this.shown) {
                        this.menu.style.display = 'none';
                        this.shown = false;
                    } else {
                        this.renderMenu();
                    }
                }
                gform.types.combobox.focus.call(this);
            }
            this.mousedropdown = false;
        }.bind(this))
        let field = this;
        this.el.addEventListener('focusin', () => {
            if (!field.active) field.el.querySelector('.form-control').blur();
        })
        this.el.addEventListener('mousedown', function (e) {
            if (typeof e.target.dataset.dropdown !== "undefined") {

                this.mousedropdown = true;
            }
        }.bind(this))

        this.el.addEventListener('keydown', function (e) {
            if (!this.shown) {
                if (e.keyCode == 40) { this.renderMenu(); }
                if (e.keyCode == 13) { e.preventDefault(); }
                return;
            }
            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                    e.preventDefault();
                    let activeEl = this.menu.querySelector('li.active a');
                    if (activeEl !== null) {
                        this.select(activeEl.dataset.index);
                    }
                    break;
                case 27: // escape
                    e.preventDefault();
                    this.menu.style.display = 'none';
                    this.shown = false;
                    break;

                case 38: // up arrow
                    e.preventDefault();
                    var active = this.menu.querySelector('.active');
                    gform.removeClass(active, 'active');

                    prev = active.previousElementSibling;

                    if (!prev) {
                        var list = this.menu.querySelectorAll('li');
                        prev = list[list.length - 1];
                    }

                    gform.addClass(prev, 'active')

                    var active = $(this.menu).find('.active');
                    //fixscroll
                    if (active.length) {
                        var top = active.position().top;
                        var bottom = top + active.height();
                        var scrollTop = $(this.menu).scrollTop();
                        var menuHeight = $(this.menu).height();
                        if (bottom > menuHeight) {
                            $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                        } else if (top < 0) {
                            $(this.menu).scrollTop(scrollTop + top);
                        }
                    }
                    break;

                case 40: // down arrow
                    e.preventDefault();
                    var active = this.menu.querySelector('.active');
                    gform.removeClass(active, 'active');
                    next = active.nextElementSibling;
                    if (!next) {
                        next = this.menu.querySelector('li')
                    }
                    gform.addClass(next, 'active')
                    var active = $(this.menu.querySelector('.active'));
                    //fixscroll
                    if (active.length) {
                        var top = active.position().top;
                        var bottom = top + active.height();
                        var scrollTop = $(this.menu).scrollTop();
                        var menuHeight = $(this.menu).height();
                        if (bottom > menuHeight) {
                            $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                        } else if (top < 0) {
                            $(this.menu).scrollTop(scrollTop + top);
                        }
                    }
                    break;
            }
            e.stopPropagation();
        }.bind(this))

        $(this.menu).on('mouseenter', 'li', function (e) {
            this.mousedover = true;
            if (this.menu.querySelector('.active') !== null) {
                gform.removeClass(this.menu.querySelector('.active'), 'active')
            }
            gform.addClass(e.currentTarget, 'active')
        }.bind(this))

        $(this.menu).on('mouseleave', 'li', function (e) {
            this.mousedover = false;
        }.bind(this))

        /*look into clean up this way*/
        this.handleBlur = function (e) {
            if (e.sourceCapabilities == null) return;
            /*clean up value to just be a string*/
            var input = document.createElement("input");
            input.value = this.combo.innerText;
            this.combo.innerHTML = input.value


            if (!(
                gform.hasClass(e.relatedTarget, 'dropdown-item') ||
                gform.hasClass(e.relatedTarget, 'dropdown-toggle') ||
                this.mousedropdown
            )) {
                if (this.shown) {
                    var list = _.filter(this.options, { filter: true });
                    if (this.strict) {
                        if (list.length == 1) {
                            this.set(list[0].value);
                        } else {
                            list = _.filter(this.options, { label: this.combo.innerText });
                            if (list.length) {
                                this.set(list[0].value);
                            }
                        }
                    } else {
                        this.set(this.combo.innerText)
                    }
                    if (!this.mousedover && this.shown) {
                        setTimeout(function () {
                            this.menu.style.display = 'none'; this.shown = false;
                        }.bind(this), 200);
                    }
                    this.parent.trigger(['input'], this, { input: this.value });
                    this.menu.style.display = 'none';
                    this.shown = false;
                } else { }

                if (this.strict) {
                    let updateVal = this.value || this.combo.innerText;
                    this.set(updateVal, true, 'nosearch');
                    let newVal = gform.types[this.type].get.call(this)
                    this.set(newVal)
                    if (updateVal !== newVal) this.parent.trigger(['input'], this, { input: newVal });
                } else {
                    if (typeof _.find(this.options, { value: this.value }) !== "undefined") {
                        this.set(this.value)
                    } else {
                        this.parent.trigger(['undefined'], this);
                    }
                }
            }
        }.bind(this);
        this.combo.addEventListener('blur', this.handleBlur)
        this.options = this.mapOptions.getoptions();
        if (typeof this.search == 'string' && typeof this.value !== 'undefined' && this.value !== "") {
            gform.removeClass(this.el.querySelector('.combobox-container'), 'loaded');
            gform.ajax({
                sourceID: 'init' + this.id,
                path: gform.renderString(this.search, { value: this.value }), success: function (data) {
                    index = this.options.length;
                    this.options = this.options.concat(_.map(data, this.createLI.bind(null, false)))
                    if (typeof this.value !== 'undefined') {
                        this.set(this.value);
                    }
                    this.parent.trigger(['options'], this);
                    gform.addClass(this.el.querySelector('.combobox-container'), 'loaded');
                }.bind(this)
            })
        } else
            if (typeof this.search == 'function' && typeof this.value !== 'undefined' && this.value !== "") {
                gform.removeClass(this.el.querySelector('.combobox-container'), 'loaded');

                index = this.options.length;
                this.options = this.options.concat(_.map(this.search.call(this, { value: value }), this.createLI.bind(null, false)))
                if (typeof this.value !== 'undefined') {
                    this.set(this.value);
                }
                this.parent.trigger(['options'], this);
                gform.addClass(this.el.querySelector('.combobox-container'), 'loaded');


            } else {
                gform.addClass(this.el.querySelector('.combobox-container'), 'loaded');

                if (typeof this.value !== 'undefined') {
                    this.set(this.value);
                }
            }


        this.el.addEventListener('input', this.onchangeEvent.bind(null, true));
    }
});