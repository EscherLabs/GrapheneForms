var forman = function(data, target){
    //initalize form
    this.options = _.assignIn({legend: '', attributes:{}}, this.opts, data);
    document.querySelector(target).innerHTML = forman.stencils.container(this.options);
    this.el = document.querySelector(target + ' form')

    //initialize individual fields
    this.fields = _.map(this.options.fields, forman.initialize.bind(this, this, this.options.attributes||{}, null))

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
    // this.fields = _.keyBy(this.fields, 'name');
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

forman.initialize = function(parent, atts, target, fieldIn) {
    var field = _.assignIn({
        name: (fieldIn.label||'').toLowerCase().split(' ').join('_'), 
        id: forman.getUID(), 
        type: 'text', 
        extends: 'basic', 
        label: fieldIn.legend || fieldIn.name,
        validate: false,
        valid: true,
        parent: parent,
        array:false
    }, fieldIn)
    
    field.item = fieldIn;
    field.value =  atts[field.name] || field.value || field.default;
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

    field.el = document.createElement("div");
    field.el.setAttribute("id", field.id);
    field.el.setAttribute("class", 'row');
    field.el.innerHTML = (forman.stencils[field.type] || forman.stencils.text)(field);

    if (target == null || field.parent.el.lastChild == target) {
        field.parent.el.appendChild(field.el);
    } else {
        field.parent.el.insertBefore(field.el, target.nextSibling);
    }

    
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
                field.parent.fields.splice(index, 0, forman.initialize.call(this, field.parent, atts, field.el, field.item))
            }
        }.bind(this, field));
    }
    var minus = field.el.querySelector('.forman-minus');
    if(minus !== null){
        minus.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true > (field.array.min || 1)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                field.parent.fields.splice(index, 1);
                field.parent.el.removeChild(field.el);
            }else{
                field.set(null);
            }
        }.bind(this, field));
    }
    if(field.fields){
        field.fields = _.map(field.fields, forman.initialize.bind(this, field, atts[field.name]||{}, null) );
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
            required: '<span style="color:red">*</span>'}
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

forman.i = 0;
forman.getUID = function() {
    return 'f' + (forman.i++);
};forman.prototype.events = (function (_) {
  'use strict';

  // keys are event names
  var handlers = {};
  var events = {};

  events.on = function (event, handler) {
    if (typeof handlers[event] !== 'object') {
      handlers[event] = [];
    }

    handlers[event].push(handler);
  };

  events.off = function (event, handler) {
    var index = _.indexOf(handlers[event], handler);

    if (index === -1) {
      console.warn('Handler not found for event ' + event +
        ':', handler);
    } else {
      handlers[event].splice(index, 1);
    }
  };

  events.trigger = function (event) {
    var args = Array.prototype.slice.call(arguments, 1);

    _.each(handlers[event], function (handler) {
      handler.apply(events, args);
    });
  };

  events.debounce = function (event, handler) {
    events.on(event, _.debounce(handler, 250));
  };

  return events;
}(_));forman.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'show' || conditions === 'enabled'  || conditions === 'parsable') {
			conditions = this.item[conditions];
		}else if(conditions === 'enable') {
			conditions = this.item.enable;
		}
	}
	if (typeof conditions === 'boolean') {
		return conditions;
	}
	if (typeof conditions === 'object') {
		var keys = [];
		for(var c in conditions){
			keys.push(forman.conditions[c].call(this, this.owner, conditions[c], (func || conditions[c].callBack)));
		}
		return keys;
	}
	return true;
};

forman.conditions = {
	requires: function(forman, args, func) {
		return forman.events.on('change:' + args.name, function(args, local, topic, token) {
				func.call(this, (local.value !== null && local.value !== ''), token);
			}.bind(this, args)
		);
	},
	// valid_previous: function(forman, args) {},
	not_matches: function(forman , args, func) {
		return forman.events.on('change:' + args.name, function(args, local, topic, token) {
				func.call(this, (args.value  !== local.value), token);
			}.bind(this, args)
		);
	},
	matches: function(forman, args, func) {
		return forman.events.on('change:' + args.name, function(args, local, topic, token) {
				func.call(this.self, (args.value  === local.get()), token);
            }.bind(this, args)
		);
	},
	test: function(forman, args, func) {
		return forman.on('change:' + this.name, function(args, local, topic, token) {
				func.call(this, args(), token);
			}.bind( this, args)
		);
	},
	multiMatch: function(forman, args, func) {
		forman.on('change:' + _.pluck(args, 'name').join(' change:'), function(args, local, topic) {
			func.call(this, function(args,form){
				var status = false;
				for(var i in args) {
					var val = args[i].value; 
					var localval = form.toJSON()[args[i].name];
					
					if(typeof val == 'object' && localval !== null){
						status = (val.indexOf(localval) !== -1);
					}else{
						status = (val == localval);
					}
					if(!status)break;
				}
				return status;
			}(args, forman), 'mm');
		}.bind( this, args))
		return 'mm';
	}
};

