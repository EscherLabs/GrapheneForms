forman.field = function(item, owner) {
	this.children = {};
	this.owner = owner;
	this.hidden = false;
	this.item = $.extend(true, {}, this.defaults, item);

	this.owner.trigger('initializeField', {field: this});

	$.extend(this, this.owner.options, this.item);
	if(this.item.value !== 0){
		if(typeof item.value === 'function') {
			this.valueFunc = item.value;
			this.liveValue = function() {
				return this.valueFunc.call(this.owner.toJSON());
			};
			item.value = this.item.value = this.liveValue();
			this.owner.on('change', $.proxy(function(){
				this.set(this.liveValue());
			},this));
		} else if(typeof this.item.value === 'string' && this.item.value.indexOf('=') === 0 && typeof math !== 'undefined') {
			this.formula = this.item.value.substr(1);
			this.enabled = false;
			this.liveValue = function() {
				try {
					var temp = math.eval(this.formula, this.owner.toJSON());
					if($.isNumeric(temp)){
						return temp.toFixed((this.item.precision || 0));
					}
					return temp;
				}catch(e){
					 return this.formula;
				}
			};
			item.value = this.item.value = this.liveValue();
			this.owner.on('change', $.proxy(function() {
				this.set(this.liveValue());
			}, this));
		} else {
			this.value = (item.value || this.value || item.default || '');
		}
	} else {
		this.value = 0;
	}
	this.lastSaved = this.liveValue();
	this.id = (item.id || Berry.getUID());
	this.self = undefined;
	this.fieldset = undefined;

	if(typeof this.item.fieldset !== 'object'){
		if(this.item.fieldset !== undefined && $('.' + this.item.fieldset).length > 0) {
			this.fieldset = $('.' + this.item.fieldset)[0];
			this.owner.fieldsets.push(this.fieldset);
		}else{
			if(this.item.fieldset !== undefined && $('[name=' + this.item.fieldset + ']').length > 0) {
				this.fieldset = $('[name=' + this.item.fieldset + ']')[0];
				this.owner.fieldsets.push(this.fieldset);
			}
		}
	}else{
		if(this.item.fieldset.length){
			this.fieldset = this.item.fieldset;
		}
	}

	this.val = function(value) {
		if(typeof value !== 'undefined') {
			this.set(value);
		}
		return this.getValue();
	};
	this.columns = (this.columns || this.owner.options.columns);
	if(this.columns > this.owner.options.columns) { this.columns = this.owner.options.columns; }
};

