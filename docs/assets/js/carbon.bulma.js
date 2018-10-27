carbon.stencils = {
    _container: `<div class="carbon">
    <form novalidate>
    {{#legend}}<legend for="{{name}}"><h4>{{legend}}</h4></legend>{{/legend}}
    </form>
</div>`,
text: `
<div class="field">
    {{>_label}}
    <div class="control">
    <input class="input" placeholder="{{placeholder}}" name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
    </div>
    {{>_error}}
    {{>_actions}}   
</div>    
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
			{{#options}}{{#options}}
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
			{{/options}}{{/options}}
        </select>
        {{>_error}}
        </div></div>
        {{>_actions}}       
    `,
    radio: `
        {{>_label}}
        <div class="control">
        {{#options}}{{#options}}
        <label class="radio"><input style="margin-right: 5px;" name="{{name}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio"><span style="font-weight:normal">{{label}}</span></label>        
        {{/options}}{{/options}}
        </div>
        {{>_error}}
        {{>_actions}}`,
    _fieldset: `<div class="carbon">
        <fieldset style="border: 0 none;box-shadow:none;padding:0" class="box" name="{{name}}">
        <legend class="subtitle" for="{{name}}"><h5>{{label}}</h5></legend>
        {{>_actions}}       
        </fieldset>
    </div>`,
    _actions: `      
        {{#array}}
        <hr>
        <div class="column">
        <input style="padding: 0 ;width:38px;" class="carbon-add button button-outline" type="button" value="+">
        <input style="padding: 0 ;width:38px;" class="carbon-minus button button-outline" type="button" value="-">
        </div>
        {{/array}}
    `,
    _label: `      
    <label class="label" for="{{name}}">{{label}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}{{suffix}}</label>        
    `,
    _error:`<small style="color:red;display:block;"></small>`,
    tabs_container: `<div class="carbon">
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
    tabs_fieldset: `<div class="carbon">
        <fieldset name="{{name}}" {{#childild}}class="hello there"{{/childild}}
            <legend for="{{name}}"><h5>{{label}}</h5></legend><hr>
            {{>_actions}}       
        </fieldset>
    </div>`
};
carbon.columns = 12;
carbon.columnClasses = _.map(['','10','20','25','33','40','50','60','66','75','80','90','100'],function(item){return 'column'})
carbon.prototype.opts.suffix = ""
carbon.prototype.opts.rowClass = "columns"

carbon.handleError = function(field){
    field.el.querySelector('small').innerHTML = field.errors;
}