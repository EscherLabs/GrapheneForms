//		CoblerJS 0.2.0
//		(c) 2011-2016 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/Cobler

function Cobler(options) {
  var topics = {};
	this.options = options
	this.options.active = this.options.active || 'widget_active';

  options.removed = false;
	//simple event bus with the topics object bound
  this.subscribe = function(topic, listener) {
    if(!topics[topic]) topics[topic] = [];
    topics[topic].push(listener);
  }.bind({topics: topics})
  this.publish = function(topic, data) {
    if(!topics[topic] || topics[topic].length < 1) return;
    topics[topic].forEach(function(listener) {
      listener(data || {});
    });
  }.bind({topics: topics})

  //initialize collections array and then create a collection for each target
	var collections = [];
	for(var i=0; i<options.targets.length; i++){
		addCollection.call(this, options.targets[i], options.items[i]);
	}

	function collection(target, items, cob){
		var sortable;
		function init() {
			if(!cob.options.disabled) {
				target.addEventListener('click', instanceManager.bind(this));
				target.className += ' cobler_container';
				sortable = Sortable.create(target, {
					forceFallback: !!cob.options.fallback,
					group: cob.options.group || 'cb',
					animation: 150,
					onSort: function (/**Event*/evt) {
						if(cob.options.remove) {
								cob.options.removed = items.splice(parseInt(evt.item.dataset.start, 10), 1)[0];
								cob.options.remove = false;
						}else if(evt.from !== evt.to && typeof evt.item.dataset.type === 'undefined'){
							cob.options.remove = true;
						}						
			    },
					onAdd: addOnDrop.bind(this), 
					onUpdate: function (evt) {
						var item = items.splice(parseInt(evt.item.dataset.start, 10), 1)[0];
						items.splice(getNodeIndex(evt.item), 0 , item);
						evt.item.removeAttribute('data-start');
						cob.publish('change', item);
					},
					onStart: function (evt) {
		        evt.item.dataset.start = getNodeIndex(evt.item);  // element index within parent
		    	}
				});
			}
			loadItems.call(this, items);
		}
		function reset(items) {
			target.innerHTML = '';
			items = items || [];
		}
		function addOnDrop(evt){
			var A = evt.item;
			//handle if dragged over target and put back in original
			if(A.parentNode === target){
				var newItem;
			 	if(typeof A.dataset.type !== 'undefined') {
					newItem = new Cobler.types[A.dataset.type](this);
				}else{
					var temp = cob.options.removed.get();
					newItem = new Cobler.types[temp.widgetType](this);
					newItem.set(temp);
					evt.newIndex = getNodeIndex(evt.item);
				}
				var renderedItem = renderItem(newItem);
			 	var a = A.parentNode.replaceChild(renderedItem, A);
				items.splice(evt.newIndex, 0 , newItem);
				if(typeof A.dataset.type !== 'undefined') {
					// debugger;
			 		activate(renderedItem);
			 	}else{
			 		cob.options.removed = false;
			 	}
			}
		}
		function instanceManager(e) {
			var referenceNode = e.target.parentElement.parentElement;
			var classList = e.target.className.split(' ');
			if(classList.indexOf('remove-item') >= 0){
				var olditem = items.splice(getNodeIndex(referenceNode), 1);
				target.removeChild(referenceNode);
			 	cob.publish('change', olditem);
			}else if(classList.indexOf('duplicate-item') >= 0){
				deactivate();
				var index = getNodeIndex(referenceNode);
				addItem.call(this, items[index].get(), index+1);
			}else if(classList.indexOf('edit-item') >= 0){
				activate(referenceNode);
			}else if(e.target.tagName === 'LI' && target.className.indexOf('cobler_select') != -1) {
				deactivate();
				activate(e.target);
			}
		}
		function activate(targetEL) {
			targetEL.className += ' ' + cob.options.active;
			active = getNodeIndex(targetEL);
			cob.publish('activate', items[active]);
			items[active].edit();
			cob.publish('activated', items[active]);
		}
		function update(data, item) {
			var item = item || items[active];
			item.set(data);
			var temp = renderItem(item);
			temp.className += ' ' + cob.options.active;
			var modEL = elementOf(item);
		 	var a = modEL.parentNode.replaceChild(temp, modEL);
		 	cob.publish('change', item);
		}
		
		function deactivate() {
			// if(typeof mygform !== 'undefined'){
			// 	mygform.destroy();
			// 	mygform = undefined;
			// }
			active = null;
			var elems = target.getElementsByClassName(cob.options.active);
			[].forEach.call(elems, function(el) {
			    el.className = el.className.replace(cob.options.active, '');
			});
		}
		function loadItems(obj) {
			deactivate();
			reset(obj);
			items = [];
			for(var i in obj) {
				addItem.call(this, obj[i], false, true);
			}
		}
		function addItem(widgetType, index, silent) {
			if(typeof Cobler.types[widgetType.widgetType || widgetType] === 'undefined') {
				return false;
			}
			index = index || items.length;
			var newItem = new Cobler.types[widgetType.widgetType || widgetType](this)
			if(typeof widgetType !== 'string'){
				newItem.set(widgetType);
			}
			items.splice(index, 0, newItem);
			var renderedItem = renderItem(newItem);
			target.insertBefore(renderedItem, target.getElementsByTagName('LI')[index]);
			if(!silent){
				activate(renderedItem);
				cob.publish('change', newItem)
			}
		}
		function toJSON(obj) {
			var json = [];
			for(var i in items){
				json.push(items[i].toJSON());
			}
			if(obj)return {target: target.dataset.id, items: json};
			return json;
		}
		function toHTML() {
			var temp = '';
			for(var i in items){
				temp += Cobler.types[items[i].widgetType].render(items[i]);
			}
			return temp;
		}
		function destroy(){
			reset();
			if(typeof sortable !== 'undefined') { sortable.destroy(); }
			target.removeEventListener('click', instanceManager);
		}
		function indexOf(item){
			return items.indexOf(item);
		}
		function elementOf(item){
				return target.children[items.indexOf(item)];
			}
		return {
			addItem: addItem,
			toJSON: toJSON,
			toHTML: toHTML,
			deactivate: deactivate,
			clear: reset,
			load: loadItems,
			update: update.bind(this),
			destroy: destroy,
			owner: cob,
			init: init,
			indexOf: indexOf,
			elementOf: elementOf
		}
	}

	function renderItem(item){
		var EL;
		if(options.disabled){
			EL = document.createElement('DIV');
			EL.innerHTML = item.render();
		} else {
			EL = document.createElement('LI');
			EL.innerHTML = templates.itemContainer.render();
			EL.getElementsByClassName('cobler-li-content')[0].innerHTML = item.render();
		}
		return EL;
	}
	function getNodeIndex(node) {
	  var index = 0;
	  while (node = node.previousSibling) {
	    if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
	      index++;
	    }
	  }
	  return index;
	}
	function addCollection(target, item){
		// debugger;
		var newCol = new collection(target, item, this);
		newCol.init();
		collections.push(newCol);
	}
	function addSource(element){
		Sortable.create(element, {
			group: {name: 'cb', pull: 'clone', put: false}, 
			sort: false 
		});
	}
	function applyToEach(func){
		return function(opts){
			var temp = [];
			for(var i in collections) {
				temp.push(collections[i][func].call(null, opts));
			}
			this.publish(func, temp);
			return temp;
		}.bind(this)
	}

	return {
		collections: collections,
		addCollection: addCollection.bind(this),
		addSource: addSource,
		toJSON: applyToEach.call(this, 'toJSON'),
		toHTML: applyToEach.call(this, 'toHTML'),
		clear: applyToEach.call(this, 'clear'),
		deactivate: applyToEach.call(this, 'deactivate'),
		destroy: applyToEach.call(this, 'destroy'),
		on: this.subscribe//,
		//trigger: this.publish.bind(this)
	};
}

Cobler.types = {};


gformEditor = function(container){
	return function(){
		var formConfig = {
			renderer: 'tabs', 
			attributes: this.get(), 
			fields: this.fields,
			autoDestroy: true,
			legend: 'Edit '+ this.get()['widgetType']
		}
		var opts = container.owner.options;
		var events = 'save';
		if(typeof opts.formTarget !== 'undefined' && opts.formTarget.length){
			formConfig.actions = false;
			events = 'change';
		}	
		var mygform = new gform(formConfig, opts.formTarget ||  $(container.elementOf(this)));
		mygform.on(events, function(){
		 	container.update(mygform.toJSON(), this);
		 	mygform.trigger('saved');
		}, this);
		mygform.on('cancel',function(){
		 	container.update(this.get(), this)
		}, this)
	}
}