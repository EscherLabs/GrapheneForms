gform.types.enable = _.extend({}, gform.types['input'], gform.types['bool'],{
	defaults:{options:[false, true],format:{label:''}},
	render: function() {
	  this.value = (!!this.value);
	  if(typeof this.mapOptions == 'undefined'){

		this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
		this.mapOptions.on('change',function(){
			this.options = this.mapOptions.getobject()
			this.update();
		}.bind(this))
	  }
	  this.options = this.mapOptions.getobject()

		this.selected = (this.value == this.options[1].value);
		return gform.render('switch', this);
	}
} );

gform.types['selectObject']   = _.extend({}, gform.types['input'], gform.types['collection'],{
	defaults:{format:{label: '{{{label}}}', value: function(item){
		return item.value;
	}}},//'{{{value}}}{{^value}}false{{/value}}'}},
    render: function() {
		debugger;
		if(this.value !== false){
			this.value = this.value||(this.options[0]||{value:""}).value
		}else{
			debugger;
		}
		if(typeof this.value == 'object'){
			this.value = 'object';
		}
		
        if(typeof this.mapOptions == 'undefined'){
            this.mapOptions = new gform.mapOptions(this, this.value, 0, this.owner.collections)
            this.mapOptions.on('change', function(){
                this.options = this.mapOptions.getobject();
                this.update();
            }.bind(this))
        }
		this.options = this.mapOptions.getobject()
		// debugger;

        if(typeof this.placeholder == 'string'){
            this.options.unshift({label:this.placeholder, value:'',editable:false,visible:false,selected:true})
        }
        return gform.render('select', this);
	},
	// get: function() {
	// 	// var value = this.el.querySelector('select').value;
	// 	// value = _.find(this.options,{value:value}).data.value

	// 	var value = this.el.querySelector('select').value;
	// 	value = _.find(this.options,{index:value}).value

	// 	if(this.multiple){
	// 	  value = _.transform(this.el.querySelector('select').options,function(orig,opt){if(opt.selected){orig.push(opt.value)}},[])
	// 	}
	// 	return value;
	// }
});

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

