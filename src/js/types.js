gform.types = {
  'input':{
      defaults:{},
      create: function(){
          var tempEl = document.createElement("span");
          tempEl.setAttribute("id", this.id);
          tempEl.setAttribute("class", ''+gform.columnClasses[this.columns]);
          tempEl.innerHTML = this.render();
          return tempEl;
      },
      render: function(){
          return gform.render(this.type, this);
      },
      destroy:function(){
        //   this.el.removeEventListener('change',this.onchangeEvent );		
        //   this.el.removeEventListener('change',this.onchange );		
          this.el.removeEventListener('input', this.onchangeEvent);
      },
      initialize: function(){
        //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.onchangeEvent = function(){
              this.value = this.get();

            //   this.update({value:this.get()},true);
            //   gform.types[this.type].focus.call(this)
              this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

            //   this.owner.pub('change:'+this.name, this,{input:this.value});
            //   this.owner.pub('change', this,{input:this.value});
            //   this.owner.pub('input:'+this.name, this,{input:this.value});
            //   this.owner.pub('input', this,{input:this.value});
          }.bind(this)
        //   this.el.addEventListener('change',this.onchangeEvent);		
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
      },
      update: function(item, silent) {
        if(typeof item === 'object') {
            _.extend(this, this.item, item);
        }
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        var oldDiv = document.getElementById(this.id);

        this.destroy();
        this.el = gform.types[this.type].create.call(this);
        oldDiv.parentNode.replaceChild(this.el,oldDiv);
        gform.types[this.type].initialize.call(this);

        if(!silent) {
            this.owner.pub(['change:'+this.name,'change'], this);
            // this.owner.pub('change', this);
        }
        
      },
      get: function() {
          return this.el.querySelector('input[name="' + this.name + '"]').value;
      },
      set: function(value) {
          this.el.querySelector('input[name="' + this.name + '"]').value = value;
      },
      satisfied: function(value) {
          return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '');            
      },
      enable: function(state) {
          this.el.querySelector('[name="'+this.name+'"]').disabled = !state;            
      },find:function() {
          return this;
      },
      focus:function() {
        //   debugger;
          this.el.querySelector('[name="'+this.name+'"]').focus();
        //   this.el.querySelector('[name="'+this.name+'"]').focus();
          var temp = this.value;
          this.set('');
          this.set(temp);
        //   this.el.querySelector('[name="'+this.name+'"]').select();
      }
      //display
  },
