gform.types = {
  'input':{
      defaults:{},
      setLabel:function(){
        this.label = gform.renderString(this.item.label||this.label, this);
        var labelEl = this.el.querySelector('label');
        if(labelEl !== null){
            labelEl.innerHTML = this.label
        }
      },
      create: function(){
          var tempEl = document.createElement("span");
          tempEl.setAttribute("id", this.id);
          if(this.owner.options.clear){
            tempEl.setAttribute("class", ''+gform.columnClasses[this.columns]);
          }
          tempEl.innerHTML = this.render();
          return tempEl;
      },
      render: function(){
          return gform.render(this.type, this);
      },
      destroy:function(){
          this.el.removeEventListener('change',this.onchangeEvent );		
        //   this.el.removeEventListener('change',this.onchange );		
          this.el.removeEventListener('input', this.onchangeEvent);
      },
      initialize: function(){
        //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.onchangeEvent = function(input){
            //   this.input = input;
              this.value = this.get();
              if(this.el.querySelector('.count') != null){
                var text = this.value.length;
                if(this.limit){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }
            //   this.update({value:this.get()},true);
            //   gform.types[this.type].focus.call(this)
              this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

            //   this.owner.pub('change:'+this.name, this,{input:this.value});
            //   this.owner.pub('change', this,{input:this.value});
            //   this.owner.pub('input:'+this.name, this,{input:this.value});
            //   this.owner.pub('input', this,{input:this.value});
          }.bind(this)
          this.input = this.input || false;
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

          this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
      },
      update: function(item, silent) {
        if(typeof item !== 'undefined' && (
            typeof item.options !== undefined ||
            typeof item.max !== undefined ||
            typeof item.action !== undefined 
            )
            && typeof this.mapOptions !== 'undefined'){
            delete this.mapOptions;
            this.item = _.defaults({},item,this.item);

            // this.item.options = _.assign([],this.item.options,item.options);
            this.options = _.extend([],this.item.options);
            this.max = this.item.max;
            this.min = this.item.min;
            this.path = this.item.path;
            this.action = this.item.action;
        }
        // else if(typeof this.mapOptions !== 'undefined'){
        //     debugger;
        // }
        if(typeof item === 'object') {
            _.extend(item,this);
        }
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        // var oldDiv = document.getElementById(this.id);
        // debugger;
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;
        this.destroy();
        this.el = gform.types[this.type].create.call(this);
        oldDiv.parentNode.replaceChild(this.el,oldDiv);
        gform.types[this.type].initialize.call(this);

        if(!silent) {
            this.owner.pub(['change:'+this.name,'change'], this);
        }
        if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
        
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
      edit: function(state) {
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
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){

          this.mapOptions = new gform.mapOptions(this, this.value)
          this.mapOptions.sub('change',function(){
              this.options = this.mapOptions.getobject()
              this.update();
          }.bind(this))
        }
        this.options = this.mapOptions.getobject()

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
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){

          this.mapOptions = new gform.mapOptions(this, this.value)
          this.mapOptions.sub('change',function(){
              this.options = this.mapOptions.getobject()
              this.update();
          }.bind(this))
        }
        this.options = this.mapOptions.getobject()

          return gform.render(this.type, this);
      },
      setup:function(){
        if(this.multiple && typeof this.limit !== 'undefinded'){
            if(this.value.length >= this.limit){
                this.maxSelected = true;
                _.each(this.el.querySelector('select').options,function(item){
                    item.disabled = !item.selected;
                })
            }else if (this.maxSelected) {
                this.maxSelected = false;
                _.each(this.el.querySelector('select').options,function(item){
                    item.disabled = false;
                })  
            }
          }
        //   if(this.other){
        //       this.el.querySelector('input').style.display = (this.value == 'other')?"inline-block":"none";
        //   }
          gform.types[this.type].setLabel.call(this)
      },
      initialize: function() {
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.input = true;
              this.value =  this.get();
              if(this.el.querySelector('.count') != null){
                var text = this.value.length;
                if(this.limit){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }

              gform.types[this.type].setup.call(this);
              this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

          }.bind(this));
          this.input = this.input || false;

          gform.types[this.type].setup.call(this);
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
        if(this.multiple && _.isArray(value)){
          if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
          _.each(this.el.querySelector('select').options, function(option){
             option.selected = (value.indexOf(option.value)>=0)
          }.bind(this))
        }
        if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
      },
      focus:function() {
          this.el.querySelector('[name="'+this.name+'"]').focus();
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

        // var oldDiv = document.getElementById(this.id);
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

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
        if(value == null || value == ''){
            gform.each.call(this, function(field) {
                field.set('');
            })
        }else{
            _.each(value,function(item,index){
                var temp = this.find(index);
                if(typeof temp !== 'undefined'){
                    temp.set(item);
                }
            }.bind(this))
        }
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
      defaults:{parsable:false, columns:2, target:".gform-footer"},
      create: function() {
          var tempEl = document.createRange().createContextualFragment(this.render()).firstElementChild;
          tempEl.setAttribute("id", this.id);
          // tempEl.setAttribute("class", tempEl.className+' '+gform.columnClasses[this.columns]);
          return tempEl;
      },
      initialize: function() {
          this.action = this.action || (this.label||'').toLowerCase().split(' ').join('_'), 
          this.onclickEvent = function(){
              if(this.editable) {
                  this.owner.pub(this.action, this);
              }
          }.bind(this)
          this.el.addEventListener('click',this.onclickEvent );	
      },        
      render: function() {
          return gform.render('button', this);
      },
      satisfied: function(value) {
          return this.editable && this.visible;
      },
      update: function(item, silent) {
          
          if(typeof item === 'object') {
              _.extend(this, this.item, item);
          }
          this.label = gform.renderString(this.item.label, this);

        //   var oldDiv = document.getElementById(this.id);
        //   var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

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
      edit: function(state) {
          this.el.disabled = !state;
      }
  }
};

