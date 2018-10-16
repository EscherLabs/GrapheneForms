carbon.stencils = {
    _container: _.template(`<div class="carbon">
        <form>
            <legend for="<%= name %>"><h4><%= legend %></h4></legend>
        </form>
    </div>`),
    text: _.template(`<div class="row">
        <label class="three columns" for="<%= name %>"><%= label %><% if(validate.required){%><%= owner.opts.required%><%}%><%= owner.opts.suffix%></label> 
        <input class="six columns" name="<%= name %>" type="<%=type%>" value="<%=value%>" id="<%=id%>" />
        <small style="color:red;display:block; "></small>
        <%if(array){%><%=carbon.render("actions")%><%}; %>        
    </div>`),    
    hidden: _.template(`<div class="row">
        <input name="<%= name %>" type="hidden" value="<%=value%>" id="<%=id%>" />
    </div>`),
    textarea: _.template(`<div class="row">
        <label class="three columns" for="<%= name %>"><%= label %><% if(validate.required){%><%= owner.opts.required%><%}%><%= owner.opts.suffix%></label> 
        <textarea class="six columns" name="<%= name %>" type="<%=type%>" id="<%=id%>" /><%=value%></textarea>
        <small style="color:red;display:block; "></small>
        <%if(array){%><%=carbon.render("actions")%><%}; %>        
    </div>`),
    select: _.template(`<div class="row">
        <label class="three columns" for="<%=name%>"><%= label %><% if(validate.required){%><%= owner.opts.required%><%}%><%= owner.opts.suffix%></label>
        <% if(options || true){%> <select class="six columns" name="<%= name %>" value="<%=value%>" id="<%=id%>" /><% _.forEach(options, function(option) { %><option <%if(option.selected){%> selected=selected <%}%>value="<%- option.value %>"><%- option.label %></option><% }); %></select><%}%>
        <small style="color:red;display:block; "></small>
        <%if(array){%><%=carbon.render("actions")%><%}; %>        
    </div>`),
    radio: _.template(`<div class="row">
        <label class="three columns"><%= label %><% if(validate.required){%><%= owner.opts.required%><%}%><%= owner.opts.suffix%></label><span class="six columns">
        <% if(options){ _.forEach(options, function(option) { %><label><input style="margin-right: 5px;" name="<%=name%>" value="<%=option.value%>" type="radio"><%=option.label%></label><% })}else{%>hello<%}; %>
        </span>
        <small style="color:red;display:block; "></small>
        <%if(array){%><%=carbon.render("actions")%><%}; %>        
    </div>`),
    _fieldset: _.template(`<div class="carbon">
        <fieldset name="<%= name %>">
            <legend for="<%= name %>"><h5><%= label %></h5></legend><hr>
            <%if(array){%><%=carbon.render("actions")%><%}; %>        
        </fieldset>
    </div>`),
    actions: _.template(`          
        <input style="padding: 0 ;width:38px;" class="carbon-add" type="button" value="+">
        <input style="padding: 0 ;width:38px;" class="carbon-minus" type="button" value="-">
    `),
    tabs_container: _.template(`<div class="carbon">
    <ul class="nav nav-tabs" style="margin-bottom:15px">
    <% _.forEach(fields, function(field) { %> 
        <% if(field.section){%><li>
            <a href="#tab<%=field.index%>" data-toggle="tab"><%=field.label%></a>
        </li>
        <%}%><% }); %>
    </ul>
    <form>
        <legend for="<%= name %>"><h4><%= legend %></h4></legend>
    </form>
    </div>`),
    tabs_fieldset: _.template(`<div class="carbon">
        <fieldset name="<%= name %>" <%if(!isChild){ %>class="hello there"<% }; %>>
            <legend for="<%= name %>"><h5><%= label %></h5></legend><hr>
            <%if(array){%><%=carbon.render("actions")%><%}; %>        
        </fieldset>
    </div>`)
};
carbon.columns = 12;
carbon.columnClasses = {
    1:'one columns',
    2:'two columns',
    3:'three columns',
    4:'four columns',
    5:'five columns',
    6:'six columns',
    7:'seven columns',
    8:'eight columns',
    9:'nine columns',
    10:'ten columns',
    11:'eleven columns',
    12:'twelve columns'
}
carbon.handleError = function(field){
    field.el.querySelector('small').innerHTML = field.errors;
}

carbon.render = function(template, options){
    if(template == 'tabs'){debugger;}
    return (carbon.stencils[template||'text'] || carbon.stencils['text'])(options || {});
}
carbon.processString = function(string,options){
    return _.template(string)(options)
}