
			  myconditions=[
				{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
					return !!field.parent.index;
				}}]},
				{label:"Type",name:"type",type:"select",options:[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, 'matches','not_matches','contains','requires','conditions']},
                {label: 'Name',name:"name",show:[{type:'matches',name:"type",value:["matches","not_matches","contains","requires"]}]},
                { label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1},show:[{type:'matches',name:"type",value:["matches","not_matches","contains"]}]},
				{name:'conditions',columns:10,offset:1,type:'fieldset',array:true,show:[{type:'matches',name:"type",value:"conditions"}],fields:[
					{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
						return !!field.parent.index;
					}}]},
					{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires','conditions']},
					{label: 'Name',name:"name"},
                	{ label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1}}
				]},
              ]

gformEditor = function(container){
	return function(){
		var formConfig = {
			// sections: 'tab',
			default:{type:"text",columns:6},
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
		var temp = _.find(formConfig.fields,{name:"name"});
		temp.placeholder =  formConfig.data['label'].toLowerCase().split(' ').join('_');
		var mygform = new gform(formConfig, $(opts.formTarget)[0] ||  $(container.elementOf(this))[0]);
		mygform.on('change:label',function(e){
			// debugger;
			e.form.find('name').update({placeholder:e.field.get().toLowerCase().split(' ').join('_')},true)
		})
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
		{type: 'text', required: true, title: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'text', label: 'Placeholder', name: 'placeholder'},
		{type: 'text', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:['color','number'],type:"not_matches"}]},
		{type: 'color', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'color',type:"matches"}]},
		// {type: 'date', label: 'Default value', name: 'value',columns:6,show:[{name:"type",value:'date',type:"matches"}]},
		{type: 'number', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'number',type:"matches"}]},
		
		{type: 'textarea',columns:12, label: 'Instructions', name: 'help',show:[{name:"type",value:['output'],type:"not_matches"}]},
		{type: 'number', label: 'Limit Length', name: 'limit',min:1},
		{type: 'select', label: 'Width',value:12, name: 'columns',min:1,max:12,format:{label:"{{value}} Column(s)"} },
		{type: 'switch', label: 'Allow duplication', name: 'array', show:[{name:"type",value:['output'],type:"not_matches"}]},
		
		{type: 'fieldset', label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
			{type: 'number', label: 'Minimum', name: 'min',value:1},
			{type: 'number', label: 'Maximum', name: 'max'},
		]},

		

		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Show{{/index}}",name:"show",fields:myconditions,array:true},
		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Edit{{/index}}",name:"edit",fields:myconditions,array:true},
		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Parse{{/index}}",name:"parse",fields:myconditions,array:true},
		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Required{{/index}}",name:"required",fields:myconditions,array:true},
		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Validate{{/index}}",name:"validate",fields:[
			{name:'type',label:'Type',type:'select',options:['none','matches','date','valid_url','valid_email','length','numeric']},
			{name:'name',label:"Name",show:[{name:"type",value:['matches'],type:"matches"}]},
			{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Conditions{{/index}}",name:"conditions",fields:myconditions,array:true},
		],array:true}
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