//   'textarea':,
  'bool':{
      defaults:{options:[false, true],format:{label:''}},
      render: function() {
          this.options = gform.options.call(this,this, this.value);
          this.selected = (this.value == this.options[1].value);
          return gform.render(this.type, this);
      },
      set: function(value) {
          this.selected = (value == this.options[1].value);
          this.el.querySelector('input[name="' + this.name + '"]').checked = this.selected;
      },
      get: function() {
          return this.options[this.el.querySelector('input[name="' + this.name + '"]').checked?1:0].value
      }
  },
  'collection':{
      defaults:{format:{label: '{{label}}', value: '{{value}}'}},
      render: function() {
          this.options = gform.options.call(this,this, this.value);
          return gform.render(this.type, this);
      },
      initialize: function() {
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value = this.get();
              this.label = gform.renderString(this.item.label, this);
              this.el.querySelector('label').innerHTML = this.label

            //   debugger;
            //   this.update({value:this.get()},true);
            //   gform.types[this.type].focus.call(this)

            //   this.focus();
            //   this.owner.pub('change:'+this.name, this,{input:this.value});
            //   this.owner.pub('change', this, {input:this.value});
            //   this.owner.pub('input:'+this.name, this,{input:this.value});
            //   this.owner.pub('input', this,{input:this.value});
            this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

          }.bind(this));
      },
      get: function() {
          var value = this.el.querySelector('select').value;
          if(this.multiple){
            value = _.transform(this.el.querySelector('select').options,function(orig,opt){if(opt.selected){orig.push(opt.value)}},[])
          }
        //   this.option = _.find()
          return value;
      },
      set: function(value) {
          this.el.querySelector('select').value = value;
        //   _.each(this.options.options, function(option, index){
        //       if(option.value == value || parseInt(option.value) == parseInt(value)) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
        //   }.bind(this))
        if(this.multiple && _.isArray(this.value)){
          _.each(this.el.querySelector('select').options, function(option, index){
             option.selected = (this.value.indexOf(option.value)>=0)
          }.bind(this))
        }
      },
      focus:function() {
        //   debugger;
          this.el.querySelector('[name="'+this.name+'"]').focus();
        //   this.el.querySelector('[name="'+this.name+'"]').focus();
        //   var temp = this.value;
        //   this.set('');
        //   this.set(temp);
        //   this.el.querySelector('[name="'+this.name+'"]').select();
      }
  },
  'section':{
      create: function() {
          var tempEl = document.createRange().createContextualFragment(this.render()).firstElementChild;
          gform.addClass(tempEl,gform.columnClasses[this.columns])
          return tempEl;
      },
      initialize: function() {
          //handle rows
          this.rows = {};
      },        
      render: function() {
          // if(this.section){
              return gform.render(this.owner.options.sections+'_fieldset', this);                
          // }else{
              // return gform.render('_fieldset', this);                
          // }
      },      
      update: function(item, silent) {

        if(typeof item === 'object') {
            _.extend(this.item,item);
        }
        this.label = gform.renderString(({}||item).label||this.item.label, this);

        var oldDiv = document.getElementById(this.id);

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
          this.container =  this.el.querySelector('fieldset')|| this.el || null;
          this.reflow();
          if(!silent) {
            //   this.owner.pub('change:'+this.name, this);
            //   this.owner.pub('change', this);
              this.owner.pub(['change:'+this.name,'change'], this);
          }
        },
      get: function(name) {
          return gform.toJSON.call(this, name)
      },
      set: function(value){
        _.each(value,function(item,index){
            var temp = this.find(index);
            if(typeof temp !== 'undefined'){
                temp.set(item);
            }
        }.bind(this))
        
      },
      find: function(name) {
          return gform.find.call(this, name)
      },
      reflow: function() {
          gform.reflow.call(this)
      },
      focus:function() {
          gform.types[this.fields[0].type].focus.call(this.fields[0]);
      }
  },
  'button':{
      defaults:{parsable:false, columns:2, target:".footer"},
      create: function() {
          var tempEl = document.createRange().createContextualFragment(this.render()).firstElementChild;
          tempEl.setAttribute("id", this.id);
          // tempEl.setAttribute("class", tempEl.className+' '+gform.columnClasses[this.columns]);
          return tempEl;
      },
      initialize: function() {
          this.action = this.action || (this.label||'').toLowerCase().split(' ').join('_'), 
          this.onclickEvent = function(){
              if(this.enabled) {
                  this.owner.pub(this.action, this);
              }
          }.bind(this)
          this.el.addEventListener('click',this.onclickEvent );	
      },        
      render: function() {
          return gform.render('button', this);
      },
      satisfied: function(value) {
          return this.enabled && this.visible;
      },
      update: function(item, silent) {
          
          if(typeof item === 'object') {
              _.extend(this, this.item, item);
          }
          this.label = gform.renderString(this.item.label, this);

          var oldDiv = document.getElementById(this.id);

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
      },        
      destroy:function() {		
          this.el.removeEventListener('click', this.onclickEvent);
      },
      get: function(name) {
          return null
      },
      set: function(value) {
      },
      enable: function(state) {
          this.el.disabled = !state;
      }
  }
};
gform.render = function(template, options) {
  return gform.m(gform.stencils[template || 'text'] || gform.stencils['text'], _.extend({}, gform.stencils, options))
}
gform.create = function(text) {
 return document.createRange().createContextualFragment(text).firstElementChild;
}
gform.renderString = function(string,options) {
  return gform.m(string || '', options || {})
}


// add some classes. Eg. 'nav' and 'nav header'
gform.addClass = function(elem, classes) {
  elem.className = _.chain(elem.className).split(/[\s]+/).union(classes.split(' ')).join(' ').value();
  // return elem;
};
gform.removeClass = function(elem, classes){
  elem.className = _.chain(elem.className).split(/[\s]+/).difference(classes.split(' ')).join(' ').value();
  // return elem
};

// remove the added classes
gform.types['text']     = gform.types['password'] = gform.types['number'] = gform.types['color'] = gform.types['input'];
gform.types['hidden']   = _.extend({}, gform.types['input'], {defaults:{columns:false}});
gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{validate: { 'valid_email': true }}});

gform.types['textarea'] = _.extend({}, gform.types['input'], {
      set: function(value) {
          this.el.querySelector('textarea[name="' + this.name + '"]').innerHTML = value;
      },
      get: function() {
          return this.el.querySelector('textarea[name="' + this.name + '"]').value;
      }
  });
gform.types['switch'] = gform.types['checkbox'] = _.extend({}, gform.types['input'], gform.types['bool'],{default:{format:{label:""}}});
gform.types['fieldset'] = _.extend({}, gform.types['input'], gform.types['section']);
gform.types['select']   = _.extend({}, gform.types['input'], gform.types['collection']);
gform.types['range']   = _.extend({}, gform.types['input'], gform.types['collection'],{
    get: function(){
      return (this.el.querySelector('[type=range]')||{value:''}).value; 
  },
  set:function(value){
      this.el.querySelector('[type=range]').value = value;   
  }
});
gform.types['radio'] = _.extend({}, gform.types['input'], gform.types['collection'], {
    get: function(){
      return (this.el.querySelector('[type="radio"][name="' + this.name + '"]:checked')||{value:''}).value; 
  },
  set:function(value){
      var el = this.el.querySelector('[value="'+value+'"]');
      if(el !== null){
          el.checked = 'checked';
      }
  },
  enable: function(state) {
      _.each(this.el.querySelectorAll('[name="'+this.name+'"]'),function(item){
          item.disabled = !state;            
      })
  }
});


