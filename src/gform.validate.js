gform.prototype.errors = {};
gform.prototype.validate = function(){
	gform.clearErrors.call(this);
    _.each(this.fields, gform.validateItem)
	return this.valid;
};
gform.handleError = gform.update;
gform.validateItem = function(item){
	gform.performValidate(item);
	item.owner.errors[item.name] = item.errors;
	item.owner.valid = item.valid && item.owner.valid;
};
gform.performValidate = function(target, pValue){
	var item = target;
	var value = target.get();
	if(typeof pValue !== 'undefined'){value = pValue;}
	target.valid = true;
	target.errors = '';

	if(typeof item.validate !== 'undefined' && typeof item.validate === 'object' && item.isParsable){
		for(var r in item.validate) {
			if(!gform.validations[r].method.call(target, value, item.validate[r])){
				if((typeof item.show === 'undefined') || target.isVisible){
					target.valid = false;
					var estring = gform.validations[r].message;
					if(typeof item.validate[r] == 'string') {
						estring = item.validate[r];
					}													
					target.errors = gform.renderString(estring,item);
				}
			}
			gform.handleError(target);
		}
	}
};
gform.clearErrors = function() {
	this.valid = true;
	this.errors = {};
	//add code for removing errors here
};
gform.regex = {
	numeric: /^[0-9]+$/,
	decimal: /^\-?[0-9]*\.?[0-9]+$/
};
gform.validations = 
{
	required:{
		method: function(value, args) {
			return this.satisfied(value);
		},
		message: '{{label}} is required.'
	},
	matches:{
		method: function(value, matchName) {
			if (el == this.gform[matchName]) {
				return value === el.value;
			}
			return false;
		},
		message: '{{label}} does not match the %s field.'
	},	
	date:{
		method: function(value, args) {
	        return (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(value) || value === '');
		},
		message: '{{label}} should be in the format MM/DD/YYYY.'
	},
	valid_url:{
		method: function(value) {
			return (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value) || value === '');
		},
		message: '{{label}} must contain a valid Url.'
	},
	valid_email:{
		method: function(value) {
			return (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i.test(value) || value === '');
		},
		message: '{{label}} must contain a valid email address.'
	},
	min_length:{
		method: function(value, length) {
			if (!gform.regex.numeric.test(length)) {
				return false;
			}
			return (value.length >= parseInt(length, 10));
		},
		message: '{{label}} must be at least %s characters in length.'
	},
	max_length:{
		method: function(value, length) {
			if (!gform.regex.numeric.test(length)) {
				return false;
			}
			return (value.length <= parseInt(length, 10));
		},
		message: '{{label}} must not exceed %s characters in length.'
	},
	exact_length:{
		method: function(value, length) {
			if (!gform.regex.numeric.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},
		message: '{{label}} must be exactly %s characters in length.'
	},
	greater_than:{
		method: function(value, param) {
			if (!gform.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) > parseFloat(param));
		},
		message: '{{label}} must contain a number greater than %s.'
	},
	less_than:{
		method: function(value, param) {
			if (!gform.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) < parseFloat(param));
		},
		message: '{{label}} must contain a number less than %s.'
	},
	numeric:{
		method: function(value) {
			return (gform.regex.numeric.test(value) || value === '');
		},
		message: '{{label}} must contain only numbers.'
	}
};