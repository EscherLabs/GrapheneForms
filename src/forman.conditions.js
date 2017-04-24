forman.processConditions = function(conditions, func) {
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
        debugger;
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
            debugger;
				func.call(this.self, (args.value  === local.value), token);
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
