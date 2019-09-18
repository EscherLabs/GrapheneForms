myconditions=[
	{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
		return !!field.parent.index;
	}}]},
	{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires','conditions']},
	{label: 'Name',name:"name",show:[{type:'matches',name:"type",value:["matches","not_matches","contains","requires"]}]},
	{ label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1},show:[{type:'matches',name:"type",value:["matches","not_matches","contains"]}]},
	{name:'conditions',columns:10,offset:1,type:'fieldset',array:true,show:[{type:'matches',name:"type",value:"conditions"}],fields:[
		{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
			return !!field.parent.index;
		}}]},
		{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires','conditions']},
		{label: 'Name',name:"name"},
		{ label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1}}
	]}
]

baseFields = [
	{type: 'text', required: true, title: 'Field Label', name: 'label'},
	{type: 'text', label: 'Name', name: 'name'},
	{type: 'text', label: 'Placeholder', name: 'placeholder',show:[{name:"type",value:['radio','checkbox','switch'],type:"not_matches"}]},
	{type: 'text', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:['color','number','checkbox','switch'],type:"not_matches"}]},
	{type: 'color', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'color',type:"matches"}]},
	// {type: 'date', label: 'Default value', name: 'value',columns:6,show:[{name:"type",value:'date',type:"matches"}]},
	{type: 'number', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'number',type:"matches"}]},
	{type: 'checkbox', label: 'Default value', name: 'value',show:[{type:"matches",name:"type",value:["checkbox","switch"]}]},
	{type: 'textarea',columns:12, label: 'Instructions', name: 'help',show:[{name:"type",value:['output'],type:"not_matches"}]},
	{type: 'number', label: 'Limit Length', name: 'limit',min:1,show:[{name:"type",value:['select','radio'],type:"not_matches"}]},
	{type: 'number', label: 'Limit Selections', name: 'limit',min:1,show:[{name:"type",value:['select','radio'],type:"matches"}]},
	{type: 'number', label: 'Size', name: 'size',min:1,show:[{name:"type",value:['textarea','select','radio'],type:"matches"}]},

	{type: 'select', label: 'Width', value:"12", name: 'columns', min:1, max:12, format:{label:"{{value}} Column(s)"} },
	{type: 'switch', label: 'Allow duplication', name: 'array', show:[{name:"type",value:['output'],type:"not_matches"}]},
	{type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
		{type: 'number', label: 'Minimum', name: 'min',value:1,placeholder:1},
		{type: 'number', label: 'Maximum', name: 'max',placeholder:5}
	]}
]

