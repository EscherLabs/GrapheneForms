describe('Checkbox Input', function () {
  var mygform;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    mygform = new gform({fields:[{name:'test', type: 'checkbox'}]}, '#gform')

    mygform.on('change:test', triggerOnChange);
	});

  afterEach(function() {
    mygform.destroy();
  });

  it('should create a checkbox correctly', function () {
    expect(document.querySelector('input[name=test]')).not.toBe(null);
	});


	it('should return expected json', function () {
  	expect(mygform.toJSON()).toEqual({test: false});
	});

	it('should return expected value', function () {
		expect(mygform.toJSON().test).toEqual(false);
	});

  // it('should return expected value from mapped field', function () {
  //   expect(mygform.find('test').value).toEqual(false);
  // });

	it('sets value with set', function () {
    expect(mygform.toJSON().test).toEqual(false);
		mygform.find('test').set(true);
		expect(mygform.toJSON().test).toEqual(true);
	});

  it('sets value with set - get value from name', function () {
    expect(mygform.toJSON().test).toEqual(false);
    mygform.find('test').set(true);
    expect(mygform.toJSON().test).toEqual(true);
  });

  it('sets value with set', function () {
    expect(mygform.toJSON().test).toEqual(false);
    mygform.find('test').set(true);
    expect(mygform.toJSON()).toEqual({test: true});
  });
 
	// it('sets value with setValue', function () {
  //   expect(mygform.find('test').value).toEqual(false);
	// 	mygform.find('test').setValue(true);
	// 	expect(mygform.find('test').value).toEqual(true);
	// });

  // it('sets value with setValue - get value from name', function () {
  //   expect(mygform.toJSON('test')).toEqual(false);
  //   mygform.find('test').setValue(true);
  //   expect(mygform.toJSON('test')).toEqual(true);
  // });

  // it('sets value with setValue', function () {
  //   expect(mygform.find('test').value).toEqual(false);
  //   mygform.find('test').setValue(true);
  //   expect(mygform.toJSON()).toEqual({test: true});
  // });

  it('should trigger events', function () {
    mygform.find('test').set(false);
    expect(triggerOnChange).not.toHaveBeenCalled();
    mygform.find('test').set(true);
    expect(triggerOnChange).toHaveBeenCalled();
  });

  // it('should suppress change event during setValue', function () {
  //   mygform.find('test').setValue(true);
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });

  // it('should allow alternate truestate', function () {

  //   expect(mygform.toJSON('test')).toEqual(false);

  //   mygform.find('test').setValue(true);
  //   expect(mygform.toJSON()).toEqual({test: true});
  //   mygform.find('test').truestate = 'on';
  //   expect(mygform.toJSON('test')).toEqual('on');

  //   mygform.find('test').setValue('off');
  //   expect(mygform.toJSON('test')).toEqual(false);
    
  //   mygform.find('test').setValue('on');
  //   expect(mygform.find('test').value).toEqual('on');
  //   expect(mygform.toJSON('test')).toEqual('on');

  //   mygform.find('test').set('off');
  //   expect(mygform.toJSON('test')).toEqual(false);

  //   mygform.find('test').set('on');
  //   expect(mygform.toJSON('test')).toEqual('on');
  //   expect(mygform.toJSON()).toEqual({test:'on'});

  // });
});