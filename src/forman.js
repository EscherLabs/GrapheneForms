var forman = function(target, data){
    var container = document.querySelector(target)

    container.innerHTML = '';
    _.each(data.fields, function(field,i) {
        data.fields[i] = _.assignIn({
            name: (field.label||'').toLowerCase().split(' ').join('_'), 
            id: forman.getUID(), 
            type: 'text', 
            extends: 'basic', 
            label: field.name, 
            value: data.attributes[field.name] || field.default
        }, field)
        container.innerHTML +=  (forman.stencils[field.type]||forman.stencils['text'])(data.fields[i]);
    })

    var toJSON = function() {
        var obj = {};
        _.map(this.data.fields, function(field){
        obj[field.name] = document.querySelector('[name="'+field.name+'"]').value;
        })
        return obj;
    }
    this.data = data;
    this.container = container;
  return {
    toJSON: toJSON.bind(this)
  }
}

forman.counter = 0;
forman.getUID = function() {
    return 'f' + (forman.counter++);
};
forman.stencils = {
    text: _.template('<div><label for="<%= name %>"><%= label %></label> <input name="<%= name %>" type="<%=type%>" value="<%=value%>" id="<%=id%>" /></div>'),
    select: _.template('<div><label for="<%=name%>"><%= label %></label> <select name="<%= name %>" value="<%=value%>" id="<%=id%>" /><% _.forEach(options, function(option) { %><option value="<%- option.value %>"><%- option.label %></option><% }); %></select></div>'),
    radio: _.template('<div><label><%= label %></label> <% _.forEach(options, function(option) { %><label><input name="<%=name%>" value="<%=option.value%>" type="radio"><%=option.label%></label><% }); %> </div>')
// forman.stencils.checkbox = _.template('<div><label><%= label %></label> <% _.forEach(options, function(option) { %><label><input name="<%=name%>" value="<%=option.value%>" type="radio"><%=option.label%></label><% }); %> </div>');
};