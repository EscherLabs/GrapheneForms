carbon.stencils = {
    _container: `<div class="carbon">
        <form>
            <legend for="{{name}}"><h4>{{legend}}</h4></legend>
        </form>
    </div>`,
    text: `<div class="row">
        {{>_label}}
        <input class="six columns" name="{{name}}" type="{{type}}" value="{{value}}" id="{{id}}" />
        {{>_error}}
        {{>actions}}       
    </div>`,    
    hidden: `<div class="row">
        <input name="{{name}}" type="hidden" value="{{value}}" id="{{id}}" />
    </div>`,
    textarea: `<div class="row">
        {{>_label}}
        <textarea class="six columns" name="{{name}}" type="{{type}}" id="{{id}}" />{{value}}</textarea>
        {{>_error}}
        {{>actions}}       
    </div>`,
    select: `<div class="row">
        {{>_label}}    
        <select class="six columns" name="{{name}}" value="{{value}}" id="{{id}}" />
        {{#options}}
        <option {{#selected}} selected=selected {{/selected}} value="{{value}}">{{label}}</option>
        {{/options}}
        </select>
        {{>_error}}
        {{>actions}}       
    </div>`,
    radio: `<div class="row">
        {{>_label}}
        {{#options}}
        <label><input style="margin-right: 5px;" name="{{name}}" {{#selected}} checked=selected {{/checked}}  value="{{value}}" type="radio">{{label}}</label>        
        {{/options}}
        </span>
        {{>_error}}
        {{>actions}}       
    </div>`,
    _fieldset: `<div class="carbon">
        <fieldset name="{{name}}">
            <legend for="{{name}}"><h5>{{label}}</h5></legend><hr>
            {{>actions}}       
        </fieldset>
    </div>`,
    actions: `      
        {{#array}}
        <input style="padding: 0 ;width:38px;" class="carbon-add" type="button" value="+">
        <input style="padding: 0 ;width:38px;" class="carbon-minus" type="button" value="-">
        {{/array}}
    `,
    _label: `      
    <label class="three columns" for="{{name}}">{{label}}{{#validate.required}}{{{owner.opts.required}}}{{/validate.required}}{{owner.opts.suffix}}</label>        
    `,
    _error:`<small style="color:red;display:block; "></small>`,
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
        <fieldset name="{{name}}" {{#isChild}}class="hello there"{{/isChild}}
            <legend for="{{name}}"><h5>{{label}}</h5></legend><hr>
            {{>actions}}       
        </fieldset>
    </div>`
};
carbon.columns = 12;
carbon.columnClasses = _.map(['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'],function(item){return item+' columns'})

carbon.handleError = function(field){
    field.el.querySelector('small').innerHTML = field.errors;
}