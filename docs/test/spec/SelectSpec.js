describe('Select Input', function () {
	// var myforman;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');

    myforman = new forman({fields:[{label:'test', type: 'select', value: 'hello', options: ['hello', 'stuff'] }]}, '#forman')//.on('change:test', triggerOnChange);
//		myforman = new forman({fields:{test:{value: 'hello'}}}, $('#forman'))
	});

  // afterEach(function() {
  //   myforman.destroy();
  // });

	it('should create a select input correctly', function () {
    expect(document.querySelector('select[name=test]')).not.toBe(null);
	});

	it('should return expected json', function () {
		expect(myforman.toJSON()).toEqual({test: 'hello'});
	});

	// it('should return expected value', function () {
	// 	expect(myforman.toJSON('test')).toEqual('hello');
	// });

  it('sets value with set', function () {
		expect(myforman.toJSON('test')).toEqual('hello');
    myforman.set('test','stuff');
    expect(myforman.toJSON().test).toEqual('stuff');
  });

	it('sets value with set - get value from name', function () {
		expect(myforman.toJSON('test')).toEqual('hello');
    myforman.set('test','stuff');
		expect(myforman.toJSON('test')).toEqual('stuff');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(myforman.toJSON('test')).toEqual('hello');
    myforman.set('test','stuff');
    expect(myforman.toJSON()).toEqual({test: 'stuff'});
  });

  // it('should trigger events', function () {
  //   myforman.fields.test.set('hello');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  //   myforman.fields.test.set('stuff');
  //   expect(triggerOnChange).toHaveBeenCalled();
  // });

  // it('should suppress change event during setValue', function () {
  //   myforman.fields.test.setValue('stuff');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });


  it('should load choices from function', function () {

    // myforman.destroy();
    myforman = new forman({fields:{
      Title: {name: 'test', label: 'Label Field', type: 'select', reference: 'name',key: 'label', options: function(){
        return [{"label":"Title","name":"second"},{"label":"Top Right","name":"topright"},{"label":"Bottom Right","name":"bottomright"},{"label":"Bottom Left","name":"bottomleft"},{"label":"Top Left","name":"topleft"}];
      }}}
    }, '#forman');
        
    expect(document.querySelector('select[name=test] option')).not.toBe(null);

  });

});