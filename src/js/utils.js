/* Templating  */
gform.m = function (n,t,e,r){var i,o= gform.m,a="";function f(n,t){return n=null!=(n=n[(t=t.pop?t:t.split(".")).shift()])?n:"",0 in t?f(n,t):n}t=Array.isArray(t)?t:t?[t]:[],t=r?0 in t?[]:[1]:t;for(i=0;i<t.length;i++){var s,l="",p=0,g="object"==typeof t[i]?t[i]:{};(g=Object.assign({},e,g))[""]={"":t[i]},n.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,function(n,t,e,r,i,c,u){p?l+=p&&!i||1<p?n:t:(a+=t.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,function(n,t,e,r,i,c){return t?f(g,t):r?f(g,c):i?o(f(g,c),g):e?"":new Option(f(g,c)).innerHTML}),s=c),i?--p||(u=f(g,u),/^f/.test(typeof u)?a+=u.call(g,l,function(n){return o(n,g)}):a+=o(l,u,g,s),l=""):++p})}return a}

gform.render = function(template, options) {
    return gform.renderString(gform.stencils[template || 'text'] || gform.stencils['text'], _.extend({}, gform.stencils, options))    
}
gform.create = function(text) {
    return document.createRange().createContextualFragment(text).firstChild;
}
gform.renderString = function(string,options) {
    return gform.m(string || '', _.extend({math:function(ms,render){
        return math.eval(render(ms), _.omit(this,'toString'))},
        moment:function(name,render) {
            var parts = name.split('|')
            var date=moment(render(parts.shift()));
            return (parts[0] == "fromNow")?date.fromNow():date.format(parts[0])
        }
    },this.methods,options))
}
/* End Templating */

/* Class modifications  */
gform.addClass = function(elem, classes) {
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
        elem.className = _.chain(elem.className).split(/[\s]+/).union(classes.split(' ')).join(' ').value();
    }
};
gform.hasClass = function(elem, classes) {
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
        return  (elem.className.indexOf(classes) !== -1);
    }
};
gform.removeClass = function(elem, classes){
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
        elem.className = _.chain(elem.className).split(/[\s]+/).difference(classes.split(' ')).join(' ').value();
    }
};
gform.toggleClass = function(elem, classes, status){
    if(status){
        gform.addClass(elem,classes)
    }else{
        gform.removeClass(elem,classes)
    }
};
/* End Class modifications  */


gform.ajax = function(options){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {

        if(request.readyState === 4) {
            if(request.status === 200) { 
                options.success(JSON.parse(request.responseText));
            } else {
                // console.log(request.responseText);
                if(typeof options.error == 'function'){options.error(request.responseText)};
            }
        }
    }
    request.open(options.verb || 'GET', options.path);
    request.send();
}



gform.patch = function(object,patch,action){
    if(!_.isArray(patch)){
        patch = [patch];
    }
    return _.reduce(patch,function(original, task){
        if(typeof task.map !== "string"){
            return original;
        }
        var stack = _.toPath(task.map);
        object = original;

        while(stack.length>1){
            var target = stack.shift();
            if(typeof object[target] !== 'object'){
                if(isFinite(stack[0])){
                    // stack[0] = parseInt(stack[0]);
                    if(!_.isArray(object[target])){
                        object[target] = [];
                    }
                }else{
                    object[target] = {};
                }
            }

            object = object[target];
            
        }
        var target = stack.shift()
        if(task.action == "delete"){
            if(_.isArray(object)){
                object.splice(target,1);
            }else{
                delete object[target];
                object = _.compact(object);
            }
        }else{
            if(typeof task.toJSON !== "undefined"){
                object[target] = task.toJSON
            }else{
                object[target] = task.value;
            }
            
        }

        return original;

    },object||{})
  }
  
  _.mixin({
    selectPath: function(object,path){
        var obj = object;
        if(typeof object.toJSON == "function"){
            obj = object.toJSON()
        }else{
            obj = _.extend({},obj)
        }
      return _.reduce(_.toPath(path),function(i,map){
        if(typeof i == 'object' && i !== null){
          return i[map];
        }else{
          return undefined;
        }
      },obj)
    }
  });





