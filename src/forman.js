var forman = function(target, data){
    document.querySelector(target).innerHTML = forman.stencils.container(_.assignIn({legend: ''}, data));
    this.form = document.querySelector(target + ' form')
    this.fields = _.map(data.fields, function(field, i) {

        return _.assignIn({
            name: (field.label||'').toLowerCase().split(' ').join('_'), 
            id: forman.getUID(), 
            type: 'text', 
            extends: 'basic', 
            label: field.name, 
            value: data.attributes[field.name] || field.default
        }, field, forman.processOptions(field))
    })

    _.each(this.fields, function(field){
        form.innerHTML +=  (forman.stencils[field.type]||forman.stencils.text)(field);
    }.bind(this))
    
    var toJSON = function() {
        var obj = {};
        _.each(this.fields, function(field) {
            obj[field.name] = form.querySelector('[name="'+field.name+'"]').value;
        }.bind(this))
        return obj;
    }

  return {
    toJSON: toJSON.bind(this)
  }
}
forman.processOptions = function(field) {
    field = _.assignIn({label_key: 'label', value_key: 'value', options: []}, field);

	// If max is set on the field, assume a number set is desired. 
	// min defaults to 0 and the step defaults to 1.
	if(typeof field.max !== 'undefined') {
		field.min = (field.min || 0);
        var i = field.min;
        while(i <= field.max) {
            field.options.push(i.toString());
            i=i+(field.step || 1)
        }
	}

    if(typeof field.default !== 'undefined' && field.options[0] !== field.default) {
		field.options.unshift(field.default);
	}
    field.options =  _.map(field.options, function(item, i){
        if(typeof item === 'string' || typeof item === 'number') {
            item = {label: item};
           	if(this.value_key !== 'index'){
				item.value = item.label;
            }
        }
        return _.assignIn({label: item[field.label_key], value: item[field.value_key] || i }, item);
    }.bind(field))
    
    return field;
}



var processOpts = function(item, object) {




	if(typeof item.options !== 'undefined' && item.options.length > 0) {
		var set = false;
		for ( var o in item.options ) {
			var cOpt = item.options[o];

			if(typeof cOpt === 'string' || typeof cOpt === 'number') {
				cOpt = {label: cOpt};
				if(item.value_key !== 'index'){
					cOpt.value = cOpt.label;
				}
			}

			if(typeof item.value_key !== 'undefined' && item.value_key !== ''){
				if(item.value_key === 'index'){
					cOpt.value = o;
				}else{
					cOpt.value = cOpt[item.value_key];
				}
			}
			if(typeof cOpt.value === 'undefined'){
				cOpt.value = cOpt.id;
			}

			if(typeof item.label_key !== 'undefined' && item.label_key !== ''){
				cOpt.label = cOpt[item.label_key];
			}
			
			if(typeof cOpt.label === 'undefined'){
				cOpt.label = cOpt.label || cOpt.name || cOpt.title;
			}


			item.options[o] = cOpt;//$.extend({label: cOpt.name, value: o}, {label: cOpt[(item.label_key || 'title')], value: cOpt[(item.value_key || 'id')]}, cOpt);

			//if(!set) {
				if(typeof item.value !== 'undefined' && item.value !== '') {
					if(!$.isArray(item.value)) {
						item.options[o].selected = (cOpt.value == item.value);
					} else {
						item.options[o].selected = ($.inArray(cOpt.value, item.value) > -1);
					}
				}
				// else {
				// 	item.options[o].selected = true;
				// 	item.value = item.options[o].value;
				// }
				// set = item.options[o].selected;
			// } else {
			// 	item.options[o].selected = false;
			// }
		}
	}
	return item;
}


forman.counter = 0;
forman.getUID = function() {
    return 'f' + (forman.counter++);
};
forman.stencils = {
    container: _.template('<div><legend for="<%= name %>"><%= legend %></legend> <form></form></div>'),
    text: _.template('<div><label for="<%= name %>"><%= label %></label> <input name="<%= name %>" type="<%=type%>" value="<%=value%>" id="<%=id%>" /></div>'),
    select: _.template('<div><label for="<%=name%>"><%= label %></label> <select name="<%= name %>" value="<%=value%>" id="<%=id%>" /><% _.forEach(options, function(option) { %><option value="<%- option.value %>"><%- option.label %></option><% }); %></select></div>'),
    radio: _.template('<div><label><%= label %></label> <% _.forEach(options, function(option) { %><label><input name="<%=name%>" value="<%=option.value%>" type="radio"><%=option.label%></label><% }); %> </div>')
};