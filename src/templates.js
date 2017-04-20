forman.stencils = {
    container: _.template('<div class="forman"><legend for="<%= name %>"><%= legend %></legend> <form></form></div>'),
    text: _.template('<div><label for="<%= name %>"><%= label %></label> <input name="<%= name %>" type="<%=type%>" value="<%=value%>" id="<%=id%>" /></div>'),
    select: _.template('<div><label for="<%=name%>"><%= label %></label> <select name="<%= name %>" value="<%=value%>" id="<%=id%>" /><% _.forEach(options, function(option) { %><option value="<%- option.value %>"><%- option.label %></option><% }); %></select></div>'),
    radio: _.template('<div><label><%= label %></label> <% _.forEach(options, function(option) { %><label><input name="<%=name%>" value="<%=option.value%>" type="radio"><%=option.label%></label><% }); %> </div>')
};