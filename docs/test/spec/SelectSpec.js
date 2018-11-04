describe('Select Input', function () {
	// var mygform;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');

    mygform = new gform({fields:[{label:'test', type: 'select', value: 'hello', options: ['hello', 'stuff'] }]}, '#gform');
    // mygform.on('change:test', triggerOnChange);
//		mygform = new gform({fields:{test:{value: 'hello'}}}, $('#gform'))
	});

  // afterEach(function() {
  //   mygform.destroy();
  // });

	it('should create a select input correctly', function () {
    expect(document.querySelector('select[name=test]')).not.toBe(null);
	});

	it('should return expected json', function () {
		expect(mygform.toJSON()).toEqual({test: 'hello'});
	});

	// it('should return expected value', function () {
	// 	expect(mygform.toJSON('test')).toEqual('hello');
	// });

  it('sets value with set', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
    mygform.set('test','stuff');
    expect(mygform.toJSON().test).toEqual('stuff');
  });

	it('sets value with set - get value from name', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
    mygform.set('test','stuff');
		expect(mygform.toJSON('test')).toEqual('stuff');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(mygform.toJSON('test')).toEqual('hello');
    mygform.set('test','stuff');
    expect(mygform.toJSON()).toEqual({test: 'stuff'});
  });

  // it('should trigger events', function () {
  //   mygform.fields.test.set('hello');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  //   mygform.fields.test.set('stuff');
  //   expect(triggerOnChange).toHaveBeenCalled();
  // });
  it('should trigger events', function () {
    mygform.on('change', triggerOnChange);
    mygform.find('test').set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    mygform.find('test').set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  // it('should suppress change event during setValue', function () {
  //   mygform.fields.test.setValue('stuff');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });


  it('should load choices from function', function () {

    mygform.destroy();
    mygform = new gform({fields:{
      Title: {name: 'test', label: 'Label Field', type: 'select', options: function(){
        return [{"label":"Title","value":"second"},{"label":"Top Right","name":"topright"},{"label":"Bottom Right","name":"bottomright"},{"label":"Bottom Left","name":"bottomleft"},{"label":"Top Left","name":"topleft"}];
      }}}
    }, '#gform');
    expect(document.querySelector('select[name=test] option')).not.toBe(null);

  });


  it('should load optGroups', function () {

    mygform.destroy();
    mygform = new gform({fields:{
      Title: {name: 'test', label: 'Label Field', type: 'select', options: function(){
        return [{"label":"Title","value":"second"},{"label":"Top Right","name":"topright"},{"label":"Bottom Right","name":"bottomright"},{"label":"Bottom Left","name":"bottomleft"},{"label":"Top Left","name":"topleft"}];
      }}}
    }, '#gform');
    expect(document.querySelector('select[name=test] option')).not.toBe(null);

  });

});