gform.types['combo']    = _.extend({}, gform.types['input'], gform.types['collection'], {
    initialize: function() {
        // debugger;
        // if(this.inited){
         $('select[name="' + this.name + '"]').combobox(this.item);
        // }
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
  render: function() {
    this.options = gform.options.call(this,this, this.value);
    return gform.render('select', this);
  },
  get: function(){
      return (this.el.querySelector('[type="select"][name="' + this.name + '"]:checked')||{value:''}).value; 
  },
  set:function(value){
      this.el.querySelector('[value="'+value+'"]').checked = 'checked'   
  }
});

