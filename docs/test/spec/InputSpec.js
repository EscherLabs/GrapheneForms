describe('Text Input', function () {
	var myforman;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    myforman = new forman({fields:[{label: 'test', value: 'hello'}]}, '#forman')//.on('change:test', triggerOnChange);
	});

  // afterEach(function() {
  //   myforman.destroy();
  // });

	it('should create a text input correctly', function () {
		expect(document.querySelector('input[name=test]')).not.toBe(null);
	});

	it('should return expected json', function () {
		expect(myforman.toJSON()).toEqual({test: 'hello'});
	});

	it('should return expected value', function () {
		expect(myforman.toJSON('test')).toEqual('hello');
	});

  it('sets value with set', function () {
		expect(myforman.toJSON('test')).toEqual('hello');
    // _.find(myforman.fields, {name: 'test'}).set('test');
    myforman.field('test').set('test');
		expect(myforman.toJSON().test).toEqual('test');
  });

	it('sets value with set - get value from name', function () {
		expect(myforman.toJSON('test')).toEqual('hello');
    myforman.field('test').set('test');
		expect(myforman.toJSON('test')).toEqual('test');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(myforman.toJSON('test')).toEqual('hello');
    myforman.set('test','test');
    expect(myforman.toJSON()).toEqual({test: 'test'});
  });

  // it('should trigger events', function () {
  //   myforman.fields.test.set('hello');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  //   myforman.fields.test.set('test');
  //   expect(triggerOnChange).toHaveBeenCalled();
  // });

  // it('should suppress change event during setValue', function () {
  //   myforman.fields.test.setValue('test');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });


});