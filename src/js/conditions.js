gform.processConditions = function (conditions, func, options) {
	let { _subscribe = gform._subscribeByName, _lookup = gform._lookup } = options || {};
	let response = true;
	if (typeof conditions === 'string') {
		if (conditions === 'show' || conditions === 'edit' || conditions === 'parse') {
			conditions = this.item[conditions];
		}
		if (typeof conditions == 'string' && conditions.indexOf('method:') == 0) {
			if (typeof this.owner.methods !== 'undefined' && typeof this.owner.methods[conditions.split('method:')[1]] == 'function') {
				func.call(this, this.owner.methods[conditions.split('method:')[1]].call(null, { form: this.owner, field: this }), { form: this.owner, field: this })
			}
		}
	}
	if (typeof conditions === 'boolean') {
		response = func.call(this, conditions, { form: this.owner, field: this })
	}
	if (typeof conditions === 'function') {
		response = func.call(this, conditions.call(null, { form: this.owner, field: this }), { form: this.owner, field: this })
	}
	if (typeof conditions === 'object') {
		var callback = function (rules, func, _lookup, e) {
			func.call(this, gform._rules.call(this, rules, _lookup), e)
		}.bind(this, conditions, func, _lookup)
		_subscribe.call(this, conditions, callback)
		response = callback({ field: this, form: this.owner, event: "create" })
	}
	return response;
};


gform._subscribeByName = function (conditions, callback) {
	if (!(this.owner instanceof gform)) return;

	for (var i in conditions) {
		if (typeof conditions[i].conditions == 'object') {
			gform._subscribeByName.call(this, conditions[i].conditions, callback)
		} else {
			var temp = gform._lookup(this, conditions[i])

			if ((conditions[i].name || this.name).indexOf('/') !== 0 && typeof temp !== 'undefined') {


				// if(typeof temp !== "undefined"){
				this.eventlist = this.eventlist || [];

				this.owner.on('change:' + temp.path, callback, this.eventlist)

				// }else{
				// 	this.owner.on('change:' + (this.parent.find(conditions[i].name||this.name)||this.parent).path||(conditions[i].name||this.name), callback)
				// }
			} else {
				this.owner.on('change:' + (conditions[i].name || this.name), callback)
			}
		}
	}
}

gform._rules = function (rules, _lookup, op) {
	var op = op || 'and';
	return _.reduce(rules, function (result, rule) {
		var s;
		if (typeof rule.conditions !== 'undefined') {
			s = gform._rules.call(this, rule.conditions, _lookup, rule.op);
		} else {
			s = gform.conditions[rule.type](this, rule, _lookup);
		}
		if (op == 'or') {
			return result || s;
		} else {
			return result && s;
		}
	}.bind(this), (op == 'and'))
}

gform.conditions = {
	// requires: (field, args, _lookup = _lookup) => _lookup(field, args, _lookup).satisfied(),
	requires: (field, args, _lookup = _lookup) => {
		let targetField = _lookup(field, args);
		return (targetField) ? targetField.satisfied() : false;
	},
	// valid_previous: function(gform, args) {},
	not_matches: (field, args, _lookup) => {
		let targetField = _lookup(field, args);
		if (!targetField) return;
		var val = args[args.attribute || 'value'];
		var localval = targetField[args.attribute || 'value'];

		if (typeof val == "object" && val !== null && localval !== null) {
			return (val.indexOf(localval) == -1);
		} else {
			return (val !== localval);
		}
	},
	test: (field, args, _lookup) => args.test.call(this, field, args),
	contains: (field, args, _lookup) => {
		let targetField = _lookup(field, args);

		var val = args.value;
		var localval = null;
		if (targetField && typeof targetField !== 'undefined') {
			if (targetField.array != false) {
				localval = field.parent.find(args.name).parent.get()[args.name]
			} else {
				localval = targetField.value;
			}
		} else {
			targetField = field.parent.find(args.name) || field.owner.filter({ path: args.name }, args.depth || 10)[0];
			if (typeof targetField == 'undefined') {
				return false;
			}
		}

		if (typeof val == "object" && val !== null && localval !== null) {
			if (typeof localval == 'object') {
				return (_.intersection(val, localval).length > 0)
			} else if (typeof localval == 'string') {
				return _.some(val, function (filter) { return (localval.indexOf(filter) >= 0); });
			}
		} else {
			return (typeof localval !== 'undefined' && localval !== null && localval.indexOf(val) !== -1)
		}
	},
	matches: (field, args, _lookup) => {
		let targetField = _lookup(field, args);
		if (!targetField) return;

		var val = args[args.attribute || 'value'];
		var localval = targetField[args.attribute || 'value'];
		if (typeof val == "object" && val !== null && localval !== null) {
			return (val.indexOf(localval) !== -1);
		} else {
			return (val == localval);
		}
	},

	matches_bool: (field, args, _lookup) => {
		let targetField = _lookup(field, args);
		if (!targetField) return;

		var val = args[args.attribute || 'value'];
		var localval = targetField[args.attribute || 'value'];
		return (val == "false" || !val) == (localval == "false" || !localval)
	},
	matches_numeric: (field, args, _lookup) => {
		let targetField = _lookup(field, args);
		if (!targetField) return;

		var val = args[args.attribute || 'value'];
		var localval = parseInt(targetField[args.attribute || 'value']);
		if (typeof val == "object" && val !== null && localval !== null) {
			return (_.map(val, function (vals) { return parseInt(vals); }).indexOf(localval) !== -1);
		} else {
			return (parseInt(val) == localval);
		}
	},
	numeric: function (field, args, _lookup) {
		let targetField = _lookup(field, args);
		if (!targetField) return;

		var val = args[args.attribute || 'value'];
		var localval = parseInt(targetField[args.attribute || 'value']);

		if (!(gform.regex.decimal.test(value) || value === '')) {
			return '{{label}} must contain only numbers';
		}

		args.min = (typeof this.min == 'number') ? this.min : (typeof args.min == 'number') ? args.min : null
		if (args.min !== null && parseFloat(value) < parseFloat(args.min)) {
			return '{{label}} must contain a number not less than {{args.min}} '
		}

		args.max = (typeof this.max == 'number') ? this.max : (typeof args.max == 'number') ? args.max : null
		if (args.max !== null && parseFloat(value) > parseFloat(args.max)) {
			return '{{label}} must contain a number not more than {{args.max}}'
		}



		if (typeof val == "object" && val !== null && localval !== null) {
			return (_.map(val, function (vals) { return parseInt(vals); }).indexOf(localval) !== -1);
		} else {
			return (parseInt(val) == localval);
		}

	}
};