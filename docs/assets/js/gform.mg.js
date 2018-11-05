gform.stencils = {
    _container: `<div class="gform">
    <form novalidate>
    {{#legend}}<legend for="{{name}}"><h4>{{legend}}</h4></legend>{{/legend}}
    </form>
    <div class="row footer"></div>
</div>`,
text: `
<div class="row">
<div class="column">
    {{>_label}}
    <input style="width:100%" placeholder="{{placeholder}}" name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
    {{>_error}}
    </div>
    {{>_actions}}   
</div>    
`,checkbox: `
    <input name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{name}}" />
    <label class="label-inline" for="{{name}}">{{label}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}</label>        
    
    {{>_error}}
    </div>
    {{>_actions}}   
`,    
hidden: `<input name="{{name}}" type="hidden" value="{{value}}" id="{{id}}" />`,
textarea: `
<div class="row">
<div class="column">
    {{>_label}}
    <textarea placeholder="{{placeholder}}" name="{{name}}" type="{{type}}" id="{{id}}" />{{value}}</textarea>
    {{>_error}}
    </div>
    {{>_actions}}   
</div>`,
select: `
    {{>_label}}    
    <select name="{{name}}" value="{{value}}" id="{{id}}" />
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
    {{>_actions}}       
`,
radio: `
    {{>_label}}
    <span class="">
    {{#options}}
    <label ><input style="margin-right: 5px;" name="{{name}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio"><span style="font-weight:normal">{{label}}</span></label>        
    {{/options}}
    </span>
    {{>_error}}
    {{>_actions}}`,
_fieldset: `
    <fieldset name="{{name}}">
    <legend for="{{name}}"><h5>{{label}}</h5></legend>
    {{>_actions}}       
    </fieldset>
`,
_actions: `      
    {{#array}}
    <hr>
    <div class="column">
    <input style="padding: 0 ;width:38px; border-color:green;color:green" class="gform-add button button-outline" type="button" value="+">
    <input style="padding: 0 ;width:38px; border-color:red;color:red" class="gform-minus button button-outline" type="button" value="-">
    </div>
    {{/array}}
`,
_label: `      
<label class="" for="{{name}}">{{label}}{{#validate.required}}{{{requiredText}}}{{/validate.required}}{{suffix}}</label>           
<small class="form-help"> {{{help}}}</small>
`,
_error:`<small style="color:red;display:block;"></small>`,
button:`<span class="button {{modifiers}}" style="margin:0 10px 20px">{{{label}}}</span>`,
tabs_container: `{{>_container}}`,
tabs_fieldset: `{{>_fieldset}}`
};
gform.columns = 12;
gform.columnClasses = _.map(['','10','20','25','33','40','50','60','66','75','80','90','100'],function(item){return 'column-'+item+' column'})
gform.prototype.opts.suffix = ""

gform.handleError = function(field){
    field.el.querySelector('small').innerHTML = field.errors;
}