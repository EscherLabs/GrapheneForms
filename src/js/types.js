gform.types = {
  'input':{
      base:'input',
      defaults:{},
      setup:function(){
          gform.types[this.type].setLabel.call(this)
      },
      setLabel:function(){
        if(!this.item.label){
            var label = gform.renderString((this.format||{title:null}).title||this.item.title|| this.item.label||this.label, this);
            if(this.required){
                label+=this.requiredText+this.suffix;
            }
            var labelEl = this.el.querySelector('label');
            if(labelEl !== null){
                labelEl.innerHTML = label
            }
        }
      },
      create: function(){
          var tempEl = document.createElement("span");
          tempEl.setAttribute("id", this.id);
          gform.addClass(tempEl,gform.columnClasses[this.columns])
          gform.addClass(tempEl,gform.offsetClasses[this.offset])
          gform.toggleClass(tempEl,'gform_isArray',!!this.array)

        //   if(this.owner.options.clear){
            // tempEl.setAttribute("class", gform.columnClasses[this.columns]+' '+gform.offsetClasses[this.offset]);
        //   }
          tempEl.innerHTML = this.render();
          return tempEl;
      },
      render: function(){
        //   return gform.render(this.type, this);
          return gform.render(this.type, this).split('value=""').join('value="'+_.escape(this.value)+'"')

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
                var text = (this.value+"").length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }
            //   this.update({value:this.get()},true);
            //   gform.types[this.type].focus.call(this)
                gform.types[this.type].setup.call(this);
              this.parent.trigger(['change'], this,{input:this.value});
              if(input){
                this.parent.trigger(['input'], this,{input:this.value});
              }
          }.bind(this)
          this.input = this.input || false;
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

          this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
      },
      update: function(item, silent) {
        var oldDiv = this.el;

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
            _.extend(this, item);
            this.item = _.extend(this.item, item);
        }
        //should be able to remove the or and just use this.item.label
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        // var oldDiv = document.getElementById(this.id);
        // debugger;
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        this.destroy();
        this.el = gform.types[this.type].create.call(this);
        oldDiv.parentNode.replaceChild(this.el,oldDiv);
        gform.types[this.type].initialize.call(this);
        this.el.style.display = this.visible ? "block" : "none";
        gform.types[this.type].edit.call(this,this.editable);

        if(!silent) {
            this.parent.trigger(['change'], this);
        }
        if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
        
      },
      get: function() {
          return this.el.querySelector('input[name="' + this.name + '"]').value;
      },
      set: function(value) {
          this.el.querySelector('input[name="' + this.name + '"]').value = value;
      },
      toString: function(name,display){
          if(!display){
            return '<dt>'+this.label+'</dt> <dd>'+(this.value||'(empty)')+'</dd><hr>'
          }else{
              return this.value
          }
      },
      satisfied: function(value) {
          value = value||this.value;
          return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'number' && isNaN(value)));            
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

      base:'bool',
      defaults:{options:[false, true]},
      render: function() {
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(!this.strict && this.options[0]==false && this.options[1]==true){
            this.value = (!!this.value);
        }

        if(typeof this.mapOptions == 'undefined'){

          this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
          this.mapOptions.on('change',function(){
              this.options = this.mapOptions.getoptions()
              this.update();
          }.bind(this))
        }
        this.options = this.mapOptions.getoptions()

        //   this.selected = (this.value == this.options[1].value);
          return gform.render(this.type, this);

      },
      initialize: function(){
          this.onchangeEvent = function(input){
              this.value = this.get();
              (_.find(this.options,{selected:true})||{selected:null}).selected = false;
              (_.find(this.options,{value:this.value})||this.options[0]||{value:""}).selected = true;
              gform.types[this.type].setup.call(this);

              this.parent.trigger(['change','input'], this,{input:this.value});
          }.bind(this)
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
          this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
      },
      set: function(value) {
        //   this.selected = (value == this.options[1].value);
          this.el.querySelector('input[name="' + this.name + '"]').checked = (value == this.options[1].value);
      },
      get: function() {
          return this.options[this.el.querySelector('input[name="' + this.name + '"]').checked?1:0].value
      },satisfied: function(value) {

        value = value||this.value;
        return value == this.options[1].value;
      }
  },
  'collection':{

    base:'collection',
      defaults:{format:{label: '{{{label}}}',  value: function(item){
          if(item.value !== 'undefined'){
            return item.value;
          }else{
            return (item.label || item.index).toLowerCase().split(' ').join('_');
          }
	}}},
      toString: function(name,display){
        if(!display){
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        if(typeof lookup !== 'undefined'){
                            returnVal+='<dd>'+lookup.label+'</dd>'                        
                        }
                        return returnVal;
                    }.bind(this),'<dt>'+this.label+'</dt> ')+'<hr>'
                }else{
                    return '<dt>'+this.label+'</dt> <dd>(no selection)</dd><hr>';
                }
            }else{
                return '<dt>'+this.label+'</dt> <dd>'+((_.find(this.list,{value:this.value})||{label:""}).label||'(no selection)')+'</dd><hr>';
            }
        }else{
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        returnVal.push(lookup.label)
                        return returnVal;
                    }.bind(this),[])+'<hr>'
                }else{
                    return '';
                }
            }else{
                return (_.find(this.list,{value:this.value})||{label:""}).label;
            } 
        }
      },
      render: function() {
        if(typeof this.mapOptions == 'undefined'){
            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            this.mapOptions.on('change', function(){
                this.options = this.mapOptions.getobject()
                this.list = this.mapOptions.getoptions();
                this.update();
            }.bind(this))
            }
            this.options = this.mapOptions.getobject();
            this.list = this.mapOptions.getoptions();
            


            var search = _.find(this.list,{value:this.value});
            if(typeof search == 'undefined'){
                if(this.other||false){
                    this.value = 'other';
                }else{
                    this.value = (this.list[0]||{value:""}).value
                }
            }
            if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                this.options.push({label:"Other", value:'other',})
            }

            (_.find(this.list,{selected:true})||{selected:null}).selected = false;
            (_.find(this.list,{value:this.value})||{value:""}).selected = true;
            return gform.render(this.type, this);        
      },
      setup:function(){

        if(this.multiple && typeof this.limit !== 'undefinded'){
            if(this.get().length >= this.limit){
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
            if(this.el.querySelector('.count') != null){
                var text = this.get().length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }
          }
          gform.types[this.type].setLabel.call(this)
      },
      initialize: function() {       
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value =  this.get();

              (_.find(this.list,{selected:true})||{selected:null}).selected = false;
              (_.find(this.list,{value:this.value})||{selected:null}).selected = true;

              if(this.el.querySelector('.count') != null){
                var text = this.value.length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }

              gform.types[this.type].setup.call(this);
              this.parent.trigger(['change','input'], this,{input:this.value});

          }.bind(this));

          gform.types[this.type].set.call(this,this.value);
      },
      get: function() {
          var value = this.el.querySelector('select').value;
          search = _.find(this.list,{i:parseInt(value,10)});
          if(typeof search == 'undefined'){
            if(this.other){
                value = "other";
            }else{
                value = null;
            }
          }else{
            value = search.value;
          }
          
         
          if(this.multiple){
            var that = this;
            value = _.transform(this.el.querySelector('select').options,function(orig,opt){
                if(opt.selected){
                    var option = _.find(that.list,{index:parseInt(opt.value)});
                    if(typeof option !== 'undefined'){
                        orig.push(option.value)
                    }
                }
            },[])
          }
        //   this.option = _.find()
          return value;
      },
      set: function(value) {

        //   _.each(this.options.options, function(option, index){
        //       if(option.value == value || parseInt(option.value) == parseInt(value)) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
        //   }.bind(this))
        if(this.multiple){
            if(!_.isArray(value)){
                value = [value]
            }
          if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
          _.each(this.el.querySelector('select').options, function(option){
             option.selected = (value.indexOf(option.value)>=0)
          }.bind(this))
        }else{
            var search = _.find(this.list,{value:value});
            if(typeof search !== 'undefined'){
                this.el.querySelector('select').value = search.i;
            }else{
                this.el.querySelector('select').value = null;
            }
        }
        if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
      },
      focus:function() {

        var search = this.name;
        if(this.multiple){search+='[]'}
          this.el.querySelector('[name="'+search+'"]').focus();
      },edit: function(state) {
        var search = this.name;
        if(this.multiple){search+='[]'}
        this.el.querySelector('[name="'+search+'"]').disabled = !state;            
      }
  },
  'section':{

    base:'section',
    filter: function(search){
        return gform.filter.call(this,search);
    },
    setLabel:function(){
        if(!!this.item.label){
            var label = gform.renderString(this.item.label||this.label, this);
            if(this.required){
                label+=this.requiredText+this.suffix;
            }
            var labelEl = this.el.querySelector('fieldset#'+this.id+'>legend')
            if(labelEl !== null){
                labelEl.innerHTML = label
            }
        }
      },
      create: function() {
          var tempEl = document.createRange().createContextualFragment(this.render()).firstElementChild;
          gform.addClass(tempEl,gform.columnClasses[this.columns])
          gform.addClass(tempEl,gform.offsetClasses[this.offset])
          gform.toggleClass(tempEl,'gform_isArray',!!this.array)

          return tempEl;
      },
      initialize: function() {
          //handle rows
          this.rows = [];
      },        
      render: function() {
          if(this.section){
              return gform.render(this.owner.options.sections+'_fieldset', this);                
          }else{
              return gform.render('_fieldset', this);                
          }
      },      
      update: function(item, silent) {

        if(typeof item === 'object') {
            _.extend(this.item,item);
        }
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        // var oldDiv = document.getElementById(this.id);
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
          this.el.style.display = this.visible ? "block" : "none";
          gform.types[this.type].edit.call(this,this.editable);

          this.container =  this.el.querySelector('fieldset')|| this.el || null;
          this.reflow();
          if(!silent) {
            //   this.parent.trigger('change:'+this.name, this);
            //   this.parent.trigger('change', this);
              this.parent.trigger(['change'], this);
          }
        },
      get: function(name) {
          return gform.toJSON.call(this, name)
      },
      toString: function(name, display) {
          if(!display){
            return '<h4>'+this.label+'</h4><hr><dl style="margin-left:10px">'+gform.toString.call(this, name)+'</dl>';
          }else{
            return gform.toString.call(this, name,display);
          }
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
          if(typeof this.fields !== 'undefined' && this.fields.length){
            gform.types[this.fields[0].type].focus.call(this.fields[0]);
          }
      },
      satisfied: function(value) {
          value = value||this.get();
          return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'object' && _.isEmpty(value)));            
      },
      trigger: function(a,b,c){
        // if(typeof a == 'string' && typeof b == 'object') {
        //     this.parent.dispatch(a+b.name,b,c);
        //     this.parent.dispatch(a,b,c);
        // }else{
        //     this.dispatch(a,b,c);
        // }
        if(typeof a == 'string'){ 
            a = [a];
        }
        var events = _.extend([],a);

        _.each(a, function(item){
            if(item.indexOf(':') == '-1'){
                events.unshift(item+':'+this.name)
            }
        }.bind(this))
        // a.unshift(a+':'+this.name)
        this.parent.trigger(_.uniq(events),b,c);

      }
  },
  'button':{
    base:'button',
    toString: function(){return ''},
      defaults:{parse:false, columns:2, target:".gform-footer"},
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
                  this.parent.trigger(this.action, this);
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
        //   this.label = gform.renderString(this.item.label, this);
        this.label = gform.renderString((item||{}).label||this.item.label, this);

        //   var oldDiv = document.getElementById(this.id);
        //   var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
          this.el.style.display = this.visible ? "block" : "none";
          gform.types[this.type].edit.call(this,this.editable);


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
          this.editable = state;
          this.el.disabled = !state;
          gform.toggleClass(this.el,'disabled',!state)

      },
      focus:function() {
        this.el.focus();
      }
  }
};