gform.types['scale']    = _.extend({}, gform.types['radio'], {

});
// gform.types['checkboxes']    = _.extend({}, gform.types['input'], gform.types['collection'], {
//    multiple on radio
// });
// gform.types['checkbox_grid']    = _.extend({}, gform.types['input'], gform.types['collection'], {
// grid multiple
// });
// gform.types['radio_grid']    = _.extend({}, gform.types['input'], gform.types['collection'], {
//  grid
// });














// Berry.register({ type: 'scale',
// 	create: function() {
// 	   // this.options = [];
// 	    this.item.choices = [];
// 		this.options = Berry.processOpts.call(this.owner, this.item, this).options;
// 		debugger;
// 		return Berry.render('berry_' + (this.elType || this.type), this);
// 	},
// 	setup: function() {
// 		this.$el = this.self.find('[type=radio]');
// 		this.$el.off();
// 		if(this.onchange !== undefined) {
// 			this.on('change', this.onchange);
// 		}
// 		this.$el.change($.proxy(function(){this.trigger('change');}, this));
// 	},
// 	getValue: function() {
// 		var selected = this.self.find('[type="radio"]:checked').data('label');
// 		for(var i in this.item.options) {
// 			if(this.item.options[i].label == selected) {
// 				return this.item.options[i].value;
// 			}
// 		}
// 	},
// 	setValue: function(value) {
// 		this.value = value;
// 		this.self.find('[value="' + this.value + '"]').prop('checked', true);
// 	},
// 	displayAs: function() {
// 		for(var i in this.item.options) {
// 			if(this.item.options[i].value == this.lastSaved) {
// 				return this.item.options[i].label;
// 			}
// 		}
// 	},
// 	focus: function(){
// 		this.self.find('[type="radio"]:checked').focus();
// 	}
// });



// b.register({type: 'date' ,
// setValue: function(value) {		
//     if(typeof value !== 'object'){
//         if(typeof moment !== 'undefined'){value = moment.utc(value).format('YYYY-MM-DD');}
//         if(typeof this.lastSaved === 'undefined'){
//             this.lastSaved = value;
//         }
//         this.value = value;
//         return this.$el.val(value);
//     }
//     return this.value;
// }
// });



// gform.types['upload'] =       {
// 		defaults: {autosize: true, advanced: false},
// create: function() {
//     var tempEl = document.createRange().createContextualFragment(this.render()).firstElementChild;
//     gform.addClass(tempEl,gform.columnClasses[this.columns])
//     return tempEl;
// },
// initialize: function() {
//     //handle rows
//     this.rows = {};
// },        
// render: function() {
//     // if(this.section){
//         return gform.render(this.owner.options.sections+'_fieldset', this);                
//     // }else{
//         // return gform.render('_fieldset', this);                
//     // }
// },
// get: function(name) {
//     return gform.toJSON.call(this, name)
// },
// find: function(name) {
//     return gform.find.call(this, name)
// },
// reflow: function() {
//     gform.reflow.call(this)
// },
// focus:function() {
//     gform.types[this.fields[0].type].focus.call(this.fields[0]);
// }

// (function(b, $){
// 	b.register({
// 		type: 'upload',
// 		defaults: {autosize: true, advanced: false},
// 		setup: function() {
// 			this.$el = this.self.find('form input');
// 			this.$el.off();
// 			if(this.onchange !== undefined) {
// 				this.$el.on('input', this.onchange);
// 			}
// 			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));
// 			this.myDropzone = new Dropzone('#' + this.name, { method: 'post', paramName: this.name, success: $.proxy(function(message,response){
// 				//contentManager.currentView.model.set(this.name, response[this.name]);
// 				//myDropzone.removeAllFiles();