baseConditions = [
	{type: 'select',other:true, columns:12, label:"Show", value:true, name:"show",options:		
		[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Edit',value:'edit'}, {label:"Conditions",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"show",fields:myconditions,array:true,show:[{name:"show",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:"Edit", value:true,name:"edit",options:		
		[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Show',value:'show'}, {label:"Conditions",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"edit",fields:myconditions,array:true,show:[{name:"edit",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:"Parse", value:'show',name:"parse",options:		
		[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"parse",fields:myconditions,array:true,show:[{name:"parse",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:"Required", value:false, name:"required",options:		
		[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}", name:"required", fields:myconditions, array:true, show:[{name:"required",value:['other'], type:"matches"}]},
	{type: 'switch', label: 'Validate', name: 'validate'},
	{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Validations{{/index}}", show:[{name:"validate",value:true,type:"matches"}],name:"validate",fields:[
		{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
			return !!field.parent.index;
		}}]},
		{name:'type',label:'Type',type:'select',options:['none','matches','date','valid_url','valid_email','length','numeric']},
		{name:'name',label:"Name",show:[{name:"type",value:['matches'],type:"matches"}]},
		{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
		{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
		{type: 'select',other:true,value:true,columns:12, label:"Apply",name:"conditions", show:[{name:"type",value:['none'],type:"not_matches"}], options:		
			[{label:'Always',value:true},{label:"Conditionally",value:"other"}]
		},
		{type: 'fieldset',columns:11,offset:1, label:"{{index}}{{^index}}Conditions{{/index}}",name:"conditions",fields:myconditions,array:true,show:[{name:"conditions",value:['other'],type:"matches"}]}
	],array:true}
]


gformEditor = function(container){
	return function(){
		var formConfig = {
			// sections: 'tab'
			name:"editor",
			default:{type:"text",columns:6},
			data: this.get(),
			fields: this.fields,
			autoDestroy: true,
			legend: 'Edit '+ this.get()['widgetType'],
			cobler:this
		}
		var opts = container.owner.options;
		var events = 'save';
		if(typeof opts.formTarget !== 'undefined' && opts.formTarget.length){
			formConfig.actions = [];
			events = 'change';
		}	

		if(typeof gform.instances.editor !== 'undefined'){
			gform.instances.editor.destroy();
		}
		
		var temp = _.find(formConfig.fields,{name:"name"});
		temp.placeholder =  formConfig.data['label'].toLowerCase().split(' ').join('_');
		var mygform = new gform(formConfig, $(opts.formTarget)[0] ||  $(container.elementOf(this))[0]);
		mygform.on('change:label',function(e){
			// e.form.find('name').update({placeholder:e.field.get().toLowerCase().split(' ').join('_')},true)
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
		mygform.on('manage',function(e){
			path.push(e.form.get('name'));
			cb.deactivate();
			renderBuilder()
		})
	}
}
Cobler.types.textbox = function(container) {
	function render(){
	var data = get();
	if(item.type == 'output'){
		data.display = gform.renderString((data.format|| {}).value||'{{{value}}}', data);
    //   return gform.render('textarea', get());
	}
	//   return gform.render('text', get());

	return gform.render(item.type, data);
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
	var fields = [{type: 'select', label: 'Display', name: 'type', value: 'text', 'options': [
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
	]}].concat(baseFields, baseConditions)
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

		var options = get()
		var temp = _.find(options.options,{value: options.value}) || (options.options||[])[0]
		if(typeof temp !== 'undefined') {
			temp.selected = true;
		}
		options.multiple = (options.limit>1);
		
		return gform.render(item.type, options);
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
		{type: 'select', label: 'Display', name: 'type', value: 'text', 'options': [
			{label: 'Dropdown', value: 'select'},
			{label: 'Radio', value: 'radio'},
			// {label: 'Scale', value: 'scale'},
			{label: 'Range', value: 'range'},
			// {label: 'Grid', value: 'grid'},
		]}
	].concat(baseFields,baseConditions,[{type: 'fieldset', label: false, array: true, name: 'options', fields: [
		{label: 'Label'},
		{label: 'Value'}
	]}])

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
	
	var options = get();
	// debugger;
	(_.defaults(options.options,[{value:false},{value:true}]) ) [options.value?1:0].selected = true;
	return gform.render(item.type, options);

	}
	function get() {
		item.widgetType = 'checkbox';
		item.enabled = true;

		// item.type = 'checkbox';
		return item;
	}
	function toJSON() {

		return get();
		// return  _.transform(get(),function(r,v) {_.extend(r,v)},{});//get();
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'checkbox',
		type: 'checkbox',
		label: 'Label',
		editable: true
	}
	var fields = [
		{type: 'select', label: 'Display', name: 'type', value: 'text', 'options': [
			{label: 'Checkbox', value: 'checkbox'},
			{label: 'Switch', value: 'switch'}
		]}
	].concat(baseFields,baseConditions,[{type: 'fieldset', label: false, array: {min:2,max:2}, name: 'options', fields: [
		{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Label','name':'label'},
		{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Value','name':'value'},
	]}])
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
    	return gform.render('_fieldset', get());
	}
	function get() {
		item.widgetType = 'fieldset';
		item.enabled = true;
		item.type = 'fieldset';

		item.fields = item.fields ||[];
		return item;
	}
	function toJSON() {
		return get();
	}
	function set(newItem) {
		var fields = item.fields||newItem.fields;
		item = newItem;
		item.fields = fields;
	}
	var item = {
		widgetType: 'fieldset',
		type: 'fieldset',
		label: 'Label'
	}
	var fields = [
		{type: 'text', required: true, label: 'Fieldset Legend', name: 'label'},
		{type: 'text', required: true, label: 'Name', name: 'name'},
		{type: 'switch', label: 'Allow duplication', name: 'array', show:[{name:"type",value:['output'],type:"not_matches"}]},
		{type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
			{type: 'number', label: 'Minimum', name: 'min',value:1,placeholder:1},
			{type: 'number', label: 'Maximum', name: 'max',placeholder:5}
		]},
		{type:"button",label:"Manage Fields",action:"manage"}
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