// remove the added classes
gform.types['text'] = gform.types['password'] = gform.types['color'] = gform.types['input'];
gform.types['number']= _.extend({}, gform.types['input'],{get:function(){
    return parseInt(this.el.querySelector('input[name="' + this.name + '"]').value,10);
}, render: function(){
    return gform.render(this.type, this).split('value=""').join('value="'+this.value+'"')
},});
gform.types['hidden']   = _.extend({}, gform.types['input'], {defaults:{columns:false},toString: function(){return ''}});
gform.types['output']   = _.extend({}, gform.types['input'], {
    toString: function(){return ''},
    render: function(){
        this.display = gform.renderString((this.format|| {}).value||'{{{value}}}', this);
        return gform.render(this.type, this);
    },
    get: function() {
        return this.value;
    },
    set: function(value) {
        this.value = value;
        this.display = gform.renderString((this.format|| {}).value||'{{{value}}}', this);
        // gform.renderString(this.template, this);
        this.el.querySelector('output').innerHTML = this.display;

    },
});

gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{validate: [{ type:'valid_email' }]}});

gform.types['textarea'] = _.extend({}, gform.types['input'], {
      set: function(value) {
          this.el.querySelector('textarea[name="' + this.name + '"]').value = value;
      },
      get: function() {
          return this.el.querySelector('textarea[name="' + this.name + '"]').value;
      }
  });
