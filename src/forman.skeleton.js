forman.stencils = {
    container: _.template('<div class="forman"><form><legend for="<%= name %>"><h4><%= legend %></h4></legend></form></div>'),
    text: _.template('<div class="row"><label class="three columns" for="<%= name %>"><%= label %><% if(validate.required){%><%= owner.opts.required%><%}%><%= owner.opts.suffix%></label> <input class="six columns" name="<%= name %>" type="<%=type%>" value="<%=value%>" id="<%=id%>" /><small style="color:red;display:block; "><% if(!valid){%> <%=errors %> <%}%></small><%if(array){%> <input style="padding: 0 ;width:38px;" class="forman-add" type="button" value="+"><input style="padding: 0 ;width:38px;" class="forman-minus" type="button" value="-"><%}; %></div>'),
    select: _.template('<div class="row"><label class="three columns" for="<%=name%>"><%= label %><% if(validate.required){%><%= owner.opts.required%><%}%><%= owner.opts.suffix%></label><% if(options || true){%> <select class="six columns" name="<%= name %>" value="<%=value%>" id="<%=id%>" /><% _.forEach(options, function(option) { %><option <%if(option.selected){%> selected=selected <%}%>value="<%- option.value %>"><%- option.label %></option><% }); %></select><%}%><small style="color:red;display:block; "><% if(!valid){%> <%=errors %> <%}%></small><%if(array){%> <input class="forman-add" style="padding: 0 ;width:38px;" type="button" value="+"><input class="forman-minus" style="padding: 0 ;width:38px;" type="button" value="-"><%}; %></div>'),
    radio: _.template('<div class="row"><label class="three columns"><%= label %><% if(validate.required){%><%= owner.opts.required%><%}%><%= owner.opts.suffix%></label> <% if(options){ _.forEach(options, function(option) { %><label><input class="six columns" name="<%=name%>" value="<%=option.value%>" type="radio"><%=option.label%></label><% })}else{%>hello<%}; %><small style="color:red;display:block; "><% if(!valid){%> <%=errors %> <%}%></small><%if(array){%> <input style="padding: 0 ;width:38px;" class="forman-add" type="button" value="+"><input style="padding: 0 ;width:38px;" class="forman-minus" type="button" value="-"><%}; %></div>'),
    fieldset: _.template('<div class="forman"><fieldset name="<%= name %>"><legend for="<%= name %>"><h5><%= label %></h5></legend><hr><%if(array){%> <input style="padding: 0 ;width:38px;" class="forman-add" type="button" value="+"><input style="padding: 0 ;width:38px;" class="forman-minus" type="button" value="-"><%}; %></fieldset></div>')
};
forman.columns = 12;
forman.columnMap = {
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
forman.handleError = function(field){
    // debugger;
    field.el.querySelector('small').innerHTML = field.errors;
}
