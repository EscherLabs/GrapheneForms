document.querySelector('#code code').innerHTML = 'var config = '+JSON.stringify(options,null,2);
var mygform = new gform(options, '#form')
mygform.sub('change',function(e){
    if(e.form.validate()){}
        document.querySelector('#result code').classList = "prettyprint"
        document.querySelector('#result code').innerHTML = 'myform.toJSON();<br> => '+JSON.stringify(e.form.toJSON(),null,2);
        PR.prettyPrint();
    
})

mygform.pub('change')