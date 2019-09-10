gform.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'show' || conditions === 'edit'  || conditions === 'parse') {
			conditions = this.item[conditions];
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
			func.call(this, gform._rules.call(this, rules))
		}.bind(this, conditions, func)

		// for(var i in conditions) {
		// 	this.owner.sub('change:' + conditions[i].name, callback)
		// }
		gform._subscribeByName.call(this, conditions, callback)
		// debugger;
		// func.call(this, gform._rules.call(this, conditions));
	}
	return true;
};

gform._subscribeByName = function(conditions, callback){
	for(var i in conditions) {
		if(typeof conditions[i].name !== 'undefined'){
			this.owner.on('change:' + conditions[i].name, callback)
		}else if(typeof conditions[i].conditions == 'object'){
			gform._subscribeByName.call(this, conditions[i].conditions, callback)
		}
	}
}

gform._rules = function(rules, op){
	var op = op||'and';
	return _.reduce(rules,function(result, rule){
		var s;
		if(typeof rule.conditions !== 'undefined'){
			s = gform._rules.call(this, rule.conditions,rule.op);
			console.log(s);
		}else{
			s = gform.conditions[rule.type](this, rule);
		}
		if(op == 'or'){
			return result || s;
		}else{
			return result && s;
		}
	}.bind(this),(op == 'and'))
}

gform.conditions = {
	requires: function(field, args) {
		return field.parent.find(args.name).satisfied();
	},
	// valid_previous: function(gform, args) {},
	not_matches: function(field, args) {
		var val = args.value;
		var localval = (field.parent.find(args.name) || {value:''}).value;
		if(typeof val== "object" && localval !== null){
			return (val.indexOf(localval) == -1);
		}else{
			return (val !== localval);
		}
	},
	test: function(field, args) {
		return args.test.call(this, field, args);
	},
	contains: function(field, args) {
		var val = args.value;
		var localval = (field.parent.find(args.name) || {value:''}).value;
		if(typeof val== "object" && localval !== null){
			return (_.intersection(val,localval).length >0)
		}else{
			return (typeof localval !== 'undefined'  && localval.indexOf(val) !== -1 )
		}
	},
	matches: function(field, args) {
		var val = args.value;
		var localval = (field.parent.find(args.name) || {value:''}).value;
		if(typeof val== "object" && localval !== null){
			return (val.indexOf(localval) !== -1);
		}else{
			return (val == localval);
		}
	}
}; 