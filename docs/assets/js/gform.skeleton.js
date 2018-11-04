gform.stencils = {
    _container: `<div class="gform">
        <form novalidate>
            <legend for="{{name}}"><h4>{{legend}}</h4></legend>
        </form>
    </div>`,
    text: `<div class="row">
        {{>_label}}
        <input placeholder="{{placeholder}}" class="u-full-width" name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
        {{>_error}}
    </div>`,    
     checkbox: `
        <label style="margin-top: 30px;" for="{{name}}">
        <input name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{name}}" />
        
        <span class="label-body">{{label}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}</span>
        </label>                
        {{>_error}}
    `,    
    
    hidden: `<div class="row">
        <input name="{{name}}" type="hidden" value="{{value}}" id="{{id}}" />
    </div>`,
    textarea: `<div class="row">
        {{>_label}}
        <textarea placeholder="{{placeholder}}" class="u-full-width" name="{{name}}" type="{{type}}" id="{{id}}" />{{value}}</textarea>
        {{>_error}}
    </div>`,
    select: `<div class="row">
        {{>_label}}    
        <select class="u-full-width" name="{{name}}" value="{{value}}" id="{{id}}" />
			{{#options}}
				{{^section}}
				<option {{#selected}}selected='selected'{{/selected}} {{^enabled}}disabled{{/enabled}} {{^visible}}hidden{{/visible}}  value="{{value}}">{{{label}}}</option>
				{{/section}}
				{{#section}}
				{{#section.label}}
				<optgroup label="{{label}}" data-id="{{section.id}} {{^enabled}}disabled{{/enabled}} {{^visible}}hidden{{/visible}}">
				{{/section.label}}
					{{#section.options}}
					<option data-id="{{section.id}}" {{#selected}}selected='selected'{{/selected}} {{^enabled}}disabled{{/enabled}} {{^visible}}hidden{{/visible}}  value="{{value}}">{{{label}}}</option>
					{{/section.options}}
					{{#section.label}}
				</optgroup>
				{{/section.label}}
				{{/section}}
			{{/options}}
        </select>
        {{>_error}}
    </div>`,
    radio: `<div class="row">
        <fieldset>
        {{>_label}}
        <span class="u-full-width">
        {{#options}}{{#options}}
        <label ><input style="margin-right: 5px;" name="{{name}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio"><span style="font-weight:normal">{{label}}</span></label>        
        {{/options}}{{/options}}
        </span>
        {{>_error}}
        </fieldset>
    </div>`,
    _fieldset: `<div class="gform">
        <fieldset name="{{name}}">
            <legend for="{{name}}"><h5>{{label}}</h5></legend><hr style="margin:-20px 0 20px 0">
            {{#array}}{{>_actions}} {{/array}}      
        </fieldset>
    </div>`,
    _actions: `      
        <input style="padding: 0 ;width:38px;" class="gform-add" type="button" value="+">
        <input style="padding: 0 ;width:38px;" class="gform-minus" type="button" value="-">
    `,
    _label: `      
    {{#array}}<div style="float:right">{{>_actions}}</div>{{/array}}
    <label for="{{name}}">{{label}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}{{suffix}}</label>        
    `,
    _error:`<small style="color:red;display:block;"></small>`,
    tabs_container: `<div class="gform">
    <ul class="nav nav-tabs" style="margin-bottom:15px">
    {{#fields}}
        {{#section}}<li>
            <a href="#tab{{index}}" data-toggle="tab">{{label}}</a>
        </li>
        {{/section}}
    {{/fields}}    
    </ul>
    <form>
        <legend for="{{name}}"><h4>{{legend}}</h4></legend>
    </form>
    </div>`,
    tabs_fieldset: `<div class="gform">
        <fieldset name="{{name}}" {{#childild}}class="hello there"{{/childild}}
            <legend for="{{name}}"><h5>{{label}}</h5></legend><hr>
            {{>_actions}}       
        </fieldset>
    </div>`
};
gform.columns = 12;
gform.columnClasses = _.map(['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'],function(item){return item+' columns'})
gform.prototype.opts.suffix = ""
gform.handleError = function(field){
    field.el.querySelector('small').innerHTML = field.errors;
}