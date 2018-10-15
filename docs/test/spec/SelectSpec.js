describe('Select Input', function () {
	// var mycarbon;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');

    mycarbon = new carbon({fields:[{label:'test', type: 'select', value: 'hello', options: ['hello', 'stuff'] }]}, '#carbon')//.on('change:test', triggerOnChange);
//		mycarbon = new carbon({fields:{test:{value: 'hello'}}}, $('#carbon'))
	});

  // afterEach(function() {
  //   mycarbon.destroy();
  // });

	it('should create a select input correctly', function () {
    expect(document.querySelector('select[name=test]')).not.toBe(null);
	});

	it('should return expected json', function () {
		expect(mycarbon.toJSON()).toEqual({test: 'hello'});
	});

	// it('should return expected value', function () {
	// 	expect(mycarbon.toJSON('test')).toEqual('hello');
	// });

  it('sets value with set', function () {
		expect(mycarbon.toJSON('test')).toEqual('hello');
    mycarbon.set('test','stuff');
    expect(mycarbon.toJSON().test).toEqual('stuff');
  });

	it('sets value with set - get value from name', function () {
		expect(mycarbon.toJSON('test')).toEqual('hello');
    mycarbon.set('test','stuff');
		expect(mycarbon.toJSON('test')).toEqual('stuff');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(mycarbon.toJSON('test')).toEqual('hello');
    mycarbon.set('test','stuff');
    expect(mycarbon.toJSON()).toEqual({test: 'stuff'});
  });

  // it('should trigger events', function () {
  //   mycarbon.fields.test.set('hello');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  //   mycarbon.fields.test.set('stuff');
  //   expect(triggerOnChange).toHaveBeenCalled();
  // });

  // it('should suppress change event during setValue', function () {
  //   mycarbon.fields.test.setValue('stuff');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });


  it('should load choices from function', function () {

    // mycarbon.destroy();
    mycarbon = new carbon({fields:{
      Title: {name: 'test', label: 'Label Field', type: 'select', reference: 'name',key: 'label', options: function(){
        return [{"label":"Title","name":"second"},{"label":"Top Right","name":"topright"},{"label":"Bottom Right","name":"bottomright"},{"label":"Bottom Left","name":"bottomleft"},{"label":"Top Left","name":"topleft"}];
      }}}
    }, '#carbon');
        
    expect(document.querySelector('select[name=test] option')).not.toBe(null);

  });

});