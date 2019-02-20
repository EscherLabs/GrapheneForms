gform.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'display' || conditions === 'enable'  || conditions === 'parse') {
			conditions = this.item[conditions];
		}else if(conditions === 'enable') {
			conditions = this.item.enable;
		}
	}
	if (typeof conditions === 'boolean') {
		func.call(this, conditions)
	}
	if (typeof conditions === 'function') {
		func.call(this, conditions.call(this))
	}
	if (typeof conditions === 'object') {
		var callback = function(rules,func){
			func.call(this, gform.rules.call(this, rules))
		}.bind(this, conditions, func)

		for(var i in conditions) {
			this.owner.sub('change:' + _.values(conditions[i])[0].name, callback)
		}
		// debugger;
		// func.call(this, gform.rules.call(this, conditions));
	}
	return true;
};

gform.rules = function(rules){
return _.every(_.map(rules, function(rule, i){
	return _.every(_.map(rule, function(args,name,rule) {
		return gform.conditions[name](this.owner, this, args)
	}.bind(this)));
}.bind(this)))
}

gform.conditions = {
	requires: function(gform, args, func) {
		return gform.sub('change:' + args.name, function(args, local, topic, token) {
				func.call(this, local.find(args.path).satisfied(), token);
			}.bind(this, args)
		);
	},
	// valid_previous: function(gform, args) {},
	not_matches: function(gform, field, args) {
		var val = args.value;
		var localval = (field.parent.find(args.name) || {value:''}).value;
		if(typeof val== "object" && localval !== null){
			return (val.indexOf(localval) == -1);
		}else{
			return (val !== localval);
		}
	},
	test: function(gform, args, func) {
		return gform.sub('change:' + args.name, function(args, local, topic, token) {
				func.call(this, args.callback(), token);
			}.bind( this, args)
		);
	},
	contains: function(gform , args, func) {
		return gform.sub('change:' + args.name, function(args, local, topic, token) {
				func.call(this, (typeof local.value !== 'undefined'  && local.value.indexOf(args.value) !== -1 ), token);
			}.bind( this, args)
		).lastToken;
	},
	matches: function(gform, field, args) {
		var val = args.value;
		var localval = (field.parent.find(args.name) || {value:''}).value;
		if(typeof val== "object" && localval !== null){
			return (val.indexOf(localval) !== -1);
		}else{
			return (val == localval);
		}
	}
}; 