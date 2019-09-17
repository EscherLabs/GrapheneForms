describe('Radio Input', function () {
  var mygform;

  beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    mygform = new gform({fields:[{name:'test', type: 'radio', options: ['hello', 'stuff'] }]}, '#gform')

    // mygform = new gform({fields:{test:{type: 'radio', value: 'hello'}}}, $('#berry')).on('change:test', triggerOnChange);
//    mygform = new gform({fields:{test:{value: 'hello'}}}, $('#berry'))
  });

  afterEach(function() {
    mygform.destroy();
  });

  it('should create a radio input correctly', function () {
    expect(document.querySelector('input[type=radio][name=test]')).toBeDefined();
  });

  it('should return expected json', function () {
    expect(mygform.toJSON()).toEqual({test: ''});
  });

  it('should return expected value', function () {
    expect(mygform.toJSON().test).toEqual('');
  });

  it('sets value with set', function () {
    expect(mygform.toJSON().test).toEqual('');
    mygform.find('test').set('stuff');
    expect(mygform.find('test').value).toEqual('stuff');
  });

  it('sets value with set - get value from name', function () {
    expect(mygform.toJSON('test')).toEqual('');
    debugger;
    mygform.find('test').set('stuff');
    expect(mygform.toJSON('test')).toEqual('stuff');
  });
  
  it('sets value with set - get value from form toJSON', function () {
    expect(mygform.toJSON('test')).toEqual('');
    mygform.find('test').set('stuff');
    expect(mygform.toJSON()).toEqual({test: 'stuff'});
  });

  // it('sets value with setValue', function () {
  //   expect(mygform.toJSON('test')).toEqual('hello');
  //   mygform.find('test').setValue('stuff');
  //   expect(mygform.find('test').value).toEqual('stuff');
  // });

  // it('sets value with setValue - get value from name', function () {
  //   expect(mygform.toJSON('test')).toEqual('hello');
  //   mygform.find('test').setValue('stuff');
  //   expect(mygform.toJSON('test')).toEqual('stuff');
  // })

  // it('sets value with setValue - get value from toJSON', function () {
  //   expect(mygform.toJSON('test')).toEqual('hello');
  //   mygform.find('test').setValue('stuff');
  //   expect(mygform.toJSON()).toEqual({test: 'stuff'});
  // });

  it('should trigger events', function () {
    mygform.on('change', triggerOnChange);
    mygform.find('test').set('hello',true);
    expect(triggerOnChange).not.toHaveBeenCalled();
    mygform.find('test').set('stuff');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  // it('should suppress change event during setValue', function () {
  //   mygform.find('test').setValue('stuff');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });

});