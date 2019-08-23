document.querySelector('#code code').innerHTML = 'var config = '+JSON.stringify(options,null,2);
var myform = new gform(options, '#form')
// $('#form').html(myform.toString())
myform.on('input',function(e){
    if(e.form.validate()){}
        document.querySelector('#result code').classList = "prettyprint"
        document.querySelector('#result code').innerHTML = 'myform.get();<br> => '+JSON.stringify(e.form,null,2);
        PR.prettyPrint();
})

myform.trigger('input')