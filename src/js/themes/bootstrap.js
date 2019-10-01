gform.stencils = {
	// _form:`<form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form>`,
_container: `<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{modifiers}}{{#options.horizontal}} form-horizontal{{/options.horizontal}} " {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form><div class="gform-footer row"></div>`,
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
		<input {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{name}}" value="{{value}}" />
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
grid: `
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
`,
switch:`
<div class="row clearfix {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" style="margin:0 0 5px">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin:0 0 15px">{{/horizontal}}
	{{/label}}
	{{^label}}
	{{^horizontal}}<div class="col-md-12" style="margin: -10px 0 5px;"">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin: -5px 0 10px">{{/horizontal}}
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
    textarea: `<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
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
			<select class="form-control test" {{#multiple}}multiple=multiple{{/multiple}} {{#size}}size={{size}}{{/size}}  name="{{name}}{{#multiple}}[]{{/multiple}}" value="{{value}}" id="{{id}}" />
			{{#options}}
			{{^optgroup}}
			<option {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}} value="{{index}}">{{{label}}}</option>
			{{/optgroup}}
			{{#optgroup}}
			{{#optgroup.label}}
			<optgroup label="{{label}}" data-id="{{optgroup.id}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">
			{{/optgroup.label}}
					{{#options}}
					<option data-id="{{optgroup.id}}" {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}  value="{{index}}">{{{label}}}</option>
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
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
	{{#limit}}{{#multiple}}<small class="count text-muted" style="display:block;text-align:left">0/{{limit}}</small>{{/multiple}}{{/limit}}


			{{#options}}
			{{#multiple}}
			<div class="checkbox">
					<label class="noselect"><input name="{{name}}_{{value}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{index}}"/> {{label}}</label>
			</div>
			{{/multiple}}
			{{^multiple}}
			<div class="radio">
					<label {{^horizontal}}class="radio-inline"{{/horizontal}}><input style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{index}}" type="radio"><span class="noselect" style="font-weight:normal">{{{label}}}{{^label}}&nbsp;{{/label}}</span></label>        
			</div>
			{{/multiple}}
			{{/options}}

		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
    _fieldset: `<div class="row"><fieldset data-type="fieldset" style="" name="{{name}}" id="{{id}}" class="{{modifiers}}" >
{{#array}}
<div data-name="{{name}}" class="btn-group hidden-print actions">
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
	<div data-name="{{name}}" class="btn-group hidden-print actions pull-right">
	<div data-id="{{id}}" class="btn btn-white gform-minus"><i data-id="{{id}}" class="gform-minus fa fa-minus text-danger"></i></div>
	<div data-id="{{id}}" class="gform-add btn btn-white"><i data-id="{{id}}" class="gform-add fa fa-plus text-success"></i></div>
	</div>
	{{/array}}`,
    _label: `
    {{^hideLabel}}
	<label for="{{name}}" {{^horizontal}}style="text-align:left"{{/horizontal}} class="control-label {{^horizontal}}col-xs-12{{/horizontal}}{{#horizontal}}col-md-4{{/horizontal}}">
  {{{label}}}{{#required}}{{{requiredText}}}{{/required}}{{suffix}}
</label>{{#label}}{{/label}}
{{/hideLabel}}
    `,
    _addons:`<span class="help-inline"> {{{help}}}</span>
<span class="font-xs text-danger" style="display:block;"></span>`,
    checkbox:`<div class="row clearfix {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" style="margin:0 0 5px">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin:0 0 15px">{{/horizontal}}
	{{/label}}
	{{^label}}
	{{^horizontal}}<div class="col-md-12" style="margin: -10px 0 5px;"">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin: -5px 0 10px">{{/horizontal}}
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
						<input data-label="{{label}}" id="{{name}}_{{i}}" name="{{id}}" value="{{index}}" {{^editable}}readonly disabled{{/editable}} type="radio" {{#selected}}checked=checked{{/selected}} >
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

gform.columnClasses = _.map(new Array(13),function(item, i){return 'col-xs-'+i})
gform.offsetClasses = _.map(new Array(13),function(item, i){return 'col-xs-offset-'+i})
gform.default.inline = true;
gform.default.columns = 12;

gform.prototype.opts.suffix = "";

gform.handleError = function(field){
	if(!field.valid){
		field.el.classList.add('has-error');
		field.el.querySelector('.font-xs.text-danger').innerHTML = field.errors;
	}else{
		field.el.classList.remove('has-error');
		// field.el.classList.add('has-success')
		field.el.querySelector('.font-xs.text-danger').innerHTML = '';
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
	toString: function(){
		return '<dt>'+this.label+'</dt> <dd><span style="width:20px;height:20px;display: inline-block;top: 5px;position: relative;background:'+this.value+';"></span> '+(this.value||'(empty)')+'</dd><hr>'
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
		  this.parent.trigger(['change'], this,{input:this.value});
		  if(input){
			this.parent.trigger(['input'], this,{input:this.value});
		  }
	  }.bind(this)


	this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

	$(this.el.querySelector('input[name="' + this.name + '"]')).attr('type','text');
		this.el.querySelector('i').style.backgroundColor = this.get()

	$(this.el.querySelector('input[name="' + this.name + '"]')).colorpicker({format: 'hex'}).on('changeColor', function(ev){
		this.el.querySelector('i').style.backgroundColor = this.get()
		this.parent.trigger('change',this);
	}.bind(this));

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








gform.stencils.smallcombo = `
<div class="row clearfix form-group {{modifiers}} data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
	<div class="combobox-container">
		<div class="input-group"> 
		{{#pre}}<span class="input-group-addon">{{{pre}}}</span>{{/pre}}
		<input {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{name}}" value="{{value}}" />
        <ul class="typeahead typeahead-long dropdown-menu"></ul>
		<span class="input-group-addon dropdown-toggle" data-dropdown="dropdown"> <span class="caret"></span> <span class="fa fa-times"></span> </span> 
		</div>


        </div>
		{{>_addons}}
		{{>_actions}}
	</div>
</div>
		`;
		
gform.types['smallcombo'] = _.extend({}, gform.types['input'], {
		toString: function(){
			if(typeof this.combo !== 'undefined'){
				return '<dt>'+this.label+'</dt> <dd>'+(this.combo.value||'(empty)')+'</dd><hr>'
			}else{
				return '<dt>'+this.label+'</dt> <dd>'+(this.get()||'(empty)')+'</dd><hr>'
			}
		},
    render: function() {
        if(typeof this.mapOptions == 'undefined'){
          this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
          this.mapOptions.on('change',function(){
              this.options = this.mapOptions.getoptions()
							// this.update();
							if(typeof this.value !== 'undefined'){
								gform.types[this.type].set.call(this, this.value);
							}
          }.bind(this))
        }
				this.options = this.mapOptions.getoptions();
				
        this.value = this.value || "";

        return gform.render('smallcombo', this);
    },      
    get: function() {
				//   return this.el.querySelector('input[name="' + this.name + '"]').value;
			if(this.strict){
				return (_.find(this.options,{value:this.value})||{value:""}).value;
			}else{
				return this.value;
			}
    },
    set: function(value,silent) {				
        // this.el.querySelector('input[name="' + this.name + '"]').value = value;
				var item = _.find(this.options,{value:value})
				if(typeof item !== 'undefined') {
						this.combo.value =  item.label;
						this.value = item.value;
						gform.addClass(this.el.querySelector('.combobox-container'), 'combobox-selected');
				}else{
					if(typeof value !== 'undefined') {
						this.combo.value =  value||"";
						this.value = value||"";
					}
					gform.toggleClass(this.el.querySelector('.combobox-container'), 'combobox-selected', this.value!=="");
				}
				gform.types[this.type].setLabel.call(this);
				if(!silent) {
					this.parent.trigger(['change'], this);
				}
    },
    initialize: function(){
        this.onchangeEvent = function(input){
						this.set(this.combo.value)
						_.throttle(this.renderMenu,100).call(this);
            this.parent.trigger(['input'], this, {input:this.value});
				}.bind(this)
				this.processOptions = function(item){
					if(typeof item.optgroup !== 'undefined'){
						if(typeof item.optgroup.options !== 'undefined' && item.optgroup.options.length){
							_.each(item.optgroup.options,this.processOptions.bind(this))
						}
					}else{
						if(this.filter !== false && (this.combo.value == ""  || _.score(item.label.toLowerCase(), this.combo.value.toLowerCase())>.1)){
							var li = document.createElement("li");
							li.innerHTML = gform.renderString('<a href="javaScript:void(0);" data-index="{{i}}" class="dropdown-item">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>',item);
							this.menu.appendChild(li);
							item.filter = true;
						}else{
							item.filter = false;
						}
					}
				}
        this.renderMenu = function(){
					this.menu.style.display = 'none';
					this.shown = false;
					this.menu.innerHTML = "";
					
					// if(typeof this.search !== 'string'){
						this.options = this.mapOptions.getoptions();

						_.each(this.options,this.processOptions.bind(this))

						var first = this.menu.querySelector('li');
						if(first !== null){
							gform.addClass(first,'active')
							this.menu.style.display = 'block';
							this.shown = true;
						}
						// else{
							if(typeof this.search == 'string'){
								gform.ajax({path: gform.renderString(this.search,{search:this.combo.value}), success:function(data) {
									// this.menu.innerHTML = "";
									index = this.options.length;
									this.options = this.options.concat( _.map(data,function(option){
									option.i = (option.i||(++index));
										if(typeof this.format !== 'undefined'){
											if(typeof this.format.label !== 'undefined' ){
												option.label = gform.renderString(this.format.label,option);
											}
											if(typeof this.format.display !== 'undefined' ){
												option.display = gform.renderString(this.format.display,option);
											}
											if(typeof this.format.value !== 'undefined' ){
												option.value = gform.renderString(this.format.value,option);
											}
										}
										if(!this.filter || this.combo.value == ""  || _.score(option.label.toLowerCase(), this.combo.value.toLowerCase())>.1){

											var li = document.createElement("li");
											li.innerHTML = gform.renderString('<a href="javaScript:void(0);"  data-index="{{i}}" class="dropdown-item">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>', option);
											this.menu.appendChild(li);
											option.filter = true;
										}
										return option;
									}.bind(this)))
									var first = this.menu.querySelector('li');
									if(first !== null){
										gform.addClass(first,'active')
										this.menu.style.display = 'block';
										this.shown = true;
									}else{
										// gform.removeClass(this.el.querySelector('.combobox-container'),'combobox-selected');
										this.value = null;
									}
									this.parent.trigger(['change'], this, {input:this.value});
								}.bind(this)})
							}
						// }
					// }else{

        }
        this.shown = false;
        this.input = this.input || false;
        this.menu = this.el.querySelector('ul')
        this.combo = this.el.querySelector('input');
		// this.combo.addEventListener('focus',function(){
		// 	this.renderMenu();
		// }.bind(this))
				this.set = gform.types[this.type].set.bind(this)
        this.select = function(index){
            var item = _.find(this.options,{i:parseInt(index)})
						this.set(item.value);
						this.parent.trigger(['input'], this, {input:this.value});

            this.menu.style.display = 'none';
            this.shown = false;
            this.combo.focus();
				}
				$(this.el).on('click',".dropdown-item",function(e){
					this.select(e.currentTarget.dataset.index);   
					e.stopPropagation();
				}.bind(this))
        this.el.addEventListener('click',function(e){
            if(e.target.nodeName == "SPAN" && this.editable){
                if(this.el.querySelector('.combobox-selected') !== null){
                    // this.selected = false;
                    // this.combo.value = "";
					this.set("");			
					this.renderMenu();

                }else{
                    if(this.shown){
                        this.menu.style.display = 'none';
                        this.shown = false;
                    }else{
                        this.renderMenu();
                    }
                }
				this.combo.focus();
				
            }
        }.bind(this))

        this.el.addEventListener('keydown',function(e){
					if (!this.shown) {
						if(e.keyCode == 40){this.renderMenu();}                
						return;
					}

          switch(e.keyCode) {
            case 9: // tab
            case 13: // enter
							e.preventDefault();
							this.select(this.menu.querySelector('li.active a').dataset.index);   
							break;
            case 27: // escape
                e.preventDefault();
                this.menu.style.display = 'none';
                this.shown = false;
                break;

            case 38: // up arrow
                e.preventDefault();
                var active = this.menu.querySelector('.active');
                gform.removeClass(active,'active');
                // var active = $(this.menu).find('.active').removeClass('active')
                //     , prev = active.prev();
                            
                prev = active.previousElementSibling;

                if (!prev) {
                    var list = this.menu.querySelectorAll('li');
                    prev =  list[list.length-1];
                }
                            
                gform.addClass(prev,'active')

                // prev.addClass('active');
                // this.prev();
                // this.fixMenuScroll();

                var active = $(this.menu).find('.active');
                //fixscroll
                if(active.length){
                    var top = active.position().top;
                    var bottom = top + active.height();
                    var scrollTop = $(this.menu).scrollTop();
                    var menuHeight = $(this.menu).height();
                    if(bottom > menuHeight){
                        $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                    } else if(top < 0){
                        $(this.menu).scrollTop(scrollTop + top);
                    }
                }
                break;

            case 40: // down arrow
                e.preventDefault();
                var active = this.menu.querySelector('.active');
                gform.removeClass(active,'active');
                // var active = $(this.menu).find('.active').removeClass('active')
                //     , next = active.next();
                next = active.nextElementSibling;
                if (!next) {
                    next = this.menu.querySelector('li')
                    // nedxt = $($(this.menu).find('li')[0]);
                }
                gform.addClass(next,'active')
                // next.addClass('active');

                var active = $(this.menu.querySelector('.active'));
                //fixscroll
                if(active.length){
                    var top = active.position().top;
                    var bottom = top + active.height();
                    var scrollTop = $(this.menu).scrollTop();
                    var menuHeight = $(this.menu).height();
                    if(bottom > menuHeight){
                        $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                    } else if(top < 0){
                        $(this.menu).scrollTop(scrollTop + top);
                    }
                }
                // this.next();
                // this.fixMenuScroll();
                break;
            }

            e.stopPropagation();
        }.bind(this))

        $(this.menu).on('mouseenter','li',function(e){
					this.mousedover = true;
					if(this.menu.querySelector('.active') !== null){
						gform.removeClass(this.menu.querySelector('.active'),'active')
					}
					gform.addClass(e.currentTarget,'active')            
        }.bind(this))

        $(this.menu).on('mouseleave','li',function(e){
          this.mousedover = false;            
        }.bind(this))

        this.combo.addEventListener('blur',function(e){

					if(this.shown ){
						var list = _.filter(this.options,{filter:true});
						if(list.length == 1){
							this.set(list[0].value);
						}else{
							list = _.filter(this.options,{label:this.combo.value});
							if(list.length){
								this.set(list[0].value);
							}
						}
						if (!this.mousedover && this.shown) {setTimeout(function () { 
							this.menu.style.display = 'none'; this.shown = false;}.bind(this), 200);
						}								
						this.parent.trigger(['input'], this, {input:this.value});
					}
				// if(this.el.querySelector('.combobox-selected') == null){
					this.set(this.value||this.combo.value)

					this.set(gform.types[this.type].get.call(this))
					// }
				}.bind(this))
				this.options = this.mapOptions.getoptions();
				// debugger;
					if(typeof this.search == 'string'){
						gform.ajax({path: gform.renderString(this.search,{value:this.value}), success:function(data) {
							index = this.options.length;
		
							this.options = this.options.concat( _.map(data,function(option){
		
							// this.options = _.map(data,function(option,index){
							option.index = (option.index||(++index))+"";
								if(typeof this.format !== 'undefined'){
									if(typeof this.format.label !== 'undefined' ){
										option.label = gform.renderString(this.format.label,option);
									}
									if(typeof this.format.display !== 'undefined' ){
										option.display = gform.renderString(this.format.display,option);
									}
									if(typeof this.format.value !== 'undefined' ){
										option.value = gform.renderString(this.format.value,option);
									}
								}

								if(this.combo.value == ""  || _.score(option.label.toLowerCase(),this.combo.value.toLowerCase())>.1){
									var li = document.createElement("li");
									li.innerHTML = gform.renderString('<a href="#" data-index="{{index}}" class="dropdown-item">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>',option);
									this.menu.appendChild(li);
								}
								return option;
							}.bind(this)))
						if(typeof this.value !== 'undefined'){
							this.set(this.value);
						}
						// this.parent.trigger('change')
						// this.parent.trigger(['change:'+this.name,'change'], this, {input:this.value});

					}.bind(this)}
					)}else{
						if(typeof this.value !== 'undefined'){
							this.set(this.value);
						}
					}

        this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

        // this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
    }
});





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
