gform.stencils = {
    _container: `<div class="gform">
    <form novalidate>
    {{#legend}}<legend for="{{name}}"><h4>{{legend}}</h4></legend>{{/legend}}
    </form>
</div>`,
text: `

<div class="field">
    {{>_actions}}   
  <label class="label">{{>_label}}</label>
  <div class="control">
    <input name="{{name}}" class="input" type="{{type}}" {{#selected}} checked {{/selected}} placeholder="{{placeholder}}" value="{{value}}" id="{{id}}">
  </div>
</div>

    {{>_error}}
`,checkbox: `
<div class="field">

<div class="control">

    <input class="checkbox" name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{name}}" />
    <label class="label-inline" for="{{name}}">{{label}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}</label>        
    </div>
    
    {{>_error}}
    </div>
    {{>_actions}}  
    </div> 
`,    
    hidden: `<input name="{{name}}" type="hidden" value="{{value}}" id="{{id}}" />`,
    textarea: `
    <div class="field">
        {{>_label}}
        <div class="control">
        <textarea class="textarea" placeholder="{{placeholder}}" name="{{name}}" type="{{type}}" id="{{id}}" />{{value}}</textarea>
        {{>_error}}
        </div>
        {{>_actions}}   
    </div>    `,
    select: `
        {{>_label}}    

    <div class="control" style="width:100%">
    <div class="select" style="width:100%">
        <select name="{{name}}" style="width:100%" value="{{value}}" id="{{id}}" />
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
        {{>_error}}
        </div></div>
        {{>_actions}}       
    `,
    radio: `
        {{>_label}}
        <div class="control">
        {{#options}}
        <label class="radio"><input style="margin-right: 5px;" name="{{name}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio"><span style="font-weight:normal">{{label}}</span></label>        
        {{/options}}
        </div>
        {{>_error}}
        {{>_actions}}`,
    _fieldset: `<div class="gform">
        <fieldset style="border: 0 none;box-shadow:none;padding:0" class="box" name="{{name}}">
        <legend class="subtitle" for="{{name}}"><h5>{{label}}</h5></legend>
        {{>_actions}}       
        </fieldset>
    </div>`,
    _actions: `      
        {{#array}}
        <div class="column">
        <input style="padding: 0 ;width:38px;" class="gform-add button button-outline" type="button" value="+">
        <input style="padding: 0 ;width:38px;" class="gform-minus button button-outline" type="button" value="-">
        </div>
        {{/array}}
    `,
    _label: `      
    <label class="label" for="{{name}}">{{label}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}{{suffix}}</label>        
    `,
    _error:`<p class="help is-danger"></p>`,
    tabs_container: `{{>_container}}`,
    tabs_fieldset: `{{>_fieldset}}`
};
gform.columns = 12;
gform.columnClasses = _.map(['','is-one-fifth','is-one-fifth','is-one-quarter','is-one-third','is-two-fifths','is-half','is-three-fifths','is-two-thirds','is-three-quarters','is-four-fifths','is-four-fifths','is-full'],function(item){return ' column'})
gform.prototype.opts.suffix = ""
gform.prototype.opts.rowClass = "columns"

gform.handleError = function(field){
    field.el.querySelector('help').innerHTML = field.errors;
}