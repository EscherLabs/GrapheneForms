describe('Text Input', function () {
	var mycarbon;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    mycarbon = new carbon({fields:[{label: 'test', value: 'hello'}]}, '#carbon')//.on('change:test', triggerOnChange);
	});

  // afterEach(function() {
  //   mycarbon.destroy();
  // });

	it('should create a text input correctly', function () {
		expect(document.querySelector('input[name=test]')).not.toBe(null);
	});

	it('should return expected json', function () {
		expect(mycarbon.toJSON()).toEqual({test: 'hello'});
	});

	it('should return expected value', function () {
		expect(mycarbon.toJSON('test')).toEqual('hello');
	});

  it('sets value with set', function () {
		expect(mycarbon.toJSON('test')).toEqual('hello');
    // _.find(mycarbon.fields, {name: 'test'}).set('test');
    mycarbon.field('test').set('test');
		expect(mycarbon.toJSON().test).toEqual('test');
  });

	it('sets value with set - get value from name', function () {
		expect(mycarbon.toJSON('test')).toEqual('hello');
    mycarbon.field('test').set('test');
		expect(mycarbon.toJSON('test')).toEqual('test');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(mycarbon.toJSON('test')).toEqual('hello');
    mycarbon.set('test','test');
    expect(mycarbon.toJSON()).toEqual({test: 'test'});
  });

  // it('should trigger events', function () {
  //   mycarbon.fields.test.set('hello');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  //   mycarbon.fields.test.set('test');
  //   expect(triggerOnChange).toHaveBeenCalled();
  // });

  // it('should suppress change event during setValue', function () {
  //   mycarbon.fields.test.setValue('test');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });


});