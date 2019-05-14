describe('Hidden Input', function () {
	var mygform;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    mygform = new gform({fields:[{name:'test',value: 'hello', type: 'hidden'}]}, '#gform')

    
    // , $('#berry')).on('change:test', triggerOnChange);;
	});

  afterEach(function() {
    mygform.destroy();
  });

	it('should create a hidden input correctly', function () {
    // expect($('input[type=hidden][name=test]')[0]).toBeDefined();
    expect(document.querySelector('input[type=hidden][name=test]')).toBeDefined();

	});

  it('should return expected json', function () {
    expect(mygform.toJSON()).toEqual({test: 'hello'});
  });

  it('should return expected value', function () {
    expect(mygform.toJSON('test')).toEqual('hello');
  });

  it('sets value with set', function () {
    expect(mygform.toJSON()).toEqual({test: 'hello'});
    mygform.find('test').set('test');
    expect(mygform.find('test').value).toEqual('test');
  });
  
  it('sets value with set - get value from name', function () {
    expect(mygform.toJSON()).toEqual({test: 'hello'});
    mygform.find('test').set('test');
    expect(mygform.toJSON('test')).toEqual('test');
  });

  it('sets value with set - get value from form toJSON', function () {
    expect(mygform.toJSON()).toEqual({test: 'hello'});
    mygform.find('test').set('test');
    expect(mygform.toJSON()).toEqual({test: 'test'});
  });

  // it('sets value with setValue', function () {
  //   expect(mygform.toJSON()).toEqual({test: 'hello'});
  //   mygform.find('test').setValue('test');
  //   expect(mygform.find('test').value).toEqual('test');
  // });

  // it('sets value with setValue - get value from form name', function () {
  //   expect(mygform.toJSON()).toEqual({test: 'hello'});
  //   mygform.find('test').setValue('test');
  //   expect(mygform.toJSON('test')).toEqual('test');
  // });

  // it('sets value with setValue - get value from form toJSON', function () {
  //   expect(mygform.toJSON()).toEqual({test: 'hello'});
  //   mygform.find('test').setValue('test');
  //   expect(mygform.toJSON()).toEqual({test: 'test'});
  // });

 it('should trigger events', function () {
    mygform.on('change', triggerOnChange);
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