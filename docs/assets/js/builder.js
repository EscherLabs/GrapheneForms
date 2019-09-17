$('#cobler').on('click', function(e) {
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view, #form').addClass('hidden');
  $('.view_source').removeClass('hidden');

    if(typeof cb === 'undefined'){

      cb = new Cobler({formTarget:$('#form') ,disabled: false, targets: [document.getElementById('editor')],items:[[]]})
      list = document.getElementById('sortableList');
      cb.addSource(list);
      cb.on('activate', function(){
        if(list.className.indexOf('hidden') == -1){
          list.className += ' hidden';
        }
        $('#form').removeClass('hidden');
      })
      cb.on('deactivate', function(){
        list.className = list.className.replace('hidden', '');
        $('#form').addClass('hidden');
      })
      document.getElementById('sortableList').addEventListener('click', function(e) {
        cb.collections[0].addItem(e.target.dataset.type);
      })
      cb.on("change", function(){
          $.extend(form, {fields: cb.toJSON()[0]});
          $.jStorage.set('form', JSON.stringify(form, undefined, "\t"));
          // var testForm = new gform(form)
          // temp = [];
          // gform.each.call(form,function(item){temp.push(item);})
          // testForm.destroy();


          // gform.collections.update('fields', temp);


      })
    }

    if(typeof form !== 'undefined'){
      var temp = $.extend(true, {}, form);
      for(var i in temp.fields){
        var mapOptions = new gform.mapOptions(temp.fields[i])
        temp.fields[i].options = mapOptions.getobject()
        switch(temp.fields[i].type) {
          case "select":
          case "radio":
          case "scale":
          case "range":
          case "grid":
            temp.fields[i].widgetType = 'select';
            break;
          case "checkbox":
          case "switch":
            temp.fields[i].widgetType = 'checkbox';
            break;
          default:
            temp.fields[i].widgetType = 'textbox';
        }
      }
      
      list.className = list.className.replace('hidden', '');
      cb.collections[0].load(temp.fields);
    }else{
      cb.collections[0].load(JSON.parse(($.jStorage.get('form') || "{}")));

      // var testForm = new gform(JSON.parse(($.jStorage.get('form') || "{}")))
      //     temp = [];
      //     gform.each.call(form,function(item){temp.push(item);})
      //     testForm.destroy();

      // gform.collections.add('fields', _.where(attributes.code.map, {type: "endpoint"}))

    }

});

document.addEventListener('DOMContentLoaded', function(){
form = JSON.parse(($.jStorage.get('form') || "{}"));
  for(var i in form){
    delete form[i].widgetType;
  }
  $('#cobler').click();
});