gform.types['switch'] = gform.types['checkbox'] = _.extend({}, gform.types['input'], gform.types['bool']);
gform.types['fieldset'] = _.extend({}, gform.types['input'], gform.types['section']);
gform.types['select']   = _.extend({}, gform.types['input'], gform.types['collection'],{
    render: function() {
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){
          this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
          this.mapOptions.on('change', function(){
              this.options = this.mapOptions.getobject()
              this.list = this.mapOptions.getoptions()

              if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                this.options.push({label:"Other", value:'other'})
                this.list.push({label:"Other", value:'other'})
                }
        
                if(typeof this.placeholder == 'string'){
                    // this.value = this.value || -1
                    this.options.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
                    this.list.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
                }

              this.update();
          }.bind(this))
        }
        this.options = this.mapOptions.getobject();
        this.list = this.mapOptions.getoptions()

        var search = _.find(this.list,{value:this.value});
        if(typeof search == 'undefined'){
            if(this.other||false){
                this.value = 'other';
            }else{
                if(typeof this.placeholder == 'string'){
                    this.value = '';
                }else{
                    this.value = (this.list[0]||{value:""}).value
                }
            }
        }
        
        if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
            this.options.push({label:"Other", value:'other'})
            this.list.push({label:"Other", value:'other'})
        }

        if(typeof this.placeholder == 'string'){
            // this.value = this.value || -1
            this.options.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
            this.list.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
        }

        (_.find(this.list,{selected:true})||{selected:null}).selected = false;
        (_.find(this.list,{value:this.value})||{value:""}).selected = true;
        return gform.render(this.type, this);
    }
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
        if(this.get().length>= this.limit){
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
        if(this.el.querySelector('.count') != null){
          var text = this.get().length;
          if(this.limit>1){text+='/'+this.limit;}
          this.el.querySelector('.count').innerHTML = text;
        }
    }
    
        // if(this.other){
        //     this.el.querySelector('input').style.display = (this.value == 'other')?"inline-block":"none";
        // }

        gform.types[this.type].setLabel.call(this)
    },      
    render: function() {
        if(typeof this.mapOptions == 'undefined'){
            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            this.mapOptions.on('change', function(){
                this.options = this.mapOptions.getoptions()
                this.list = this.mapOptions.getoptions()
                this.update();
            }.bind(this))
            }
            this.options = this.mapOptions.getoptions();
            this.list = this.mapOptions.getoptions()
    
            var search = _.find(this.list,{value:this.value});
            if(typeof search == 'undefined'){
                if(this.other||false){
                    this.value = 'other';
                }else{
                    this.value = ""
                }
            }
            if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                this.options.push({label:"Other", value:'other',})
            }

            (_.find(this.list,{selected:true})||{selected:null}).selected = false;
            (_.find(this.list,{value:this.value})||{value:""}).selected = true;
            return gform.render(this.type, this);        
      },
  get: function(){

      if(this.multiple){

        var that = this;
          return _.transform(this.el.querySelectorAll('[type="checkbox"]:checked'),function(value,item){
            //   debugger;
              value.push(_.find(that.list,{i:parseInt(item.value)}).value).bind
            },[])
      }else{
        return (_.find(this.list,{i:parseInt((this.el.querySelector('[type="radio"]:checked')||{value:null}).value)}) ||{value:''}).value;
        // return (this.el.querySelector('[type="radio"]:checked')||{value:''}).value; 
      }
  },
  set:function(value){
    if(this.multiple){
        if(!_.isArray(value)){
          value = [value]
        }
        if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
        _.each(this.el.querySelectorAll('[type=checkbox]'), function(option){
           option.checked = (value.indexOf(option.value)>=0)
        }.bind(this))
      
      }else{
        var index = (_.find(this.list,{value:value})||{i:''}).i
        var el = this.el.querySelector('[value="'+index+'"]');
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
  },	
  focus: function(){
    this.el.querySelector('[type="radio"],[type="checkbox"]').focus();
  }
});

gform.types['scale']    = _.extend({}, gform.types['radio']);
gform.types['checkboxes']    = _.extend({}, gform.types['radio'],{multiple:true});
gform.types['grid'] = _.extend({}, gform.types['input'], gform.types['section'], gform.types['collection'],{
    render: function() {
        // this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){

            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            this.mapOptions.on('change',function(){
                this.options = this.mapOptions.getobject()
                this.list = this.mapOptions.getoptions()
                this.update();
            }.bind(this))
        }
        this.options = this.mapOptions.getobject()
        this.list = this.mapOptions.getoptions()

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
              this.parent.trigger(['change','input'], this,{input:this.value});

          }.bind(this));
          gform.types[this.type].setup.call(this);
          this.rows = [];
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
