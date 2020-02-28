gform.stencils = {
	// _form:`<form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form>`,
_container: `<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{modifiers}}{{#options.horizontal}} form-horizontal{{/options.horizontal}} " {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form><div class="gform-footer"></div>`,
text: `<div class="row clearfix form-group {{modifiers}} data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
		{{#pre}}<div class="input-group col-xs-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
		<input {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{name}}" value="" />
		{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}
		{{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}

		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
output: `
<div class="row">
<div>
		{{>_label}}
		
	<div class="col-xs-12">
    <output name="{{name}}" id="{{id}}">{{{display}}}</output>
    {{>_error}}
		{{>_addons}}
		{{>_actions}} 
		</div>
    </div>
    </div>
`,
grid: `<div class="row">
<fieldset id="{{id}}" name="{{name}}" class="row"  style="margin-bottom:20px">
    {{>_label}}
	<div class="col-xs-12">
    	<table class="table table-striped" style="margin-bottom:0">
			<thead>
				<tr>
					<th></th>
					{{#options}}
					<th><label>{{label}}</label></th>
					{{/options}}
				</tr>
			</thead>
			<tbody>
			{{#fields}}
				<tr>
					<td><label style="font-weight: 500;" for="{{id}}">{{{label}}}</label></td>
					{{#options}}
					<td>
					{{#multiple}}
						<div><input name="{{id}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{value}}"/>
					{{/multiple}}
					{{^multiple}}
						<input style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio">
					{{/multiple}}
					</td>
					{{/options}}
				</tr>
				{{/fields}}
			</tbody>
		</table>
		{{>_addons}}
		{{>_actions}}
	</div>
</fieldset>
</div>`,
switch:`<div class="row clearfix{{#horizontal}} form-horizontal{{/horizontal}} {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" style="margin:0 0 5px">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin:0 0 15px">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" style="margin: -10px 0 5px;"">
	{{/label}}

	<span class="falseLabel">{{options.0.label}} </span>
		<label class="switch">
		<input name="{{name}}" type="checkbox" {{^editable}}disabled{{/editable}} {{#options.1.selected}}checked=checked{{/options.1.selected}} value="{{value}}" id="{{name}}" />
		<span class="slider round"></span>
		</label>
		<span class="trueLabel">{{options.1.label}}</span>
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
// switch: `
// <div class="row clearfix {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
// {{>_label}}
// <div class="col-md-12" style="margin:0 0 5px">
// <label class="switch">
// <input name="{{name}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{value}}" id="{{name}}" />
// <span class="slider round"></span>
// </label>
// </div>
    
//     {{>_error}}
//     </div>
//     {{>_actions}}
// </div>`,
hidden: `<input type="hidden" name="{{name}}" value="{{value}}" />{{>_addons}}`,
    textarea: `<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}
		<textarea class="form-control"  {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}} style="width:100%;height:auto;min-height:20px" rows="{{size}}{{^size}}3{{/size}}" name="{{name}}" id="{{guid}}" placeholder="{{placeholder}}">{{content}}{{value}}</textarea>
		{{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}
		{{>_addons}}
			{{>_actions}}
	</div>
</div>`,

contenteditable :`<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}

		<div class="formcontrol" style="height:auto"><div placeholder="{{placeholder}}" style="outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" name="{{name}}">{{content}}{{value}}</div></div>
		{{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}
		{{>_addons}}
			{{>_actions}}
	</div>
</div>`,
    select: `<div class="row clearfix form-group {{modifiers}} {{#size}}size={{size}}{{/size}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}		
	{{#limit}}{{#multiple}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/multiple}}{{/limit}}

		{{#pre}}<div class="input-group"><span class="input-group-addon">{{{pre}}}</span>{{/pre}} 
		{{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
		{{#mapOptions.waiting}}<i class="fa fa-spinner fa-spin" style="font-size:20px;position:absolute;top:7px;left:22px;color:#666"></i>{{/mapOptions.waiting}}
			<select class="form-control test"  {{#multiple}}multiple=multiple{{/multiple}} {{#size}}size={{size}}{{/size}}  name="{{name}}{{#multiple}}[]{{/multiple}}" value="{{value}}" id="{{id}}" />
			{{#options}}
			{{^optgroup}}
			<option {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}} value="{{i}}">{{{label}}}</option>
			{{/optgroup}}
			{{#optgroup}}
			{{#optgroup.label}}
			<optgroup label="{{label}}" data-id="{{optgroup.id}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">
			{{/optgroup.label}}
					{{#options}}
					<option data-id="{{optgroup.id}}" {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}  value="{{i}}">{{{label}}}</option>
					{{/options}}
					{{#optgroup.label}}
			</optgroup>
			{{/optgroup.label}}
			{{/optgroup}}
			{{/options}}
			</select>
		{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
		{{^post}}{{#pre}}</div>{{/pre}}{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
    radio: `<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" {{#size}}style="padding-top: 5px;"{{/size}}>{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" {{#size}}style="padding-top: 5px;"{{/size}}>{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#size}}style="padding-top: 5px;"{{/size}}>
	{{/label}}
	{{#limit}}{{#multiple}}<small class="count text-muted" style="display:block;text-align:left">0/{{limit}}</small>{{/multiple}}{{/limit}}


			{{#options}}
			{{#multiple}}
			<div class="checkbox {{#size}}col-md-{{size}}{{/size}}" {{#size}}style="margin-top: -5px;"{{/size}}>
					<label class="noselect"><input name="{{name}}_{{value}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{i}}"/> {{label}}</label>
			</div>
			{{/multiple}}
			{{^multiple}}
			<div class="radio {{#size}}col-md-{{size}}{{/size}}" {{#size}}style="margin-top: -5px;"{{/size}}>
					<label {{^horizontal}}class="radio-inline"{{/horizontal}}><input style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{i}}" type="radio"><span class="noselect" style="font-weight:normal">{{{label}}}{{^label}}&nbsp;{{/label}}</span></label>        
			</div>
			{{/multiple}}
			{{/options}}

		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
custom_radio: `<div class="row clearfix form-group {{modifiers}} {{#multiple.duplicate}}dupable" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/multiple.duplicate}}" name="{{name}}" data-type="{{type}}">
{{>_label}}
{{#multiple.duplicate}}
<div class="duplicate add btn btn-default"><i class="fa fa-plus"></i></div>
<div class="btn btn-default remove"><i class="fa fa-minus"></i></div>
{{/multiple.duplicate}}
{{#label}}
{{#inline}}<div class="col-md-12">{{/inline}}
{{^inline}}<div class="col-md-8">{{/inline}}
{{/label}}
{{^label}}
<div class="col-md-12">
{{/label}}
	{{#pre}}<div class="input-group"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
	{{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
		<div class="custom-group"  name="{{name}}" style="max-height:200px;overflow-y:scroll;">
		{{#options}}
			<a href="javascript:void(0);" class="{{^selected}} {{defaultClass}}{{/selected}}{{#selected}} {{selectedClass}}{{/selected}}" data-value="{{value}}">
				{{{label}}}
			</a>&nbsp;
		{{/options}}
		</div>
	{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
	{{^post}}{{#pre}}</div>{{/pre}}{{/post}}
	{{>_addons}}
	{{>_actions}}
</div>
</div>`,
    _fieldset: `<div class="row"><fieldset data-type="fieldset" style="" name="{{name}}" id="{{id}}" class="{{modifiers}}" >
{{#array}}
<div data-name="{{name}}" data-ref="{{ref}}" class="btn-group hidden-print actions">
	<div data-id="{{id}}" class="btn btn-white gform-minus"><i data-id="{{id}}"  class="fa gform-minus fa-minus text-danger"></i></div>
	<div data-id="{{id}}" class="gform-add btn btn-white"><i data-id="{{id}}"  class="gform-add fa fa-plus text-success"></i></div>
</div>
{{/array}}
{{^hideLabel}}
{{#label}}<legend>{{{label}}}</legend>{{/label}}
{{/hideLabel}}
<div style="position:relative;top:-20px">{{>_addons}}</div>
</fieldset></div>`,
	_actions: `{{#array}}
	<div data-name="{{name}}" data-ref="{{ref}}" class="btn-group hidden-print actions pull-right">
	<div data-id="{{id}}" class="btn btn-white gform-minus"><i data-id="{{id}}" class="gform-minus fa fa-minus text-danger"></i></div>
	<div data-id="{{id}}" class="gform-add btn btn-white"><i data-id="{{id}}" class="gform-add fa fa-plus text-success"></i></div>
	</div>
	{{/array}}`,
    _label: `
	{{^hideLabel}}
	
    {{#label}}
	<label for="{{name}}" {{^horizontal}}style="text-align:left"{{/horizontal}} class="control-label {{^horizontal}}col-xs-12{{/horizontal}}{{#horizontal}}col-md-4{{/horizontal}}">
  {{{label}}}{{#required}}{{{requiredText}}}{{/required}}{{suffix}}
</label>{{/label}}
{{/hideLabel}}
    `,
    _addons:`<span class="help-inline"> {{{help}}}</span>
<span class="font-xs text-danger" style="display:block;"></span>`,
    checkbox:`<div class="row clearfix {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" style="margin:0 0 5px">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin:0 0 15px">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" style="margin: -10px 0 5px;"">
	{{/label}}
		<div class="checkbox">
			<label class="{{alt-display}}">
				<input name="{{name}}" type="checkbox" {{^editable}}disabled{{/editable}} {{#options.1.selected}}checked=checked{{/options.1.selected}}>{{#display}}<span class="noselect">{{{display}}}</span>{{/display}}&nbsp;
			</label>
		</div>
	{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
scale:`
<div class="row clearfix form-group {{modifiers}} {{#multiple.duplicate}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/multiple.duplicate}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{>_actions}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
			<table class="table table-striped">
				<thead>
				<tr>
					{{#format.low}}<th></th>{{/format.low}}
					{{#options}}
					<th><label for="{{name}}_{{i}}">{{{label}}}</label></th>
					{{/options}}
					{{#format.high}}<th></th>{{/format.high}}
				</tr>
				</thead>
				<tbody>
				<tr>
					{{#format.low}}<td><label style="font-weight: 500;" for="{{name}}_1">{{{format.low}}}</label></td>{{/format.low}}
					{{#options}}
					<td>
						<input data-label="{{label}}" id="{{name}}_{{i}}" name="{{id}}" value="{{i}}" {{^editable}}readonly disabled{{/editable}} type="radio" {{#selected}}checked=checked{{/selected}} >
					</td>
					{{/options}}
					{{#format.high}}<td><label style="font-weight: 500;" for="{{name}}_{{options.length}}">{{{format.high}}}</label></td>{{/format.high}}
				</tr>
		</tbody>
			</table>
		{{>_addons}}
	</div>
</div>`,
button:`<button class="btn btn-default hidden-print {{modifiers}}" style="margin:0 15px">{{{label}}}</button>`,
tab_container: `
<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}    
	<ul class="nav nav-tabs" style="margin-bottom:15px">
		{{#fields}}
			{{#section}}
			<li {{^index}}class="active"{{/index}}>
				<a href="#tabs{{id}}" data-toggle="tab">{{{legend}}}</a>
			</li>
			{{/section}}		
		{{/fields}}
	</ul></form>
	</form><div class="gform-footer row"></div>`,
tab_fieldset: `{{#section}}<div class="tab-pane {{^index}}active{{/index}} " id="tabs{{id}}">{{/section}}{{>_fieldset}}{{#section}}</div>{{/section}}`,
modal_container:`<div class="modal fade gform {{modifiers}} {{#horizontal}} form-horizontal{{/horizontal}} " id="myModal{{name}}" data-update="{{update}}" data-append="{{append}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header {{modal.header_class}}">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">{{#icon}}<i class="fa fa-{{icon}}"></i> {{/icon}}{{{title}}}{{{legend}}}&nbsp;</h4>
			</div>
			<div class="modal-body">
				{{{body}}}
				{{^sections}}
				<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}></form>
				{{/sections}}
				{{#sections}}
				<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>   
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
			<div class="modal-footer gform-footer">
				{{{footer}}}
			</div>
		</div>
	</div>
</div>
`,
modal_fieldset:`{{>_fieldset}}`
};


gform.columns = 12;

gform.columnClasses = _.map(new Array(13),function(item, i){return 'col-xs-12 col-sm-'+i})
gform.offsetClasses = _.map(new Array(13),function(item, i){return 'col-xs-offset-0 col-sm-offset-'+i})
gform.default.inline = true;
gform.default.columns = 12;

gform.prototype.opts.suffix = "";

gform.handleError = function(field){
	var error_container = field.el.querySelector('.font-xs.text-danger')

	if(!field.valid){
		field.el.classList.add('has-error');
		if(!!error_container)error_container.innerHTML = field.errors;
	}else{
		field.el.classList.remove('has-error');
		// field.el.classList.add('has-success')
		// field.el.querySelector('.font-xs.text-danger').innerHTML = '';
		if(!!error_container)error_container.innerHTML = '';

	}
}

gform.types['reset']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-times\"></i> Reset",
	"action":"reset",
	"modifiers": "btn btn-default"}});
gform.types['cancel']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-times\"></i> Cancel",
	"action":"cancel",
	"modifiers": "btn btn-danger"}});
gform.types['save']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-check\"></i> Save",
	"action":"save",
	"modifiers": "btn btn-success"}});
gform.types['clear']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-times\"></i> Clear",
	"action":"clear",
	"modifiers": "btn btn-warning"}});

gform.types['color'] = _.extend({}, gform.types['input'], {
	defaults: {
		pre: '<i style="display: block;width:20px;height:20px;margin: 0 -5px;background-color:{{value}}"></i>' ,
		elType: 'text',
		value:"#000000"
	},
	toString: function(name,display){
		this.value = this.get();//shouldn't need this here - but we do for now
		if(!display){
			return '<dt>'+this.label+'</dt> <dd><span style="width:20px;height:20px;display: inline-block;top: 5px;position: relative;background:'+this.value+';"></span> '+(this.value||'(empty)')+'</dd><hr>'
		}else{
              return this.value
		}
		  
},
  initialize: function(){
	// this.onchangeEvent = function(){
	// 	this.value = this.get();
	// 	this.parent.trigger(['change','input'], this,{input:this.value});
	// }.bind(this)


	this.onchangeEvent = function(input){
		//   this.input = input;
		  this.value = this.get();
		  if(this.el.querySelector('.count') != null){
			var text = this.value.length;
			if(this.limit>1){text+='/'+this.limit;}
			this.el.querySelector('.count').innerHTML = text;
		  }
		//   this.update({value:this.get()},true);
		//   gform.types[this.type].focus.call(this)
			gform.types[this.type].setup.call(this);
		  this.owner.trigger('change', this,{input:this.value});

		  if(input){
			this.owner.trigger('input', this,{input:this.value});
		  }
	  }.bind(this)


	this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

	$(this.el.querySelector('input[name="' + this.name + '"]')).attr('type','text');
		this.el.querySelector('i').style.backgroundColor = this.get()
	$(this.el.querySelector('input[name="' + this.name + '"]')).colorpicker({format: 'hex',container:$(this.el).find('.input-group')}).on('changeColor', function(ev){
		this.el.querySelector('i').style.backgroundColor = this.get()
		this.parent.trigger('change',this);
		this.parent.trigger('input',this);
	}.bind(this));

  }
});

gform.types['contentEditable'] = gform.types['summernote'] = _.extend({}, gform.types['input'], {
	render: function(){
        //   return gform.render(this.type, this);
          return gform.render('contenteditable', this).split('value=""').join('value="'+_.escape(this.value)+'"')
      },
      set: function(value) {
        //   this.el.querySelector('textarea[name="' + this.name + '"]').value = value;


          	// if(typeof this.lastSaved === 'undefined'){
			// 	this.lastSaved = value;
			// }
			// this.editor.setContent(value)
			this.$el.summernote('code', value)
			// this.value = value;
			// this.$el.html(value)

			// return this.$el;
      },
      get: function() {
        //   return this.el.querySelector('textarea[name="' + this.name + '"]').value;
        return this.$el.summernote('code')

      },
		initialize: function() {
			this.$el = $(this.el).find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.summernote({
				disableDragAndDrop: true,
		    	dialogsInBody: true,
				toolbar: this.item.toolbar||[
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
			        ['link', ['linkDialogShow', 'unlink']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['view', ['fullscreen']]
				]
			});
			this.$el.on('summernote.change', function(){
				this.owner.trigger('change',this);

				this.owner.trigger('input',this);
			}.bind(this)
      );
		},satisfied: function(value){
			this.value = this.get()
			return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '' && this.value !== "<p><br></p>");
		},	
        destroy: function() {
            this.$el.summernote('destroy');
            if(this.$el){
                this.$el.off();
            }
        }

  });


  $(document).on('focusin', function(e) {
    if ($(e.target).closest(".note-editable").length) {
        e.stopImmediatePropagation();
			
    }
});
$(document).on('click', function(e) {
    if ($(e.target).hasClass(".note-editor")) {
        e.stopImmediatePropagation();

			$(e.target).find('.open').removeClass('open')
    }
});



gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-envelope"></i>', validate: [{ type:'valid_email' }]}});
gform.types['url'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-link"></i>', validate: [{ type:'valid_url' }]}});
gform.types['tel'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-phone"></i>', placeholder: '+1'}});
gform.types['password'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-lock"></i>'}});
gform.types['address'] = _.extend({}, gform.types['input'], gform.types['section'], {
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






gform.THEME = {'bootstrap':'0.0.4.2'}

gform.types['datetime'] = _.extend({}, gform.types['input'], {
  defaults:{
	format:{input: "MM/DD/YYYY h:mm A"},
	elType:'text'
  },
  initialize: function(){
	this.onchangeEvent = function(){
		this.value = this.get();
		this.parent.trigger(['change','input'], this,{input:this.value});
	}.bind(this)
	
	// this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
	// this.el.addEventListener('change', this.onchangeEvent.bind(null));
	var $el = $(this.el.querySelector('input[name="' + this.name + '"]'));

		// $el.attr('type','text');
	  $el.datetimepicker({format: this.format.input})
	//   $el.data("DateTimePicker").minDate(moment("1/1/1900"));
	  $el.on("dp.change", this.onchangeEvent.bind(null,true));
  },
});
gform.types['date'] = _.extend({},gform.types['datetime'], {
	defaults:{
	  format:{input: "MM/DD/YYYY"},
		elType:'text'
	},
})
gform.types['time']= _.extend({}, gform.types['datetime'], {
	defaults:{
		format:{input: "h:mm A"},
		elType:'text'
	}
})
gform.prototype.modal = function(data){
	$(this.el).modal(data)
	return this;
}
