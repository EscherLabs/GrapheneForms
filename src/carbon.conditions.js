carbon.processConditions = function(conditions, func) {
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
			return carbon.conditions[c].call(this, this.owner, item, (func || item.callBack))
		}.bind(this))
	}
	return true;
};

carbon.conditions = {
	requires: function(carbon, args, func) {
		return carbon.events.on('change:' + args.name, function(args, local, topic, token) {
				func.call(this, (local.value !== null && local.value !== ''), token);
			}.bind(this, args)
		);
	},
	// valid_previous: function(carbon, args) {},
	not_matches: function(carbon , args, func) {
		return carbon.events.on('change:' + args.name, function(args, local, topic, token) {
				func.call(this, (args.value  !== local.value), token);
			}.bind(this, args)
		);
	},
	test: function(carbon, args, func) {
		return carbon.events.on('change:' + this.name, function(args, local, topic, token) {
				func.call(this, args(), token);
			}.bind( this, args)
		);
	},
	contains: function(carbon , args, func) {
		return carbon.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (typeof local.value !== 'undefined'  && local.value.indexOf(args.value) !== -1 ), token);
			}, this, args)
		).lastToken;
	},
	matches: function(carbon, args, func) {
		var callback = function(args, local) {
			func.call(this, function(args, carbon) {
				var status = true;
				var i = 0;
				while(status && i < args.length) {
					var val = args[i].value; 
					var localval = carbon.toJSON()[args[i++].name];
					if(typeof val== "object" && localval !== null){
						status = (val.indexOf(localval) !== -1);
					}else{
						status = (val == localval);
					}
				}
				return status;
			}(args, carbon));
		}.bind(this, args);

		for(var i in args){
			carbon.events.on('change:' + args[i].name, callback)
		}
		
	}
}; 
