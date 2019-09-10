// var conditions = {label:'Condition{{#index}} ({{index}}){{/index}}', type: 'fieldset', value:{op:"and"}, array: true, fields: [
// 				{label: false,name:'op',type:"radio",options:['or','and']},
// 				{label:"Type",options:['matches','not_matches','contains','requires','conditions']},
//                 {label: 'Name'},
//                 { label: 'Value{{#index}}({{index}}){{/index}}',columns:6, array: {min:1}},
// 				{name:'conditions',type:'fieldset',array:true,fields:conditions}
//               ]}

// var conditions=[];
			  myconditions=
// [
[
				{label: false,name:'op',type:"radio",options:['or','and']},
				{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires','conditions']},
                {label: 'Name',name:"name"},
                { label: 'Value{{#index}}({{index}}){{/index}}',name:"value",columns:6, array: {min:1}},
				{name:'conditions',type:'fieldset',array:true,show:[{type:'matches',name:"type",value:"conditions"}],fields:[
				{label: false,name:'op',type:"radio",options:['or','and']},
				{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires','conditions']},
                {label: 'Name',name:"name"},
                // { label: 'Value{{#index}}({{index}}){{/index}}',name:"value",columns:6, array: {min:1}},
				// {name:'conditions',type:'fieldset',array:true,fields:conditions}
              ]}
              ]
//     {
//         "op":"and",
//         "type": "matches", //not_matches, contains, requires,conditions
//         "name": "text",
//         "value": [
//             ""
//         ],
//         conditions:[

//         ]
//     }

// ]

gformEditor = function(container){
	return function(){
		var formConfig = {
			// sections: 'tab',
			data: this.get(),
			fields: this.fields,
			autoDestroy: true,
			legend: 'Edit '+ this.get()['widgetType']
		}
		var opts = container.owner.options;
		var events = 'save';
		if(typeof opts.formTarget !== 'undefined' && opts.formTarget.length){
			formConfig.actions = [];
			events = 'change';
		}	
		for(var i in gform.instances){
			gform.instances[i].destroy();
		}
		
		var mygform = new gform(formConfig, $(opts.formTarget)[0] ||  $(container.elementOf(this))[0]);
		mygform.on(events, function(){
			var temp = mygform.toJSON();
			if(typeof temp.basics !== 'undefined'){
				temp = $.extend({},temp.basics,temp.options_c)
			}
		 	container.update(temp, this);
		 	mygform.trigger('saved');
		}.bind(this));
		mygform.on('cancel',function(){
		 	container.update(this.get(), this)
		}.bind(this));
	}
}
Cobler.types.textbox = function(container) {
	function render(){
	// if(item.type == 'textarea'){
    //   return gform.render('textarea', get());
	// }
	//   return gform.render('text', get());
	  
	return gform.render(item.type, get());
	}
	function get() {
		item.widgetType = 'textbox';
		item.editable = true;
		item.type = item.type || 'text';
		return _.extend({},gform.prototype.opts,gform.types[item.type].defaults||{},item);
	}
	function toJSON() {
		return get();
	}
	function set(newItem){
		item = newItem;
	}
	var item = {
		widgetType: 'textbox',
		type: 'text',
		label: 'Label',
		editable: true
	}
	var fields = [
		{type: 'text', required: true, title: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'select', label: 'Display', name: 'type', value: 'text', 'options': [
			{label: 'Single Line', value: 'text'},
			{label: 'Multi-line', value: 'textarea'},
			{label: 'Phone', value: 'tel'},
			{label: 'Url', value: 'url'},
			{label: 'Email', value: 'email'},
			{label: 'Date', value: 'date'},
			{label: 'Number', value: 'number'},
			{label: 'Password', value: 'password'},
			{label: 'Color', value: 'color'},
			{label: 'Output', value: 'output'},
			{label: 'Hidden', value: 'hidden'}
		]},
		{type: 'text', label: 'Placeholder', name: 'placeholder'},
		{type: 'text', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:['color','number'],type:"not_matches"}]},
		{type: 'color', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'color',type:"matches"}]},
		// {type: 'date', label: 'Default value', name: 'value',columns:6,show:[{name:"type",value:'date',type:"matches"}]},
		{type: 'number', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'number',type:"matches"}]},
		
		{type: 'number', label: 'Limit Length', name: 'limit',min:1},
		{type: 'select', label: 'Width',value:12, name: 'columns',min:1,max:12,format:{label:"{{value}} Column(s)"} },
		{type: 'switch', label: 'Allow duplication', name: 'array', columns:6,show:[{name:"type",value:['output'],type:"not_matches"}]},
		{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}]},
		{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}]},


		{type: 'textarea', label: 'Instructions', name: 'help',show:[{name:"type",value:['output'],type:"not_matches"}]},
		// {type: 'checkbox', label: 'Required', name: 'required',show:[{name:"type",value:['output'],type:"not_matches"}]},
		// {type: 'checkbox', label: 'Edit', name: 'edit',show:[{name:"type",value:['output'],type:"not_matches"}]},
		    //      {label:'Show{{#index}} ({{index}}){{/index}}', type: 'fieldset', value:{flavor:"orange"}, array: true, fields: [
            //     {label: 'Flavor'},
            //     // { label: 'Color ({{^index}}0{{/index}}{{index}})', type:'text',columns:6, array: {min:2,max:3}}
            //     { label: 'Color{{#index}} ({{index}}){{/index}}',columns:6, array: {min:2,max:7}}
            //   ]}
		{type: 'fieldset', label:"Show",name:"show",fields:myconditions,array:true},
		{type: 'fieldset', label:"Edit",name:"parse",fields:myconditions,array:true},
		{type: 'fieldset', label:"Parse",name:"parse",fields:myconditions,array:true},
		{type: 'fieldset', label:"Required",name:"required",fields:myconditions,array:true}

		// show
		// edit
		// parse
		// validate	
	]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set
	}
}

