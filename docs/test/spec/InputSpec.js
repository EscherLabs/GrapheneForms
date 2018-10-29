
describe('Text Input', function () {
	var mygform;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    mygform = new gform({fields:[{label: 'test', value: 'hello'}]}, '#gform')
	});

  afterEach(function() {
    mygform.destroy();
  });

	it('should create a text input correctly', function () {
		expect(document.querySelector('input[name=test]')).not.toBe(null);
	});

	it('should return expected json', function () {
		expect(mygform.toJSON()).toEqual({test: 'hello'});
	});

	it('should return expected value', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
	});

  it('sets value with set', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
    // _.find(mygform.fields, {name: 'test'}).set('test');
    mygform.find('test').set('test');
		expect(mygform.toJSON().test).toEqual('test');
  });

	it('sets value with set - get value from name', function () {
		expect(mygform.toJSON('test')).toEqual('hello')
    mygform.find('test').set('test');
		expect(mygform.toJSON('test')).toEqual('test');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
    mygform.set('test','test');
    expect(mygform.toJSON()).toEqual({test: 'test'});
  });

  it('should trigger events', function () {
    mygform.on('change', triggerOnChange);
    mygform.find('test').set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    mygform.find('test').set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  it('should trigger field events', function () {
    mygform.on('change:test', triggerOnChange);
    mygform.find('test').set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    mygform.find('test').set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  // it('should suppress change event during setValue', function () {
  //   mygform.fields.test.setValue('test');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });


});