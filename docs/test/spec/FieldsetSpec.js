describe('Fieldset', function () {
	var mygform;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
    mygform = new gform({flatten: false, fields:[{type: 'fieldset', name: 'first', fields: [{name:'test',value: 'hello'}] }] }, '#gform');//.on('change:test', triggerOnChange);
    // mygform.on('initialized', function(){ done(); }, this, mygform.initialized);
	});

  afterEach(function() {
    mygform.destroy();
  });

	it('should create a text input correctly', function () {
		expect(document.querySelector('input[name=test]')).toBeDefined();
	});

	it('should return expected value', function () {
    var actual = mygform.toJSON('first').test;
    var expected = 'hello';
    expect(actual).toEqual(expected);
	});

  it('sets value with set', function () {
		expect(mygform.toJSON('first.test')).toEqual('hello');
    mygform.fields[0].fields[0].set('test');
	  expect(mygform.toJSON('first.test')).toEqual('test');
    // expect(mygform.fields.first.instances[0].children.test.value).toEqual('test');
  });

	// it('sets value with set - get value from name', function () {
	// 	expect(mygform.toJSON('first.test')).toEqual('hello');
	// 	mygform.fields.first.instances[0].children.test.set('test');
	// 	expect(mygform.toJSON('first.test')).toEqual('test');
	// });

	// it('sets value with setValue', function () {
	// 	expect(mygform.toJSON('first.test')).toEqual('hello');
	// 	mygform.fields.first.instances[0].children.test.setValue('test');
	// 	expect(mygform.fields.first.instances[0].children.test.value).toEqual('test');
	// });

  // it('sets value with setValue - get value from name', function () {
	// 	expect(mygform.toJSON('first.test')).toEqual('hello');
  //   mygform.fields.first.instances[0].children.test.setValue('test');
  //   expect(mygform.toJSON('first.test')).toEqual('test');
  // })

  it('should trigger events', function () {
    mygform.on('change', triggerOnChange);

    mygform.fields[0].fields[0].set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    mygform.fields[0].fields[0].set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  // it('should suppress change event during setValue', function () {
  //   mygform.fields.first.instances[0].children.test.setValue('test');
  //   expect(triggerOnChange).not.toHaveBeenCalled();
  // });
  
});

// describe('Fieldset flatten = false', function () {
//   var mygform;

//   beforeEach(function(done) {
//     triggerOnChange = jasmine.createSpy('onChange');
//     mygform = new gform({flatten: false, fields:[{type: 'fieldset', name: 'first', fields: {test:{value: 'hello'} }}] }, '#gform').on('change:test', triggerOnChange);
//     mygform.on('initialized', function(){ done(); }, this, mygform.initialized);
//   });

//   afterEach(function() {
//     mygform.destroy();
//   });

//   it('should return expected json', function () {
//     var actual = mygform.toJSON();
//     var expected = {first: {test: 'hello'}};
//     expect(actual).toEqual(expected);
//   });

//   it('sets value with set - get value from form toJSON', function () {
//     expect(mygform.toJSON('first.test')).toEqual('hello');
//     mygform.fields.first.instances[0].children.test.set('test');

//     var actual = mygform.toJSON();
//     var expected = {first: {test: 'test'}};
//     expect(actual).toEqual(expected);
//   });

//   it('sets value with setValue - get value from toJSON', function () {
//     expect(mygform.toJSON('first.test')).toEqual('hello');
//     mygform.fields.first.instances[0].children.test.setValue('test');

//     var actual = mygform.toJSON();
//     var expected = {first: {test: 'test'}};
//     expect(actual).toEqual(expected);
//   });

// });

// describe('Fieldset flatten = true', function () {
//   var mygform;

//   beforeEach(function(done) {
//     triggerOnChange = jasmine.createSpy('onChange');
//     mygform = new gform({flatten: true, fields:[{type: 'fieldset', name: 'first', fields: {test:{value: 'hello'} }}] }, '#gform').on('change:test', triggerOnChange);
//     mygform.on('initialized', function(){ done(); }, this, mygform.initialized);
//   });

//   afterEach(function() {
//     mygform.destroy();
//   });

//   it('should return expected json', function () {
//     var actual = mygform.toJSON();
//     var expected = {test: 'hello'};
//     expect(actual).toEqual(expected);
//   });

//   it('sets value with set - get value from form toJSON', function () {
//     expect(mygform.toJSON('first.test')).toEqual('hello');
//     mygform.fields.first.instances[0].children.test.set('test');
//     var actual = mygform.toJSON();
//     var expected = {test: 'test'};
//     expect(actual).toEqual(expected);
//   });

//   it('sets value with setValue - get value from toJSON', function () {
//     expect(mygform.toJSON('first.test')).toEqual('hello');
//     mygform.fields.first.instances[0].children.test.setValue('test');
//     var actual = mygform.toJSON();
//     var expected = {test: 'test'};
//     expect(actual).toEqual(expected);
//   });
// });


// describe('Fieldset flatten = true w/ attributes', function () {
//   var mygform;

//   beforeEach(function(done) {
//     triggerOnChange = jasmine.createSpy('onChange');
//     mygform = new gform({flatten: true, attributes: {test: 'hello'}, fields:[{type: 'fieldset', name: 'first', fields: {test:{} }}] }, '#gform').on('change:test', triggerOnChange);
//     mygform.on('initialized', function(){ done(); }, this, mygform.initialized);
//   });

//   afterEach(function() {
//     mygform.destroy();
//   });

//   it('should return expected json', function () {
//     var actual = mygform.toJSON();
//     var expected = {test: 'hello'};
//     expect(actual).toEqual(expected);
//   });

// });