// remove the added classes
gform.types['text']     = gform.types['password'] = gform.types['number'] = gform.types['color'] = gform.types['input'];
gform.types['hidden']   = _.extend({}, gform.types['input'], {defaults:{columns:false}});
gform.types['output']   = _.extend({}, gform.types['input'], {
    get: function(value) {
        return this.el.querySelector('output').innerHTML;
    },
    set: function(value) {
        this.value = gform.renderString(value, this);
        this.el.querySelector('output').innerHTML = thisvalue;

    },
});

gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{validate: [{ type:'valid_email' }]}});

gform.types['textarea'] = _.extend({}, gform.types['input'], {

    // initialize: function(){
    //       this.onchangeEvent = function(){
    //           this.value = this.get();
    //           if(this.el.querySelector('.count') != null){
    //               var text = this.value.length;
    //               if(this.limit){text+='/'+this.limit;}
    //             this.el.querySelector('.count').innerHTML = text;
    //           }
    //           this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});
    //       }.bind(this)
    //       this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
    //   },
      set: function(value) {
          this.el.querySelector('textarea[name="' + this.name + '"]').innerHTML = value;
      },
      get: function() {
          return this.el.querySelector('textarea[name="' + this.name + '"]').value;
      }
  });
gform.types['switch'] = gform.types['checkbox'] = _.extend({}, gform.types['input'], gform.types['bool'],{default:{format:{label:""}}});
gform.types['fieldset'] = _.extend({}, gform.types['input'], gform.types['section']);
gform.types['select']   = _.extend({}, gform.types['input'], gform.types['collection'],{
    render: function() {
        if(typeof this.mapOptions == 'undefined'){
            // debugger;
            this.mapOptions = new gform.mapOptions(this, this.value)
            this.mapOptions.sub('change', function(){
                // debugger;
                this.options = this.mapOptions.getobject();
                this.update();
            }.bind(this))
        }
        this.options = this.mapOptions.getobject()

        // this.options = gform.mapOptions.call(this,this, this.value);

  if(typeof this.placeholder == 'string'){
      this.options.unshift({label:this.placeholder, value:'',editable:false,visible:false,selected:true})
  }
        return gform.render(this.type, this);
    },
});
gform.types['range']   = _.extend({}, gform.types['input'], gform.types['collection'],{
    get: function(){
      return (this.el.querySelector('[type=range]')||{value:''}).value; 
  },
  set:function(value){
      this.el.querySelector('[type=range]').value = value;   
  }
});

