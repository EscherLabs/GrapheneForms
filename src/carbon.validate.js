carbon.prototype.errors = {};
carbon.prototype.validate = function(){
	carbon.clearErrors.call(this);
    _.each(this.fields, carbon.validateItem)
	return this.valid;
};
carbon.handleError = carbon.update;
carbon.validateItem = function(item){
	carbon.performValidate(item);
	item.owner.errors[item.name] = item.errors;
	item.owner.valid = item.valid && item.owner.valid;
};
carbon.performValidate = function(target, pValue){
	var item = target;
	var value = target.get();
	if(typeof pValue !== 'undefined'){value = pValue;}
	target.valid = true;
	target.errors = '';

	if(typeof item.validate !== 'undefined' && typeof item.validate === 'object' && item.parsable){
		for(var r in item.validate){
			if(!carbon.validations[r].method.call(target, value, item.validate[r])){
				if((typeof item.show === 'undefined') || target.isVisible){
					target.valid = false;
					var estring = carbon.validations[r].message;
					if(typeof item.validate[r] == 'string') {
						estring = item.validate[r];
					}
					target.errors = estring.replace('{{label}}', item.label);
					// target.errors = estring.replace('{{value}}', value);
				}
			}
			carbon.handleError(target);
		}
	}
};
carbon.clearErrors = function() {
	this.valid = true;
	this.errors = {};
	//add code fore removing errors here
};
carbon.regex = {
	numeric: /^[0-9]+$/,
	// integer: /^\-?[0-9]+$/,
	decimal: /^\-?[0-9]*\.?[0-9]+$/,
	// email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
	// alpha: /^[a-z]+$/i,
	// alphaNumeric: /^[a-z0-9]+$/i,
	// alphaDash: /^[a-z0-9_-]+$/i,
	// natural: /^[0-9]+$/i,
	// naturalNoZero: /^[1-9][0-9]*$/i,
	// ip: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
	// base64: /[^a-zA-Z0-9\/\+=]/i,
	// url: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
	// date: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
};
carbon.validations = 
{
	required:{
		method: function(value, args) {
			return this.satisfied(value);
		},
		message: '{{label}} is required.'
	},
	matches:{
		method: function(value, matchName) {
			if (el == this.carbon[matchName]) {
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
	// valid_emails:{
	// 	method: function(value) {
	// 		var result = value.split(",");
	// 		for (var i = 0; i < result.length; i++) {
	// 			if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i.test(result[i])) {
	// 				return false;
	// 			}
	// 		}
	// 		return true;
	// 	},
	// 	message: '{{label}} must contain all valid email addresses.'
	// },
	min_length:{
		method: function(value, length) {
			if (!carbon.regex.numeric.test(length)) {
				return false;
			}
			return (value.length >= parseInt(length, 10));
		},
		message: '{{label}} must be at least %s characters in length.'
	},
	max_length:{
		method: function(value, length) {
			if (!carbon.regex.numeric.test(length)) {
				return false;
			}
			return (value.length <= parseInt(length, 10));
		},
		message: '{{label}} must not exceed %s characters in length.'
	},
	exact_length:{
		method: function(value, length) {
			if (!carbon.regex.numeric.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},
		message: '{{label}} must be exactly %s characters in length.'
	},
	greater_than:{
		method: function(value, param) {
			if (!carbon.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) > parseFloat(param));
		},
		message: '{{label}} must contain a number greater than %s.'
	},
	less_than:{
		method: function(value, param) {
			if (!carbon.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) < parseFloat(param));
		},
		message: '{{label}} must contain a number less than %s.'
	},
	numeric:{
		method: function(value) {
			return (carbon.regex.numeric.test(value) || value === '');
		},
		message: '{{label}} must contain only numbers.'
	},
	// alpha:{
	// 	method: function(value) {
	// 		return (carbon.regex.alpha.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must only contain alphabetical characters.'
	// },
	// alpha_numeric:{
	// 	method: function(value) {
	// 		return (carbon.regex.alphaNumeric.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must only contain alpha-numeric characters.'
	// },
	// alpha_dash:{
	// 	method: function(value) {
	// 		return (carbon.regex.alphaDash.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must only contain alpha-numeric characters, underscores, and dashes.'
	// },
	// integer:{
	// 	method: function(value) {
	// 		return (carbon.regex.integer.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain an integer.'
	// },
	// decimal:{
	// 	method: function(value) {
	// 		return (carbon.regex.decimal.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a decimal number.'
	// },
	// is_natural:{
	// 	method: function(value) {
	// 		return (carbon.regex.natural.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain only positive numbers.'
	// },
	// is_natural_no_zero:{
	// 	method: function(value) {
	// 		return (carbon.regex.naturalNoZero.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a number greater than zero.'
	// },
	// valid_ip:{
	// 	method: function(value) {
	// 		return (carbon.regex.ip.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a valid IP.'
	// },
	// valid_base64:{
	// 	method: function(value) {
	// 		return (carbon.regex.base64.test(value) || value === '');
	// 	},
	// 	message: 'The {{label}} field must contain a base64 string.'
	// }
};