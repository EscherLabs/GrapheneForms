
	forman.register({type: 'text' });
	forman.register({type: 'raw' });
	forman.register({type: 'password' });
	forman.register({type: 'date' ,
		setValue: function(value) {		
			if(typeof value !== 'object'){
				if(typeof moment !== 'undefined'){value = moment.utc(value).format('YYYY-MM-DD');}
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				return this.$el.val(value);
			}
			return this.value;
		}
	});
	forman.register({type: 'range' });

	forman.register({type: 'hidden',
		create: function() {
			return '<div><input type="hidden"  name="'+this.name+'" value="'+this.value+'" /></div>';}
	});

	forman.register({ type: 'url',
		defaults: {
			post: '<i class="fa fa-link"></i>',
			validate: {'valid_url': true }
		}
	});

	forman.register({ type: 'phone',
		defaults: {
			mask: '(999) 999-9999',
			post: '<i class="fa fa-phone"></i>' ,
			placeholder: '+1'
		}
	});
	forman.register({ type: 'color',
		defaults: {
			pre: '<i></i>' ,
			type: 'text'
		},	
		setValue: function(value) {
			if(typeof value !== 'object'){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				this.$el.parent().colorpicker('setValue', this.value)
				return this.$el.val(value);
			}
			return this.value;
		},
		setup: function() {
				this.$el = this.self.find('input');
				this.$el.off();
				if(this.onchange !== undefined){ this.$el.on('input', this.onchange);}
				this.$el.on('input', $.proxy(function() {this.trigger('change');}, this));
				this.$el.attr('type','text');
				this.$el.parent().colorpicker({format: 'hex'}).on('changeColor', $.proxy(function(ev){
				  this.trigger('change');
				}, this));
			}
	});
	forman.register({ type: 'email',
		defaults: {
		post: '<i class="fa fa-envelope"></i>' ,
		validate: { 'valid_email': true }
		}
	});

	forman.register({ type: 'number',
		defaults: { elType: 'text' },
		value: 0,
		getValue: function() {
			var temp = this.$el.val();
			if(temp === '') {
					return 0;
			}else{
				if( $.isNumeric( temp ) ){
					return parseFloat(temp, 10);
				}
			}

			// if( $.isNumeric( temp ) ){
			// 	return parseFloat(temp, 10);
			// }else{
			// 	if(temp === '') {
			// 		return temp;
			// 	}
			// 	this.revert();
			// 	return 0;
			// }
		},
		satisfied: function(){
			return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '' && this.value !== 0);
		}

	});

	forman.register({ type: 'tags',
		defaults: { elType: 'text' },
		setup: function() {
			this.$el = this.self.find('input');
			this.$el.off();
			if(this.onchange !== undefined){ this.$el.on('input',this.onchange);}
			this.$el.on('input', $.proxy(function(){this.trigger('change');}, this));
			if($.fn.tagsInput){
				this.$el.tagsInput();
			}
		},
		setValue: function(value) {
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			this.$el.importTags(value);
			return this.$el.val(value);
	}
	});