$.extend(Berry.field.prototype, {
	type: 'text',
	offset: 0,
	version: '1.0',
	isContainer: false,
	isParsable: true,
	isVisible: true,
	isEnabled: true,
	instance_id: null,
	path: '',
	defaults: {},
	parent: null,
	getPath: function(force) {
		var path = '';
		if(this.parent !== null && this.parent !== undefined) {
			path = this.parent.getPath(force) + '.';
			if(this.parent.multiple || force){
				path += this.parent.instance_id + '.';
			}
		}
		return path + this.name;
	},
	isActive: function() {
		return this.parent === null || this.parent.isEnabled !== false;
	},
	isChild: function(){
		return  this.parent !== null;
	},
	set: function(value){
		if(this.value != value) {
			//this.value = value;
			this.setValue(value);
			this.trigger('change');
		}
	},
	revert: function(){
		this.item.value = this.lastSaved;
		this.setValue(this.lastSaved);
		return this;
	},
	hasChildren: function() {return !$.isEmptyObject(this.children);},
	create: function() {return Berry.render('berry_' + (this.elType || this.type), this);},
	render: function() {
		if(typeof this.self === 'undefined') {
			this.self = $(this.create()).attr('data-Berry', this.owner.options.name);
		} else {
			this.self.html($(this.create()).html());
		}
		this.display = this.getDisplay();
		return this.self;
	},
	getValue: function() { return this.$el.val(); },
	toJSON: function() {
		this.value = this.getValue();
		this.lastSaved = this.value;
		this.display = this.getDisplay();
		return this.lastSaved;
	},
	liveValue: function() {
		return this.value;
	},
	setup: function() {
		this.$el = this.self.find('input');
		this.$el.off();
		if(this.onchange !== undefined){ this.$el.on('input', this.onchange);}
		this.$el.on('input', $.proxy(function() {
			this.trigger('change');
		}, this));

		if(this.item.mask && $.fn.mask) {
			this.$el.mask(this.item.mask);
		}
	},
	initialize: function() {
		this.setup();
		if(typeof this.show !== 'undefined') {
			this.isVisible = (typeof this.show == 'undefined' || $.isEmptyObject(this.show));
		    this.self.toggle(this.isVisible);
		  //  this.update({}, true);

			this.showConditions = Berry.processConditions.call(this, this.show,
				function(bool, token) {
					if(typeof bool == 'boolean') {
					   // var temp = this.isVisible;
						this.showConditions[token] = bool;
						// this.self.show();
						this.isVisible = true;
						for(var c in this.showConditions) {
							if(!this.showConditions[c]) {
								this.isVisible = false;
								// this.self.hide();
								break;
							}
						}
						this.self.toggle(this.isVisible);
					}
				}
			);

			if(typeof this.showConditions === 'boolean') {
				this.self.toggle(this.showConditions);
				this.isVisible = this.showConditions;
				this.update({}, true);
			}
		}
		if(typeof this.enabled !== 'undefined') {
			this.enabledConditions = Berry.processConditions.call(this, this.enabled,
				function(bool, token) {
					if(typeof bool == 'boolean') {
						this.enabledConditions[token] = bool;
						this.isEnabled = true;
						this.enable();
						for(var c in this.enabledConditions) {
							if(!this.enabledConditions[c]) {
								this.isEnabled = false;
								this.disable();
								break;
							}
						}
					}
				}
			);
			if(typeof this.enabledConditions == 'boolean'){
				this.isEnabled = this.enabledConditions;
				this.update({}, true);
			}
		}
		if(typeof this.parsable !== 'undefined') {
			this.parsableConditions = Berry.processConditions.call(this, this.parsable,
				function(bool, token) {
					if(typeof bool == 'boolean') {
					    var temp = this.isParsable;
						this.parsableConditions[token] = bool;
						this.isParsable = true;
						for(var c in this.parsableConditions) {
							if(!this.parsableConditions[c]) {
								this.isParsable = false;
								break;
							}
						}
						if(temp !== this.isParsable){
						    this.trigger('change');
						}
					}
				}
			);
			if(typeof this.parsableConditions == 'boolean'){this.isParsable = this.parsableConditions;}
		}
		
		this.owner.trigger('initializedField', {field: this});
	},
	on: function(topic, func) {
		this.owner.on(topic + ':' + this.name, func);
	},
	delay: function(topic, func) {
		this.owner.delay(topic + ':' + this.name, func);
	},
	trigger: function(topic) {
		this.value = this.getValue();
		this.owner.trigger(topic + ':' + this.name, {
			// type: this.type,
			// name: this.name,
			id: this.id,
			value: this.value,
			// path: this.getPath()
		});
		//this.owner.trigger(topic);
	},
	setValue: function(value) {
		if(typeof value !== 'object'){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			return this.$el.val(value);
		}
		return this.value;
	},
	update: function(item, silent) {
		if(typeof item === 'object') {
			$.extend(this.item, item);
		}
		$.extend(this, this.item);
		this.setValue(this.value);
		this.render();
		this.setup();
		if(!silent) {
			this.trigger('change');
		}
	},
	blur: function() {
		this.$el.blur();
	},
	focus: function() {
		this.$el.focus().val('').val(this.value);
	},
	disable: function() {
		this.$el.prop('disabled', true);
	},
	enable: function() {
		this.$el.prop('disabled', false);
	},
	satisfied: function(){
		return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '');
	},
	displayAs: function() {
		return this.lastSaved;
	},
	getDisplay: function() {
		if(this.displayAs !== undefined) {
			if(this.item.template !== undefined) {
				this.display = this.displayAs();
				return Berry.render(this.item.template, this);
			} else {
				return this.displayAs() || this.item.default || this.item.value  || 'Empty';
			}
		}else{
			if(this.item.template !== undefined) {
				return Berry.render(this.item.template, this);
			} else {
				return this.lastSaved || this.item.default || this.item.value  ||  'Empty';
			}
		}
	},
	destroy: function() {
		if(this.$el){
			this.$el.off();
		}
 },

});

Berry.field.extend = function(protoProps) {
	var parent = this;
	var child = function() { return parent.apply(this, arguments); };
	var Surrogate = function() { this.constructor = child; };
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;
	if (protoProps) $.extend(child.prototype, protoProps);
	return child;
};