Cobler.types.select = function(container) {
	function render() {
		
    return gform.render(item.type, get());
	}
	function get() {		
		item.widgetType = 'select';
		item.enabled = true;
		return item;
	}
	function toJSON() {
		return get();
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'select',
		type: 'select',
		label: 'Label',
		enabled: true
	}
	var fields = [
		{type: 'fieldset', name:'basics', legend: '<i class="fa fa-th"></i> Basics', hideLabel: true, inline: true, fields:[
			{type: 'text', required: true, label: 'Field Label', name: 'label'},
			{type: 'text', label: 'Name', name: 'name'},
			{type: 'select', label: 'Display', name: 'type', value: 'select', options: [
				{label: 'Dropdown', value: 'select'},
				{label: 'Radio', value: 'radio'},
				// {label: 'Range', value: 'range'}
			]},
			// {type: 'text', label: 'External List', name: 'options'},

			// {type: 'text', label: 'Label-key', name: 'label_key'},
			// {type: 'text', label: 'Value-key', name: 'value_key'},

			{type: 'text', label: 'Default Value', name: 'value'},
			{type: 'number', label: 'Max', name: 'max'},
			{type: 'number', label: 'Min', name: 'min',show:[{type:'not_matches',name:'max',value:''}]},
			{type: 'number', label: 'Step', name: 'step',show:[{type:'not_matches',name:'max',value:''}]},
			{type: 'textarea', label: 'Instructions', name: 'help'},
			{type: 'checkbox', label: 'Required', name: 'required'},
		]},
		{type: 'fieldset', name:'options_c', legend: '<i class="fa fa-th-list"></i> options', hideLabel: true,  inline: true, fields:[
			{type: 'fieldset', label: false, array: true, name: 'options', fields: [
				{label: 'Label'},
				{label: 'Value'}
			]}
		]}
	]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set
	}
}

Cobler.types.checkbox = function(container) {
	function render() {
		// item.container = 'span';
    return gform.render('checkbox', get());

	}
	function get() {
		item.widgetType = 'checkbox';
		item.enabled = true;

		item.type = 'checkbox';
		return item;
	}
	function toJSON() {
		return  _.transform(get(),function(r,v) {_.extend(r,v)},{});//get();
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'checkbox',
		type: 'checkbox',
		label: 'Label',
		enabled: true
	}
	var fields = [
		{type: 'text', required: true, label: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'checkbox', label: 'Default Value', name: 'value'},
		{type: 'textarea', label: 'Instructions', name: 'help'},
		{type: 'checkbox', label: 'Required', name: 'required'},
	]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set,
	}
}

Cobler.types.fieldset = function(container) {
	function render() {
		var temp = get();
		temp.item = {legend : temp.legend};
    return gform.render('gform_base_fieldset', get());
	}
	function get() {
		item.widgetType = 'fieldset';
		item.enabled = true;

		item.type = 'fieldset';
		return item;
	}
	function toJSON() {
		return get();
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'fieldset',
		type: 'fieldset',
		legend: 'Label',
		name: 'f1',
		duplicate: false
	}
	var fields = [
		{type: 'text', required: true, label: 'Fieldset Legend', name: 'legend'},
		{type: 'text', required: true, label: 'Name', name: 'name'},
		{type: 'checkbox', label: 'Duplicate', name: 'duplicate'},
	]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set,
	}
}