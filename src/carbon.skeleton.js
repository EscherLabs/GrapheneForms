carbon.stencils = {
    _container: `<div class="carbon">
        <form novalidate>
            <legend for="{{name}}"><h4>{{legend}}</h4></legend>
        </form>
    </div>`,
    text: `<div class="row">
        {{>_label}}
        <input class="six columns" name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
        {{>_error}}
        {{>_actions}}       
    </div>`,    
    hidden: `<div class="row">
        <input name="{{name}}" type="hidden" value="{{value}}" id="{{id}}" />
    </div>`,
    textarea: `<div class="row">
        {{>_label}}
        <textarea class="six columns" name="{{name}}" type="{{type}}" id="{{id}}" />{{value}}</textarea>
        {{>_error}}
        {{>_actions}}       
    </div>`,
    select: `<div class="row">
        {{>_label}}    
        <select class="six columns" name="{{name}}" value="{{value}}" id="{{id}}" />
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
        {{>_actions}}       
    </div>`,
    radio: `<div class="row">
        {{>_label}}
        {{#options}}
        <label><input style="margin-right: 5px;" name="{{name}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio">{{label}}</label>        
        {{/options}}
        </span>
        {{>_error}}
        {{>_actions}}       
    </div>`,
    _fieldset: `<div class="carbon">
        <fieldset name="{{name}}">
            <legend for="{{name}}"><h5>{{label}}</h5></legend><hr>
            {{>_actions}}       
        </fieldset>
    </div>`,
    _actions: `      
        {{#array}}
        <button style="padding: 0 ;width:38px;" class="carbon-add">+</button>
        <button style="padding: 0 ;width:38px;" class="carbon-minus">-</button>
        {{/array}}
    `,
    _label: `      
    <label class="three columns" for="{{name}}">{{label}}{{#validate.required}}{{{owner.opts.required}}}{{/validate.required}}{{owner.opts.suffix}}</label>        
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
carbon.columnClasses = _.map(['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'],function(item){return item+' columns'})

carbon.handleError = function(field){
    field.el.querySelector('small').innerHTML = field.errors;
}