gform.types['radio'] = _.extend({}, gform.types['input'], gform.types['collection'], {
  setup: function(){
    if(this.multiple && typeof this.limit !== 'undefinded'){
        if(this.value.length >= this.limit){
            this.maxSelected = true;
            _.each(this.el.querySelectorAll('[type=checkbox]'),function(item){
                item.disabled = !item.checked;
            })
        }else if (this.maxSelected) {
            this.maxSelected = false;
            _.each(this.el.querySelectorAll('[type=checkbox]'),function(item){
                item.disabled = false;
            })  
        }
        }
        // if(this.other){
        //     this.el.querySelector('input').style.display = (this.value == 'other')?"inline-block":"none";
        // }

        gform.types[this.type].setLabel.call(this)
    },
  get: function(){
      if(this.multiple){
          return _.transform(this.el.querySelectorAll('[type="checkbox"]:checked'),function(value,item){value.push(item.value)},[])
      }else{
        return (this.el.querySelector('[type="radio"]:checked')||{value:''}).value; 
      }
  },
  set:function(value){
    if(this.multiple && _.isArray(value)){
        if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
        _.each(this.el.querySelectorAll('[type=checkbox]'), function(option){
           option.checked = (value.indexOf(option.value)>=0)
        }.bind(this))
      }else{
        var el = this.el.querySelector('[value="'+value+'"]');
        if(el !== null){
            el.checked = 'checked';
        }
      }
      if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
  },
  edit: function(state) {
      _.each(this.el.querySelectorAll('input'),function(item){
          item.disabled = !state;            
      })
  }
});

gform.types['scale']    = _.extend({}, gform.types['radio']);
gform.types['checkboxes']    = _.extend({}, gform.types['radio'],{multiple:true});
gform.types['grid'] = _.extend({}, gform.types['input'], gform.types['collection'],{
    render: function() {
        // this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){

            this.mapOptions = new gform.mapOptions(this, this.value)
            this.mapOptions.sub('change',function(){
                this.options = this.mapOptions.getobject()
                this.update();
            }.bind(this))
        }
        this.options = this.mapOptions.getobject()

        this.fields = _.map(this.fields, function(field){
            return _.assignIn({
                name: (gform.renderString(field.label)||'').toLowerCase().split(' ').join('_'), 
                id: gform.getUID(), 
                label: field.name,     
            }, field)
    
        })

        return gform.render(this.type, this);
    },
    setup: function(){
        if(this.multiple && typeof this.limit !== 'undefinded'){
            _.each(this.fields,function(field){
                var value = this.value[field.name]||[];
                if(value.length >= this.limit){
                    field.maxSelected = true;
                    _.each(this.el.querySelectorAll('[type=checkbox][name="' + field.id + '"]'),function(item){
                        item.disabled = !item.checked;
                    })
                }else if (field.maxSelected) {
                    field.maxSelected = false;
                    _.each(this.el.querySelectorAll('[type=checkbox][name="' + field.id + '"]'),function(item){
                        item.disabled = false;
                    })  
                }
            }.bind(this))
        }

        gform.types[this.type].setLabel.call(this)
    },
    initialize: function() {
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value =  this.get();
              gform.types[this.type].setup.call(this);
              this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

          }.bind(this));
          gform.types[this.type].setup.call(this);
          this.rows = {};
          this.fields = _.map(this.fields,function(item){item.type='hidden';return item;})
      },
    get: function(){
        if(this.multiple){
            return _.transform(this.fields,function(result,field){
                result[field.name]= _.transform(this.el.querySelectorAll('[type="checkbox"][name="' + field.id + '"]:checked'),function(value,item){value.push(item.value)},[])
            }.bind(this),{})

        }else{
            return _.transform(this.fields,function(result,field){result[field.name]=(this.el.querySelector('[type="radio"][name="' + field.id + '"]:checked')||{value:''}).value}.bind(this),{})
        }
    },
    set:function(value){
        if(this.multiple){
            _.each(this.fields,function(value,field){
                if(typeof this.limit !== 'undefinded' && value != null && (value.length > this.limit)){return true}
                _.each(this.el.querySelectorAll('[name="' + field.id + '"][type=checkbox]'), function(value,option){
                option.checked = (value.indexOf(option.value)>=0)
                }.bind(this,value[field.name]))

            }.bind(this,value))
        }else{
            _.each(this.fields,function(field){
                var el = this.querySelector('[name="' + field.id + '"][value="'+value[field.name]+'"]');
                if(el !== null) {
                    el.checked = 'checked';
                }
            }.bind(this))
        }
        this.value = value;
        gform.types['grid'].setup.call(this)
    },
    focus:function() {
        // this.fields[0].name
        this.el.querySelector('[name="'+this.fields[0].id+'"]').focus();
    }
});


//tags
//upload
//base64
