forman.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'display' || conditions === 'enabled'  || conditions === 'parsable') {
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
			return forman.conditions[c].call(this, this.owner, item, (func || item.callBack))
		}.bind(this))
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
		return forman.events.on('change:' + this.name, function(args, local, topic, token) {
				func.call(this, args(), token);
			}.bind( this, args)
		);
	},
	multiMatch: function(forman, args, func) {
		forman.events.on('change:' + _.map(args, 'name').join(' change:'), function(args, local) {

			func.call(this, function(args, forman) {
				var status = false;
				for(var i in args) {
					var val = args[i].value; 
					var localval = forman.toJSON()[args[i].name];
					
					if(typeof val == 'object' && localval !== null){
						status = (val.indexOf(localval) !== -1);
					}else{
						status = (val == localval);
					}
					if(!status)break;
				}
				return status;
			}(args, forman), 'mm');

		}.bind(this, args))
		
		return 'mm';
	}
};
 