// 				//this.setValue(response[this.name]);
// 				this.setValue(response);
// 				this.trigger('uploaded');
// 			}, this)});
// 			// myDropzone.on("complete", function(file) {
// 			// 	myDropzone.removeFile(file);
// 			// });
// 		},
// 		getValue: function() {
// 		 return this.value; 
// 		},
// 		setValue: function(value){
// 			if(typeof this.lastSaved === 'undefined'){
// 				this.lastSaved = value;
// 			}
// 			this.value = value;
// 			return this.$el;
// 		},
// 		update: function(item, silent) {
// 			if(typeof item === 'object') {
// 				$.extend(this.item, item);
// 			}
// 			$.extend(this, this.item);
// 			this.setValue(this.value);
// 			this.myDropzone.destroy();
// 			this.render();
// 			this.setup();
// 			if(!silent) {
// 				this.trigger('change');
// 			}
// 		},
// 		render: function() {
// 			if(typeof this.self === 'undefined') {
// 				this.self = $(this.create()).attr('data-Berry', this.owner.options.name);
// 			} else {
// 				this.self.find('div:first').replaceWith($(this.create()).html())
// 			}
// 			this.display = this.getDisplay();
// 			return this.self;
// 		}
// 	});
// })(Berry,jQuery);




// Berry.register({ type: 'radio_collection',
// 	acceptObject: true,
// 	create: function() {
// 		this.options = Berry.processOpts.call(this.owner, this.item, this).options;
// 		return Berry.render('berry_' + (this.elType || this.type), this);
// 	},
// 	setup: function() {
// 		this.$el = this.self.find('[type=radio]');
// 		this.$el.off();
// 		if(this.onchange !== undefined) {
// 			this.on('change', this.onchange);
// 		}
// 		this.$el.change($.proxy(function(){this.trigger('change');}, this));
// 	},
// 	getValue: function() {
// 		var values = {}
// 		for(var label in this.labels){
// 			var selected = this.self.find('[name="'+this.name+this.labels[label].name+'"][type="radio"]:checked').data('label');
// 			for(var i in this.item.options) {
// 				if(this.item.options[i].label == selected) {
// 					values[this.labels[label].name] = this.item.options[i].value;
// 					// return this.item.options[i].value;
// 				}
// 			}
// 		}
// 		return values;
// 	},
// 	setValue: function(value) {
// 		this.value = value;
// 		for(var i in this.labels){
// 			this.self.find('[name="'+this.name+this.labels[i].name+'"][value="' + this.value[this.labels[i].name] + '"]').prop('checked', true);
// 		}
// 	},
// 	// set: function(value){
// 	// 	if(this.value != value) {
// 	// 		//this.value = value;
// 	// 		this.setValue(value);
// 	// 		this.trigger('change');
// 	// 	}
// 	// },
// 	displayAs: function() {
// 		for(var i in this.item.options) {
// 			if(this.item.options[i].value == this.lastSaved) {
// 				return this.item.options[i].label;
// 			}
// 		}
// 	},
// 	focus: function(){
// 		this.self.find('[name='+this.labels[0].name+'][type="radio"]:checked').focus();
// 	}
// });

// Berry.register({ type: 'check_collection',
// 	defaults: {container: 'span', acceptObject: true},
// 	create: function() {
// 		this.options = Berry.processOpts.call(this.owner, this.item, this).options;

// 		this.checkStatus(this.value);
// 		return Berry.render('berry_check_collection', this);
// 	},
// 	checkStatus: function(value){
// 		if(value === true || value === "true" || value === 1 || value === "1" || value === "on" || value == this.truestate){
// 			this.value = true;
// 		}else{
// 			this.value = false;
// 		}
// 	},
// 	setup: function() {
// 		this.$el = this.self.find('[type=checkbox]');
// 		this.$el.off();
// 		if(this.onchange !== undefined) {
// 			this.on('change', this.onchange);
// 		}
// 		this.$el.change($.proxy(function(){this.trigger('change');},this));
// 	},
// 	getValue: function() {

// 		var values = [];
// 		for(var opt in this.options){
// 			if(this.self.find('[name="'+this.options[opt].value+'"][type="checkbox"]').is(':checked')){
// 				// values[this.options[opt].value] = (this.truestate || true);
// 				values.push(this.options[opt].value);
// 			}else{
// 				if(typeof this.falsestate !== 'undefined') {
// 					// values[this.options[opt].value] = this.falsestate;
// 				}else{
// 					// values[this.options[opt].value] = false;
// 				}
// 			}
			
// 		}
// 		return values;
// 	},
// 	setValue: function(value) {
// 		// this.checkStatus(value);
// 		// this.$el.prop('checked', this.value);
// 		// this.value = value;
// 		// debugger;
// 		this.value = value;
// 			this.self.find('[type="checkbox"]').prop('checked', false);
// 		for(var i in this.value){
// 			this.self.find('[name="'+this.value[i]+'"][type="checkbox"]').prop('checked', true);
// 		}
// 	},
// 	displayAs: function() {
// 		for(var i in this.item.options) {
// 			if(this.item.options[i].value == this.lastSaved) {
// 				return this.item.options[i].name;
// 			}
// 		}
// 	},
// 	focus: function(){
// 		//this.$el.focus();
// 		this.self.find('[type=checkbox]:first').focus();
// 	},
// 	satisfied: function(){
// 		return this.$el.is(':checked');
// 	},
// });
