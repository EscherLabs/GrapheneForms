gform.each = function(func){
    _.each(this.fields, function(field){
        func(field);
        if('fields' in field){
            gform.each.call(field,func);
        }
    })
}
gform.reduce = function(func,object,filter){
    var object = object ||{};
    _.reduce(this.filter(filter,1),function(object, field){
        var temp = func(object,field);

        if('fields' in field){
            temp = gform.reduce.call(field,func,temp,filter);
        }
        return temp;
    },object)
    return object;
}

gform.items = {
    reduce:function(func,object,filter){
        var object = object ||{};
        if(!("items" in this) || !this.items.length)return object;
        _.reduce(gform.items.filter.call(this, filter, 1),function(object, field){
            var temp = func(object,field);
            return temp;
        }, object)
        return object;
    },
    filter:function(search, depth){
        var temp = [];
        if(typeof search == 'string'){
            search = {name: search}
        }
        var depth = (depth||10);
        depth--;
        
        temp = _.reduce( this['items'], (temp,item)=>{
            if(!_.isMatch(item, search)){return temp}
            
                if(item instanceof gform.arrayManager){
                    // if(_.isMatch(item, search)){
                    //     temp.push(item);
                    // }

                    temp =_.reduce(item.instances, function(temp,instance){
                        // if(!_.isMatch(instance, search)){return temp}
                        if(_.isMatch(instance, search)){
                            temp.push(instance);

                            temp = temp.concat(gform.items.filter.call(instance,search,depth))
                        }
                        return temp;

                    },temp)
                }else{
                    if(_.isMatch(item, search)){
                        temp.push(item)
                    }
                }
    
            
            if(!!depth  && ('items' in item /*|| field instanceof gform.arrayManager*/) && item.items.length){
                // if(!_.isMatch(item, search)){return temp}
                // debugger;

                temp = temp.concat(gform.items.filter.call(item, search, depth));
            }
            return temp;
        },temp)
        return temp;
    }

}
// gform.reduceShallow = function(func,object,filter){
//     var object = object ||{};
//     _.reduce(this.filter(filter,1),function(object, field){
//         var temp = func(object,field);
//         return temp;
//     },object)
//     return object;
// }

// gform.reduceItems = function(func,object,filter){
//     var object = object ||{};
//     _.reduce(gform.filterItems.call(this, filter, 1),function(object, field){
//         var temp = func(object,field);
//         return temp;
//     }, object)
//     return object;
// }
// gform.filterItems = function(search, depth){
//     // debugger;
//     var temp = [];
//     if(typeof search == 'string'){
//         search = {name: search}
//     }
//     var depth = (depth||10);
//     depth--;
    
//     temp = _.reduce( this['items'], (temp,item)=>{

//             if(item instanceof gform.arrayManager){
//                 if(_.isMatch(item, search)){
//                     temp.push(item);
//                 }
//                 temp =_.reduce(item.instances, function(temp,instance){
//                     temp = temp.concat(gform.filterItems.call(instance,search,depth))
//                     return temp;
//                 },temp)
//             }else{
//                 if(_.isMatch(item, search)){
//                     temp.push(item)
//                 }
//             }

        
//         if(!!depth  && ('items' in item /*|| field instanceof gform.arrayManager*/) && item.items.length){
//             temp = temp.concat(gform.filterItems.call(item, search, depth));
//         }
//         return temp;
//     },temp)
//     return temp;
// }

gform.find = function(oname,depth){
    var name;
    var temp;
    if(typeof oname == 'string'){
        name = oname.split('.');
        temp = _.find(this.fields, {name: name.shift()})
    }else if(typeof oname == 'number'){
        // temp =this.fields[oname];// _.find(this.fields, {name: name.shift()})
        // name = oname;
    }else if(typeof oname == 'object'){
        return  gform.filter.call(this, oname,depth)[0] || false;
    }
    if(typeof temp !== 'undefined'){
        if('find' in temp){
            if(temp.name == oname || typeof oname == 'number'){
                return temp;
            }
            return temp.find(name.join('.'));
        }else{
            return temp;
        }
    }else{
        if(typeof this.parent !== 'undefined' && typeof this.parent.find == 'function'){
            return this.parent.find(oname);
        }
    }
}
// gform.findByID = function(id){
//     return  gform.filter.call(this, {id:id},10)[0] || false;
// }
gform.filter = function(search,depth){
    var temp = [];
    if(typeof search == 'string'){
        search = {name: search}
    }
    var depth = (depth||10);
    depth--;

    _.each(this['fields'], function(depth,field){
        if(_.isMatch(field, search)){
            temp.push(field)
        }
        if(!!depth && ('fields' in field /*|| field instanceof gform.arrayManager*/)){
            temp = temp.concat(gform.filter.call(field,search,depth));
        }
    }.bind(null,depth))
    return temp;
}
