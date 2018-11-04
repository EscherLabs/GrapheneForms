$('#json, #schema').on('click', function(e){
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view').addClass('hidden');
  $('.view_'+$(e.target).attr('id')).removeClass('hidden');  
  $('.target').removeClass('hidden');

  $('#editor').addClass('hidden');
  setSchema(forms[form]);
});
$('#cobler').on('click', function(e) {
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view, .target, #form').addClass('hidden');
  $('.view_result, .view_source, #editor').removeClass('hidden');

    if(typeof cb === 'undefined'){
      // cb = new cobler({target: '#editor', types: ['form']});

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
        if(typeof forms[form] !== 'undefined' && form !== 'builder'){
          // debugger;
          $.extend(forms[form], {fields: cb.toJSON()[0]});
          // forms[form].fields = cb.toJSON()[0];
        }else{
          // debugger;
          $.extend(forms[form], {fields: cb.toJSON()[0]});
          // forms[form].fields = cb.toJSON()[0];

          $.jStorage.set('form', JSON.stringify(forms[form], undefined, "\t"));
        }
      })

    }

    if(typeof forms[form] !== 'undefined'){
      var temp = $.extend(true, {}, forms[form]);
      for(var i in temp.fields){
        // debugger;
        temp.fields[i] = gform.options(temp.fields[i]);//gform.normalizeItem(, i);
        switch(temp.fields[i].type) {
          case "select":
          case "radio":
            temp.fields[i].widgetType = 'select';
            break;
          case "checkbox":
            temp.fields[i].widgetType = 'checkbox';
            break;
          default:
            temp.fields[i].widgetType = 'textbox';
        }

      }

      
      list.className = list.className.replace('hidden', '');
      cb.collections[0].load(temp.fields);
    }else{
      // cb.load(JSON.parse(($.jStorage.get('form') || "{}")));

      cb.collections[0].load(JSON.parse(($.jStorage.get('form') || "{}")));
    }

});




document.addEventListener('DOMContentLoaded', function(){

  editor = ace.edit("schema_editor");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setTabSize(2);
  editor.getSession().on('change', function(e) {
    try {
      forms[form] = JSON.parse(editor.getValue());

      for(var i in gform.instances){
        gform.instances[i].destroy();
      }
      var temp = new gform(
        $.extend({autoFocus: false, actions: ['save'], name: 'myForm', data: QueryStringToHash(document.location.hash.substr(1) || "") }, forms[form] ) ,'.target')
      temp.on('change', function(){
        debugger;
        $('.result').html("<pre>"+JSON.stringify(this.toJSON(), undefined, "\t")+"</pre>");
      }.bind(temp))
      temp.on('save', function(){
        if(this.validate()) { location.hash = '#'+$.param(this.toJSON());}}
      ).bind(this);
    } catch (e) {
      return false;
    }
  });

  forms['builder'] = JSON.parse(($.jStorage.get('form') || "{}"));
  for(var i in forms['builder']){
    delete forms['builder'][i].widgetType;
  }

  form = (urlParams['demo'] || 'basic');

  setSchema(forms[form])
});


function setSchema(obj){
  forms[form] = obj;
  
  for(var i in forms[form].fields){
    delete forms[form].fields[i].widgetType;
  }
  editor.setValue(JSON.stringify(forms[form], undefined, "\t"));
}


/*utils*/

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();


var QueryStringToHash = function QueryStringToHash  (query) {
  var query_string = {};
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    pair[0] = decodeURIComponent(pair[0]);
    pair[1] = decodeURIComponent((pair[1] || "").split('+').join(' '));
      // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
  return query_string;
};
