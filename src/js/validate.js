gform.prototype.errors = {};
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
	if(force || !item.valid || item.required || item.satisfied()){
		var value = item.get();
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
	}
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
	required:function(value) {
			return (this.satisfied(value) ? false : '{{label}} is required');
	},
	pattern: function(value, args) {
		var r = args.regex;
		if(typeof r == 'string'){r = gform.regex[r]}
		return r.pattern(value) || value === '' ? false : args.message;
	},
	custom: function(value, args) {
		return args.test.call(this, value, args);
	},
	matches:function(value, args) {
		var temp = this.parent.find(args.name);
		args.label = temp.label;
		args.value = temp.get();
		if(typeof temp == 'undefined'){return "Matching field not defined";}
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