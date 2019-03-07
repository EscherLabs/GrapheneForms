gform.stencils = {
	// _form:`<form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{^options.inline}} smart-form-horizontal form-horizontal{{/options.inline}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form>`,
    _container: `<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{^options.inline}} smart-form-horizontal form-horizontal{{/options.inline}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form><div class="footer row"></div>`,
    text: `<div class="row clearfix form-group {{modifiers}} {{#array}}dupable" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12">{{/inline}}
	{{^inline}}<div class="col-md-8">{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
		{{#pre}}<div class="input-group col-xs-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
		<input {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control" {{^enabled}}readonly{{/enabled}} {{#maxLength}}maxlength="{{maxLength}}"{{/maxLength}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{name}}" value="{{value}}" />
    {{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
hidden: `<input type="hidden" name="{{name}}" value="{{value}}" />{{>_addons}}`,
    textarea: `<div class="row clearfix form-group {{modifiers}} {{#array}}dupable" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{^inline}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}
		<textarea class="form-control"  {{^enabled}}readonly{{/enabled}} {{#maxLength}}maxlength="{{maxLength}}"{{/maxLength}} style="width:100%;height:auto;min-height:20px" rows="{{rows}}{{^rows}}3{{/rows}}" name="{{name}}" id="{{guid}}" placeholder="{{placeholder}}">{{content}}{{value}}</textarea>
			{{>_addons}}
			{{>_actions}}
	</div>
</div>`,
    select: `<div class="row clearfix form-group {{modifiers}} {{#array}}dupable" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12">{{/inline}}
	{{^inline}}<div class="col-md-8">{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
		{{#pre}}<div class="input-group"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
		{{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
			<select class="form-control"  name="{{name}}" {{^enabled}}readonly disabled="true"{{/enabled}}  {{#multiple_enable}}multiple{{/multiple_enable}} >
			{{#options}}

				{{^section}}
				<option {{#selected}}selected='selected'{{/selected}} {{^enabled}}disabled{{/enabled}} {{^visible}}hidden{{/visible}}  value="{{value}}">{{{label}}}</option>
				{{/section}}

				
				{{#section}}
				{{#section.label}}
				<optgroup label="{{label}}" data-id="{{section.id}} {{^enabled}}disabled{{/enabled}} {{^visible}}hidden{{/visible}}">
				{{/section.label}}
					{{#options}}
					<option data-id="{{section.id}}" {{#selected}}selected='selected'{{/selected}} {{^enabled}}disabled{{/enabled}} {{^visible}}hidden{{/visible}}  value="{{value}}">{{{label}}}</option>
					{{/options}}
					{{#section.label}}
				</optgroup>
				{{/section.label}}
				{{/section}}

			{{/options}}
			</select>
		{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
		{{^post}}{{#pre}}</div>{{/pre}}{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
select_options:`
{{>select_options}}

`,
    radio: `<div class="row clearfix form-group {{modifiers}} {{#array}}dupable" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12">{{/inline}}
	{{^inline}}<div class="col-md-8">{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
		{{#pre}}<div class="input-group"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
		{{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
			{{#options}}
			<div class="radio">
				<label {{#inline}}class="radio-inline"{{/inline}}>
					<input data-label="{{label}}" name="{{name}}" value="{{value}}" {{^enabled}}readonly{{/enabled}} type="radio" {{#selected}}checked=checked{{/selected}} >
					{{{label}}}{{^label}}&nbsp;{{/label}}
				</label>
			</div>
			{{/options}}
		{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
		{{^post}}{{#pre}}</div>{{/pre}}{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
    _fieldset: `<div class="row"><fieldset data-type="fieldset" name="{{name}}" id="{{id}}" class="{{modifiers}} col-md-12" >
{{#array}}
<div class="btn-group actions">
	<div data-id="{{id}}" class="gform-add btn btn-white"><i class="fa fa-plus text-success"></i></div><div data-id="{{id}}" class="btn btn-white gform-minus"><i class="fa fa-minus text-danger"></i></div>
</div>
{{/array}}
{{^hideLabel}}
{{#item.legend}}<legend>{{{item.legend}}}</legend>{{/item.legend}}
{{^item.legend}}
{{#item.label}}<legend>{{{item.label}}}</legend>{{/item.label}}
{{/item.legend}}
{{/hideLabel}}
<div style="position:relative;top:-20px">{{>_addons}}</div>
</fieldset></div>`,
	_actions: `{{#array}}
	<div class="btn-group actions pull-right">
	<div data-id="{{id}}" class="gform-add btn btn-white"><i data-id="{{id}}" class="gform-add fa fa-plus text-success"></i></div>
	<div data-id="{{id}}" class="btn btn-white gform-minus"><i data-id="{{id}}" class="gform-minus fa fa-minus text-danger"></i></div>
	</div>
	{{/array}}`,
    _label: `
    {{^hideLabel}}
	{{#label}}<label for="{{guid}}" {{#inline}}style="text-align:left"{{/inline}} class="control-label col-md-{{#inline}}12{{/inline}}{{^inline}}4{{/inline}}">
  {{{label}}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}{{suffix}}
</label>{{/label}}
{{/hideLabel}}
    `,
    _addons:`<span class="help-inline"> {{{help}}}</span>
<span class="font-xs text-danger" style="display:block;"></span>`,
    checkbox:`<div class="row clearfix {{modifiers}} {{#array}}dupable" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12" style="margin:0 0 5px">{{/inline}}
	{{^inline}}<div class="col-md-8" style="margin:0 0 15px">{{/inline}}
	{{/label}}
	{{^label}}
	{{#inline}}<div class="col-md-12" style="margin: -10px 0 5px;"">{{/inline}}
	{{^inline}}<div class="col-md-8" style="margin: -5px 0 10px">{{/inline}}
	{{/label}}
		<div class="checkbox">
			<label class="{{alt-display}}">
				<input name="{{name}}" type="checkbox" {{^enabled}}disabled{{/enabled}} {{#value}}checked=checked{{/value}}>{{#container}}<{{container}}  style="position:relative;display:inline-block;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;">{{{text}}}</{{container}}>{{/container}}
			</label>
		</div>
	{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
button:`<div class="btn btn-default {{modifiers}}" style="margin:0 15px">{{{label}}}</div>`,
    tab_container: `
<form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{^options.inline}} smart-form-horizontal form-horizontal{{/options.inline}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}    
	<ul class="nav nav-tabs" style="margin-bottom:15px">
		{{#fields}}
        {{#section}}
		<li {{^index}}class="active"{{/index}}>
            <a href="#tabs{{id}}" data-toggle="tab">{{{legend}}}</a>
        </li>
	    {{/section}}		
		{{/fields}}
	</ul></form>
	</form><div class="footer row"></div>
    `,
	tab_fieldset: `{{#section}}<div class="tab-pane {{^index}}active{{/index}} " id="tabs{{id}}">{{/section}}{{>_fieldset}}{{#section}}</div>{{/section}}`,
	modal_container:`<div class="modal fade" id="myModal{{name}}" data-update="{{update}}" data-append="{{append}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header {{modal.header_class}}">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">{{#icon}}<i class="fa fa-{{icon}}"></i> {{/icon}}{{{title}}}{{{legend}}}&nbsp;</h4>
			</div>
			<div class="modal-body">
				{{{body}}}
				{{^sections}}
				<form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{^options.inline}} smart-form-horizontal form-horizontal{{/options.inline}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}></form>
				{{/sections}}
				{{#sections}}
				<form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{^options.inline}} smart-form-horizontal form-horizontal{{/options.inline}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>   
				<ul class="nav nav-tabs" style="margin-bottom:15px">
					{{#fields}}
					{{#section}}
					<li {{^index}}class="active"{{/index}}>
						<a href="#tabs{{id}}" data-toggle="tab">{{{legend}}}</a>
					</li>
					{{/section}}		
					{{/fields}}
				</ul></form>
				{{/sections}}
				
			</div>
			<div class="modal-footer"  style="padding-right: 0;padding-left: 0;">
				{{{footer}}}
				<div class="footer"></div>
			</div>
		</div>
	</div>
</div>
`,
modal_fieldset:`{{>_fieldset}}`
};


gform.columns = 12;

gform.columnClasses = _.map(new Array(13),function(item,i){return 'col-md-'+i})
gform.default.inline = true;
gform.prototype.opts.suffix = "";

gform.handleError = function(field){
	if(!field.valid){
		field.el.classList.add('has-error')		
		field.el.querySelector('.font-xs.text-danger').innerHTML = field.errors;
	}else{
		field.el.querySelector('.font-xs.text-danger').innerHTML = '';
	}
}

gform.types['combo']    = _.extend({}, gform.types['input'], gform.types['collection'], {
    initialize: function() {
         $('select[name="' + this.name + '"]').combobox({appendId:this.id});
         
         this.onchangeEvent = function(){
            this.value = this.get();
            this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});
        }.bind(this)
      $(this.el).find('select').on('change',this.onchangeEvent)
    },
    destroy:function(){	
      $(this.el).find('select').off('change',this.onchangeEvent)
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
  render: function() {
    this.options = gform.options.call(this,this, this.value);
    return gform.render('select', this);
  },
  set: function(value) {
      this.el.querySelector('select').value = value;
      _.each(this.options.options, function(option, index){
          if(option.value == value || parseInt(option.value) == parseInt(value)) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
      }.bind(this))
      this.el.querySelector('input[type=text]').value = (_.find(this.options,{value:value})||{label:""} ).label

  }
});

gform.types['color'] = _.extend({}, gform.types['input'], {
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

  }
});

gform.types['address'] = _.extend({}, gform.types['input'], gform.types['section'],{
    defaults:{fields:[
        {type:"text",name:'street',label:"Street Address", validate:[{type:"length",max:"255"}]},
        {type:"text",name:'line2',label:"Address line 2", validate:[{type:"length",max:"150"}]},
        {type:"text",name:'city',label:"City", validate:[{type:"length",max:"255"}],columns:6},
        {type:"text",name:'state',label:"State/Province/Region", validate:[{type:"length",max:"255"}],columns:6},//,display:[{type:"not_matches",name:"country",value:"US"}]},
        // {type:"combo",name:'state',options:'../data/states.json',format:{label:'{{name}}'},label:"State/Province/Region",columns:6},
        {type:"text",name:'zip',label:"Postal/Zip Code", validate:[{type:"length",max:"15"}],columns:6},
        {type:"select",name:'country',options:'../data/countries.json',format:{label:'{{name}}',value:'{{code}}'},label:"Country", validate:[{type:"length",max:"15"}],columns:6}
    ]
}});


gform.types['datetime'] = _.extend({}, gform.types['input'], {
  defaults:{
	format:{input: "MM/DD/YYYY h:mm A"}

  },
  initialize: function(){
	this.onchangeEvent = function(){
		this.value = this.get();
		this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});
	}.bind(this)
	
	// this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
	// this.el.addEventListener('change', this.onchangeEvent.bind(null));
	var $el = $(this.el.querySelector('input[name="' + this.name + '"]'));

	  $el.attr('type','text');
	  $el.datetimepicker({format: this.format.input})
	  $el.on("dp.change", this.onchangeEvent.bind(null,true));
  },
});
gform.types['date'] = _.extend({},gform.types['datetime'], {
	defaults:{
	  format:{input: "MM/DD/YYYY"}
	},
})
gform.types['time']= _.extend({}, gform.types['datetime'], {
	defaults:{
		format:{input: "h:mm A"}
	}
})
// 	,
// 	initialize: function(){
// 	  this.onchangeEvent = function(){
// 		  this.value = this.get();
// 		  this.owner.pub(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});
// 	  }.bind(this)
	  
// 	//   this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
// 	  var $el = $(this.el.querySelector('input[name="' + this.name + '"]'));
// 	  // this.el.addEventListener('change', this.onchangeEvent.bind(null));
// 	  $el.attr('type','text');
// 	  $el.datetimepicker({format: this.format.input})
// 	  $el.on("dp.change", this.onchangeEvent.bind(null,true));
// 	},
//   });
// (function(b, $){
	// b.register({ type: 'date',
	// 	defaults: { elType: 'text' },
	// 	setup: function() {
	// 		this.$el = this.self.find('input');
	// 		this.$el.off();
	// 		if(this.onchange !== undefined){ this.$el.on('input',this.onchange);}
	// 		this.$el.on('input', $.proxy(function(){this.trigger('change');}, this));
	//     	this.$el.datetimepicker($.extend({},{format: "MM/DD/YYYY"}, this.item.datepicker))
	// 	},
	// 	satisfied: function(){
	// 		this.value = this.$el.val();
	// 		return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '');

	// 	}
	// });

// 	b.register({ type: 'time',
// 		defaults: { elType: 'text' },
// 		setup: function() {
// 			this.$el = this.self.find('input');
// 			this.$el.off();
// 			if(this.onchange !== undefined){ this.$el.on('input',this.onchange);}
// 			this.$el.on('input', $.proxy(function(){this.trigger('change');}, this));

// 			// this.$el.timepicker(this.item.timepicker || {});

//       this.$el.datetimepicker($.extend({},{format: "h:m A"},this.item.timepicker));

// 			// this.$el.datetimepicker(this.item.timepicker || {format: "h:m A"});

// 		}
// 	});
// })(Berry, jQuery);