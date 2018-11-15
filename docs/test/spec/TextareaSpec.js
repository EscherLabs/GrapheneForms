describe('Textarea', function () {
	var mygform;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    mygform = new gform({fields:[{name:'test',value: 'hello', type: 'textarea'}]}, '#gform')
	});

  afterEach(function() {
    mygform.destroy();
  });

	it('should create a textarea correctly', function () {
		expect(document.querySelector('textarea[name=test]')).toBeDefined();
	});

	it('should return expected json', function () {
		expect(mygform.toJSON()).toEqual({test: 'hello'});
	});

	it('should return expected value', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
	});

  it('sets value with set', function () {
		expect(mygform.toJSON().test).toEqual('hello');
    mygform.find('test').set('test');
    expect(mygform.find('test').value).toEqual('test');
  });

	it('sets value with set - get value from name', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
		mygform.find('test').set('test');
		expect(mygform.toJSON('test')).toEqual('test');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
    mygform.find('test').set('test');
    expect(mygform.toJSON()).toEqual({test: 'test'});
  });

	// it('sets value with setValue', function () {
	// 	expect(mygform.toJSON('test')).toEqual('hello');
	// 	mygform.find('test').setValue('test');
	// 	expect(mygform.find('test').value).toEqual('test');
	// });

  // it('sets value with setValue - get value from name', function () {
	// 	expect(mygform.toJSON('test')).toEqual('hello');
  //   mygform.find('test').setValue('test');
  //   expect(mygform.toJSON('test')).toEqual('test');
  // })

  // it('sets value with setValue - get value from toJSON', function () {
	// 	expect(mygform.toJSON('test')).toEqual('hello');
  //   mygform.find('test').setValue('test');
  //   expect(mygform.toJSON()).toEqual({test: 'test'});
  // });

  it('should trigger events', function () {
    mygform.sub('change:test', triggerOnChange);

    mygform.find('test').set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    mygform.find('test').set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  // it('should suppress change event during setValue', function () {
  //   mygform.find('test').setValue('test');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });

});