gform.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'display' || conditions === 'enable'  || conditions === 'parse') {
			conditions = this.item[conditions];
		}else if(conditions === 'enable') {
			conditions = this.item.enable;
		}
	}
	if (typeof conditions === 'boolean') {
		return conditions;
	}
	if (typeof conditions === 'object') {
		return _.map(conditions, function(item, c){
			return gform.conditions[c].call(this, this.owner, item, (func || item.callBack))
		}.bind(this))
	}
	return true;
};

gform.conditions = {
	requires: function(gform, args, func) {
		return gform.events.on('change:' + args.name, function(args, local, topic, token) {
				func.call(this, (local.value !== null && local.value !== ''), token);
			}.bind(this, args)
		);
	},
	// valid_previous: function(gform, args) {},
	not_matches: function(gform , args, func) {
		return gform.events.on('change:' + args.name, function(args, local, topic, token) {
				func.call(this, (args.value  !== local.value), token);
			}.bind(this, args)
		);
	},
	test: function(gform, args, func) {
		return gform.events.on('change:' + this.name, function(args, local, topic, token) {
				func.call(this, args(), token);
			}.bind( this, args)
		);
	},
	contains: function(gform , args, func) {
		return gform.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (typeof local.value !== 'undefined'  && local.value.indexOf(args.value) !== -1 ), token);
			}, this, args)
		).lastToken;
	},
	matches: function(gform, args, func) {
		var callback = function(args, local) {
			func.call(this, function(args, gform) {
				var status = true;
				var i = 0;
				while(status && i < args.length) {
					var val = args[i].value; 
					var localval = gform.toJSON()[args[i++].name];
					if(typeof val== "object" && localval !== null){
						status = (val.indexOf(localval) !== -1);
					}else{
						status = (val == localval);
					}
				}
				return status;
			}(args, gform));
		}.bind(this, args);

		for(var i in args){
			gform.events.on('change:' + args[i].name, callback)
		}
		
	}
}; 