gformEditor = function(container){
	return function(){
		var formConfig = {
			// sections: 'tab'
			name:"editor",
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
		// for(var i in gform.instances){
		// 	gform.instances[i].destroy();
		// }
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
		{type: 'number', label: 'Size', name: 'size',min:1,show:[{name:"type",value:['textarea'],type:"matches"}]},
		{type: 'select', label: 'Width',value:12, name: 'columns',min:1,max:12,format:{label:"{{value}} Column(s)"} },
		{type: 'enable', label: 'Allow duplication', name: 'array', show:[{name:"type",value:['output'],type:"not_matches"}]},
		
		{type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
			{type: 'number', label: 'Minimum', name: 'min',value:1},
			{type: 'number', label: 'Maximum', name: 'max',placeholder:5}
		]},

		
		
		{type: 'selectObject',columns:12, label:"Show",name:"show",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Edit',value:'edit'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"show",fields:myconditions,array:true,show:[{name:"show",value:['object'],type:"matches"}]},

		{type: 'selectObject',columns:12, label:"Edit",name:"edit",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"edit",fields:myconditions,array:true,show:[{name:"edit",value:['object'],type:"matches"}]},

		{type: 'selectObject',columns:12, label:"Parse",name:"parse",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"parse",fields:myconditions,array:true,show:[{name:"parse",value:['object'],type:"matches"}]},

		{type: 'selectObject',columns:12, label:"Required",name:"required",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"required",fields:myconditions,array:true,show:[{name:"required",value:['object'],type:"matches"}]},

		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Validate{{/index}}",name:"validate",fields:[
			{name:'type',label:'Type',type:'select',options:['none','matches','date','valid_url','valid_email','length','numeric']},
			{name:'name',label:"Name",show:[{name:"type",value:['matches'],type:"matches"}]},
			{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'selectObject',value:false,columns:12, label:"Apply",name:"required",options:		
				[{label:'Always',value:true},{label:"Conditions",value:"object"}]
			},
			{type: 'fieldset',columns:11,offset:1, label:"{{index}}{{^index}}Conditions{{/index}}",name:"conditions",fields:myconditions,array:true,show:[{name:"required",value:['object'],type:"matches"}]}
		],array:true}
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

		var options = get()
		var temp = _.find(options.options,{value: options.value}) || options.options[0]
		if(typeof temp !== 'undefined') {
			temp.selected = true;
		}
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
			{label: 'Scale', value: 'scale'},
			{label: 'Range', value: 'range'},
			{label: 'Grid', value: 'grid'},
		]},
		{type: 'text', required: true, title: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'text', label: 'Placeholder', name: 'placeholder'},
		{type: 'text', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:['color','number'],type:"not_matches"}]},
		{type: 'color', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'color',type:"matches"}]},
		// {type: 'date', label: 'Default value', name: 'value',columns:6,show:[{name:"type",value:'date',type:"matches"}]},
		{type: 'number', label: 'Default value', name: 'value',columns:12,show:[{name:"type",value:'number',type:"matches"}]},
		
		{type: 'textarea',columns:12, label: 'Instructions', name: 'help',show:[{name:"type",value:['output'],type:"not_matches"}]},
		{type: 'number', label: 'Limit Selections', name: 'limit',min:1,show:[{name:"type",value:['select','radio'],type:"matches"}]},
		{type: 'number', label: 'Size', name: 'size',min:1,show:[{name:"type",value:['select','radio'],type:"matches"}]},
		{type: 'select', label: 'Width',value:12, name: 'columns',min:1,max:12,format:{label:"{{value}} Column(s)"} },
		{type: 'enable', label: 'Allow duplication', name: 'array', show:[{name:"type",value:['output'],type:"not_matches"}]},
		
		{type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
			{type: 'number', label: 'Minimum', name: 'min',value:1},
			{type: 'number', label: 'Maximum', name: 'max',placeholder:5}
		]},
		
		{type: 'selectObject',value:true,columns:12, label:"Show",name:"show",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Edit',value:'edit'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"show",fields:myconditions,array:true,show:[{name:"show",value:['object'],type:"matches"}]},

		{type: 'selectObject',value:true,columns:12, label:"Edit",name:"edit",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"edit",fields:myconditions,array:true,show:[{name:"edit",value:['object'],type:"matches"}]},

		{type: 'selectObject',value:true,columns:12, label:"Parse",name:"parse",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"parse",fields:myconditions,array:true,show:[{name:"parse",value:['object'],type:"matches"}]},

		{type: 'selectObject',value:false,columns:12, label:"Required",name:"required",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"required",fields:myconditions,array:true,show:[{name:"required",value:['object'],type:"matches"}]},

		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Validate{{/index}}",name:"validate",fields:[
			{name:'type',label:'Type',type:'select',options:['none','matches','date','valid_url','valid_email','length','numeric']},
			{name:'name',label:"Name",show:[{name:"type",value:['matches'],type:"matches"}]},
			{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'selectObject',value:false,columns:12, label:"Apply",name:"required",options:		
				[{label:'Always',value:true},{label:"Conditions",value:"object"}]
			},
			{type: 'fieldset',columns:11,offset:1, label:"{{index}}{{^index}}Conditions{{/index}}",name:"conditions",fields:myconditions,array:true,show:[{name:"required",value:['object'],type:"matches"}]}
		],array:true},
		{type: 'fieldset', label: false, array: true, name: 'options', fields: [
			{label: 'Label'},
			{label: 'Value'}
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
    return gform.render(item.type, get());

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
		]},
		{type: 'text', required: true, title: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'checkbox', label: 'Default value', name: 'value'},
		
		{type: 'textarea',columns:12, label: 'Instructions', name: 'help',show:[{name:"type",value:['output'],type:"not_matches"}]},
		{type: 'select', label: 'Width',value:12, name: 'columns',min:1,max:12,format:{label:"{{value}} Column(s)"} },
		{type: 'enable', label: 'Allow duplication', name: 'array', show:[{name:"type",value:['output'],type:"not_matches"}]},
		
		{type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
			{type: 'number', label: 'Minimum', name: 'min',value:1},
			{type: 'number', label: 'Maximum', name: 'max',placeholder:5}
		]},
		
		{type: 'selectObject',value:true,columns:12, label:"Show",name:"show",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Edit',value:'edit'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"show",fields:myconditions,array:true,show:[{name:"show",value:['object'],type:"matches"}]},

		{type: 'selectObject',value:true,columns:12, label:"Edit",name:"edit",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Parse',value:'parse'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"edit",fields:myconditions,array:true,show:[{name:"edit",value:['object'],type:"matches"}]},

		{type: 'selectObject',value:true,columns:12, label:"Parse",name:"parse",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"parse",fields:myconditions,array:true,show:[{name:"parse",value:['object'],type:"matches"}]},

		{type: 'selectObject',value:false,columns:12, label:"Required",name:"required",options:		
			[{label:'True',value:true},{label:'False',value:false},{label:'Edit',value:'edit'},{label:'Show',value:'show'}, {label:"Conditions",value:"object"}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"required",fields:myconditions,array:true,show:[{name:"required",value:['object'],type:"matches"}]},

		{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Validate{{/index}}",name:"validate",fields:[
			{name:'type',label:'Type',type:'select',options:['none','matches','date','valid_url','valid_email','length','numeric']},
			{name:'name',label:"Name",show:[{name:"type",value:['matches'],type:"matches"}]},
			{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
			{type: 'selectObject',value:false,columns:12, label:"Apply",name:"required",options:		
				[{label:'Always',value:true},{label:"Conditions",value:"object"}]
			},
			{type: 'fieldset',columns:11,offset:1, label:"{{index}}{{^index}}Conditions{{/index}}",name:"conditions",fields:myconditions,array:true,show:[{name:"required",value:['object'],type:"matches"}]}
		],array:true},
		{type: 'fieldset', label: false, array: {min:2,max:2}, name: 'options', fields: [
			{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Label','name':'label'},
			{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Value','name':'value'},
		]}
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