forman.prototype.errors = {};
forman.prototype.validate = function(){
	forman.clearErrors.call(this);
    _.each(this.fields, forman.validateItem)
	return this.valid;
};
forman.handleError = forman.update;
forman.validateItem = function(item){
	forman.performValidate(item);
	item.owner.errors[item.name] = item.errors;
	item.owner.valid = item.valid && item.owner.valid;
};
forman.performValidate = function(target, pValue){
	var item = target;
	var value = target.get();
	if(typeof pValue !== 'undefined'){value = pValue;}
	target.valid = true;
	target.errors = '';

	if(typeof item.validate !== 'undefined' && typeof item.validate === 'object'){
		for(var r in item.validate){
			if(!forman.validations[r].method.call(target, value, item.validate[r])){
				if((typeof item.show === 'undefined') || target.isVisible){
					target.valid = false;
					var estring = forman.validations[r].message;
					if(typeof item.validate[r] == 'string') {
						estring = item.validate[r];
					}
					target.errors = estring.replace('{{label}}', item.label);
				}
			}
			forman.handleError(target);
		}
	}
};
forman.clearErrors = function() {
	this.valid = true;
	this.errors = {};
	// this.form.querySelector("." + this.options.errorSelector).removeClass(this.options.errorSelector).find("." + this.options.errorTextSelector).html("");
};
//var ruleRegex = /^(.+)\[(.+)\]$/,
forman.regex = {
	numeric: /^[0-9]+$/,
	integer: /^\-?[0-9]+$/,
	decimal: /^\-?[0-9]*\.?[0-9]+$/,
	email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
	// alpha: /^[a-z]+$/i,
	// alphaNumeric: /^[a-z0-9]+$/i,
	// alphaDash: /^[a-z0-9_-]+$/i,
	// natural: /^[0-9]+$/i,
	// naturalNoZero: /^[1-9][0-9]*$/i,
	// ip: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
	// base64: /[^a-zA-Z0-9\/\+=]/i,
	url: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
	date: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
};
forman.validations = {
	required:{
		method: function(value, args) {
			return this.satisfied(value);
		},
		message: 'The {{label}} field is required.'
	},
	matches:{
		method: function(value, matchName) {
			if (el == this.forman[matchName]) {
				return value === el.value;
			}
			return false;
		},
		message: 'The {{label}} field does not match the %s field.'
	},	
	date:{
		method: function(value, args) {
	        return (forman.regex.date.test(value) || value === '');
		},
		message: 'The {{label}} field should be in the format MM/DD/YYYY.'
	},
	valid_url:{
		method: function(value) {
			return (forman.regex.url.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid Url.'
	},
	valid_email:{
		method: function(value) {
			return (forman.regex.email.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid email address.'
	},
	valid_emails:{
		method: function(value) {
			var result = value.split(",");
			for (var i = 0; i < result.length; i++) {
				if (!forman.regex.email.test(result[i])) {
					return false;
				}
			}
			return true;
		},
		message: 'The {{label}} field must contain all valid email addresses.'
	},
	min_length:{
		method: function(value, length) {
			if (!forman.regex.numeric.test(length)) {
				return false;
			}
			return (value.length >= parseInt(length, 10));
		},
		message: 'The {{label}} field must be at least %s characters in length.'
	},
	max_length:{
		method: function(value, length) {
			if (!forman.regex.numeric.test(length)) {
				return false;
			}
			return (value.length <= parseInt(length, 10));
		},
		message: 'The {{label}} field must not exceed %s characters in length.'
	},
	exact_length:{
		method: function(value, length) {
			if (!forman.regex.numeric.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},
		message: 'The {{label}} field must be exactly %s characters in length.'
	},
	greater_than:{
		method: function(value, param) {
			if (!forman.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) > parseFloat(param));
		},
		message: 'The {{label}} field must contain a number greater than %s.'
	},
	less_than:{
		method: function(value, param) {
			if (!forman.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) < parseFloat(param));
		},
		message: 'The {{label}} field must contain a number less than %s.'
	},
	numeric:{
		method: function(value) {
			return (forman.regex.decimal.test(value) || value === '');
		},
		message: 'The {{label}} field must contain only numbers.'
	},
	// alpha:{
	// 	method: function(value) {
	// 		return (forman.regex.alpha.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must only contain alphabetical characters.'
	// },
	// alpha_numeric:{
	// 	method: function(value) {
	// 		return (forman.regex.alphaNumeric.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must only contain alpha-numeric characters.'
	// },
	// alpha_dash:{
	// 	method: function(value) {
	// 		return (forman.regex.alphaDash.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must only contain alpha-numeric characters, underscores, and dashes.'
	// },
	// integer:{
	// 	method: function(value) {
	// 		return (forman.regex.integer.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain an integer.'
	// },
	// decimal:{
	// 	method: function(value) {
	// 		return (forman.regex.decimal.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a decimal number.'
	// },
	// is_natural:{
	// 	method: function(value) {
	// 		return (forman.regex.natural.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain only positive numbers.'
	// },
	// is_natural_no_zero:{
	// 	method: function(value) {
	// 		return (forman.regex.naturalNoZero.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a number greater than zero.'
	// },
	// valid_ip:{
	// 	method: function(value) {
	// 		return (forman.regex.ip.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a valid IP.'
	// },
	// valid_base64:{
	// 	method: function(value) {
	// 		return (forman.regex.base64.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a base64 string.'
	// }
};