gform.rows = {
    add:function(parent){
            var temp = gform.getUID();
            cRow = {};
            cRow.used = 0;
            cRow.ref  = document.createElement("div");
            cRow.ref.setAttribute("id", temp);
            cRow.ref.setAttribute("class", this.options.rowClass);
            cRow.ref.setAttribute("style", "margin-bottom:0;");
            parent.rows[temp] = cRow;
            parent.container.appendChild(cRow.ref);
            return cRow
    },
    remove:function(){

    }
}

gform.eventBus = function(options, owner){
	this.options = options || {owner:'form',item:'field'};
    this.owner = owner||this;
    this.on = function (event, handler, ref) {
        if(typeof event != 'undefined'){

            var events = event.split(' ');
            // if (typeof this.handlers[event] !== 'object') {
            // this.handlers[event] = [];
            // }
            _.each(events,function(ref,event){
                this.handlers[event] = this.handlers[event] ||[];
                if(typeof handler == 'function'){
                    this.handlers[event].push(handler);
                    if(typeof ref == 'object'){
                        ref.push(handler);

                    }
                }else{
                    if(typeof this.owner.methods[handler] == 'function'){
                        this.handlers[event].push(this.owner.methods[handler]);
                    }
                }
            }.bind(this,ref))
        }
		return this.owner;
	}.bind(this);
    if(_.isArray(options.handlers)){
        this.handlers = {};
        _.each(options.handlers,function(item){
            if(item !== null && 'event' in item && 'handler' in item)this.on(item.event, item.handler)
        }.bind(this))
    }else{
        this.handlers = _.extend({},options.handlers);
    }

    _.each(this.handlers,function(a,b,c){
        if(typeof a == 'function'){
            c[b] = [a];
        }else if(typeof a == 'string'){
            if(typeof this[a] == 'function'){
                c[b] = [this[a]];
            }else{
              if(typeof this.owner[a] == 'function'){
                c[b] = [this.owner[a]];
              }else{
                if('methods' in this.owner && typeof this.owner.methods[a] == 'function'){
                  c[b] = [this.owner.methods[a]];
                }else{
                  if(typeof window[a] == 'function'){
                    c[b] = [window[a]];
                  }else{
                    c[b] = null;
                  }
                }
              }
            }
        }
    }.bind(this))

	this.dispatch = function (e,f,a) {
		a = a || {};
		a[this.options.owner] = this.owner;
		if(typeof f !== 'undefined'){
		    a[this.options.item] = f;
		}
        a.default = true;
        a.continue = true;
        a.preventDefault = function(){this.default = false;}.bind(a)
        a.stopPropagation = function(){this.continue = false;}.bind(a)
		var events = [];
		if(typeof e == 'string'){
		    events.push(e)
		}else{events = events.concat(e)}
		_.each(events, function(args,event){
            args.event = event;
            
            var f = function (handler) {
                if(a.continue){
                    if(typeof handler == 'function'){
                        handler.call(owner, args);
                    }
                }
            }.bind(this)
            
            _.each(this.handlers[event], f);
            _.each(this.handlers['*'], f);
		}.bind(this, a))
        return a;
        
	}.bind(this)

}

gform.collectionManager = function(refObject){
    var collections = refObject||{};
    this.eventBus = new gform.eventBus({owner:'manager',item:'collection',handlers:{}}, this)
    
	return {
		add: function(name, data){
            collections[name] = data;
            this.eventBus.dispatch('change',name);
		}.bind(this),
		get: function(name){
            return (typeof name == 'undefined')?collections:collections[name]
		},
		update: function(name, data){
            if(typeof data !== 'undefined'){
                collections[name] = data;
            }
            this.eventBus.dispatch(name,collections[name]);
            this.eventBus.dispatch('change',name);
		}.bind(this),
		on: this.eventBus.on
	}
}

  
gform.VERSION = '0.0.2.0';
gform.i = 0;
gform.getUID = function() {
    return 'f' + (gform.i++);
};
gform.about = function(){
    return _.extend({version:gform.VERSION},gform.THEME,{types:_.keys(gform.types)})
};
