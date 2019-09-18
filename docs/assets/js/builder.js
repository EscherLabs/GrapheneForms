
renderBuilder = function(){
  $('.target').html('<div data-map="" class="btn btn-primary">Main</div>')
  var form = myform;
  var map = "";
  _.each(path,function(p){
    form = _.find(form.fields,{name:p})
    map += form.name+',';
    $('.target').append(' <a class="fa fa-arrow-right"> </a><div data-map="'+map+'" class="btn btn-default">'+form.label+'</div>')
  })
  $('.target').append('<hr>')
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
      if(typeof gform.instances.editor !== 'undefined'){
        gform.instances.editor.destroy();
      }
    })
    document.getElementById('sortableList').addEventListener('click', function(e) {
      cb.collections[0].addItem(e.target.dataset.type);
    })
    cb.on("change", function(){
      var workingForm = myform;
      // if(path != []){
        _.each(path,function(p){
          workingForm = _.find(workingForm.fields,{name:p})
        })
      // }
      workingForm.fields = cb.toJSON()[0];
      
      $.jStorage.set('form', JSON.stringify(myform, undefined, "\t"));
    })
    cb.on('remove', function(e){
      if(typeof gform.instances.editor !== 'undefined' && gform.instances.editor.options.cobler == e[0]){
        cb.deactivate();
      }
    });
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
          case "fieldset":
          case "grid":
            temp.fields[i].widgetType = 'fieldset';
            break;
        default:
          temp.fields[i].widgetType = 'textbox';
      }
    }
    
    list.className = list.className.replace('hidden', '');
    cb.collections[0].load(temp.fields);
  }



}

$('#cobler').on('click', function(e) {
  path = [];
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view, #form').addClass('hidden');
  $('.view_source').removeClass('hidden');
  renderBuilder();
});


$('.target').on('click','[data-map]', function(e) {
path = _.compact(e.currentTarget.dataset.map.split(','));
cb.deactivate();
renderBuilder()
});



document.addEventListener('DOMContentLoaded', function(){
  myform = JSON.parse(($.jStorage.get('form') || "{}"));

  $('#cobler').click();
});





