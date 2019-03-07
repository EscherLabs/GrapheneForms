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
      defaults:{options:[false, true]},
      render: function() {
          this.selected = (this.value == this.options[1]);
          return gform.render(this.type, this);
      },
      set: function(value) {
          this.selected = (value == this.options[1]);
          this.el.querySelector('input[name="' + this.name + '"]').checked = this.selected;
      },
      get: function() {
          return this.options[this.el.querySelector('input[name="' + this.name + '"]').checked?1:0]
      }
  },
  'collection':{
      render: function() {
          this.options = gform.options.call(this,this, this.value);
          return gform.render(this.type, this);
      },
      initialize: function() {
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value = this.get();

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
        //   this.option = _.find()
          return value;
      },
      set: function(value) {
          this.el.querySelector('select').value = value;
          _.each(this.options.options, function(option, index){
              if(option.value == value || parseInt(option.value) == parseInt(value)) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
          }.bind(this))
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
gform.types['textarea'] = _.extend({}, gform.types['input'], {
      set: function(value) {
          this.el.querySelector('textarea[name="' + this.name + '"]').innerHTML = value;
      },
      get: function() {
          return this.el.querySelector('textarea[name="' + this.name + '"]').value;
      }
  });
gform.types['checkbox'] = _.extend({}, gform.types['input'], gform.types['bool']);
gform.types['fieldset'] = _.extend({}, gform.types['input'], gform.types['section']);
gform.types['select']   = _.extend({}, gform.types['input'], gform.types['collection']);
gform.types['range']   = _.extend({}, gform.types['input'], gform.types['collection'],{
    get: function(){
      return (this.el.querySelector('range')||{value:''}).value; 
  },
  set:function(value){
      this.el.querySelector('range').value = value;   
  }
});
gform.types['radio']    = _.extend({}, gform.types['input'], gform.types['collection'], {
    get: function(){
      return (this.el.querySelector('[type="radio"][name="' + this.name + '"]:checked')||{value:''}).value; 
  },
  set:function(value){
      this.el.querySelector('[value="'+value+'"]').checked = 'checked'   
  }
});

gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{validate: { 'valid_email': true }}});



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

gform.types['color'] = 
_.extend({}, gform.types['input'], {
defaults: {
			pre: '<i style="display: block;width:20px;height:20px;margin: 0 -5px;"></i>' ,
			type: 'text'
		},
      initialize: function(){
		this.onchangeEvent = function(){
			this.value = this.get();
			this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});
		}.bind(this)
		this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

		$(this.el.querySelector('input[name="' + this.name + '"]')).attr('type','text');
			this.el.querySelector('i').style.backgroundColor = this.get()

		$(this.el.querySelector('input[name="' + this.name + '"]')).colorpicker({format: 'hex'}).on('changeColor', function(ev){
			this.el.querySelector('i').style.backgroundColor = this.get()
			this.owner.pub('change',this);
		}.bind(this));

      },
  set:function(value){
      this.el.querySelector('range').value = value;   
  },
});
