var urlParams;

function getItems(item){

      var fields = {};
      for(var i in item){
        if(typeof item[i] === "object"){
          if(item[i] instanceof Array){
              var temp = {fields:{}, label:false};
              temp.fields[i] = {multiple: {duplicate: true}, fields: getItems(item[i][0])};
              fields[i+'_cont'] = temp;
          }else{
            fields[i] = {fields: getItems(item[i])};
          }
        }else{
          if(item[i] === false || item[i] === true){
            fields[i]= {type: 'checkbox'};
          }else if(!isNaN(item[i])){
            fields[i]= {type: 'number'};
          }else{
            fields[i]= {};
          }
        }
      }

  return fields
}
document.addEventListener('DOMContentLoaded', function(){

	editor = ace.edit("editor");
	//	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setTabSize(2);
	editor.getSession().on('change', function(e) {
try {
    var temp = JSON.parse(editor.getValue());

      fields = getItems(temp);
      for(var i in Carbon.instances){
        Carbon.instances[i].destroy();
      }
      console.log(JSON.stringify(fields, undefined, "\t"));
      $('.target').carbon(
      	$.extend({flatten:false,autoFocus: false, actions: false, name: 'myForm', attributes: temp}, {fields:fields}) ).delay('change', function(){
        var json = this.toJSON();
				  $('.result').html("<pre>"+JSON.stringify(json, undefined, "\t")+"</pre>");
			}, true);
    } catch (e) {
        return false;
    }

	});
});
