describe('gform Initialization', function () {

	beforeEach(function() {
    // triggerOnChange = jasmine.createSpy();
		mygform = new gform({name: 'gformTest', fields:[{label:'test' ,value: 'hello'}]}, '#gform')//.on('change', triggerOnChange);
	//	mygform.on('initialized', function(){ done(); }, this, mygform.initialized);
	});

  afterEach(function() {
    // mygform.toJSON();
  });

  // it('should create a global reference', function () {
  //   expect(gform.instances.gformTest).toBeDefined();
  // });

  it('should be defined', function () {
    expect(mygform).toBeDefined();
  });

	it('should create a form', function () {
		expect(document.querySelector('form')).not.toBe(null);
	});

// 	it('should create actions correctly', function () {
// 		expect($('[data-id=gform-submit]')[0]).toBeDefined();
// 		expect($('[data-id=gform-close]')[0]).toBeDefined();
// 		mygform.destroy();
// 		mygform = new gform({actions: ['cancel'], fields:{test:{value: 'hello'}}}, $('#gform')).on('change', triggerOnChange);
// 		expect($('[data-id=gform-submit]')[0]).not.toBeDefined();
// 		expect($('[data-id=gform-close]')[0]).toBeDefined();
// 	});

// 	it('should create field reference', function () {
// 		expect(mygform.fields.test).toBeDefined();
// 		expect(mygform.fields.test).toEqual(jasmine.any(gform.field));
// 	});

// 	it('should return expected json', function () {
// 		expect(mygform.toJSON()).toEqual({test: 'hello'});
// 	});

//   it('should have triggerable events', function () {
//     mygform.trigger('change');
//     expect(triggerOnChange).toHaveBeenCalled();
//   });

});

// describe('gform Post Initialization', function () {
// 	var mygform;

// 	beforeEach(function(done) {
//     mygform = new gform({attributes: {test: 'hello'}, fields:{test:{}}}, $('#gform'));
//   	mygform.on('initialized', function(){ done(); }, this, mygform.initialized);
// 	});

//   afterEach(function() {
//     mygform.destroy();
//   });

//   it('should support attributes paramater', function () {
//     expect(mygform.toJSON()).toEqual({test: 'hello'});   
//   });
// });



// describe('gform in action', function () {
// 	var mygform;

// 	beforeEach(function() {
// 		//mygform = new gform({fields:{test:{value: 'hello'}}}, $('#gform'));
// 	});

//   afterEach(function() {
//     mygform.destroy();
//   });

// 	it('will handle null attributes', function () {
// 		mygform = new gform({attributes: {test: null}, fields:{test:{value: null}}}, $('#gform'));
// 		expect(mygform.fields.test.value).toEqual('');
// 		expect(mygform.toJSON()).toEqual({test: ''});
// 		mygform.destroy();

// 		mygform = new gform({attributes: {test: null}, fields:{test:{type: 'select', choices: ['hello', 'stuff'], value: null }}}, $('#gform'));

// 		//possibly revisit this
// 		expect(mygform.toJSON()).toEqual({test: '' });
// 	});

// 	it('returns expected json - select default', function () {
// 		mygform = new gform({fields:{test:{type: 'select', choices: ['hello', 'stuff'] }}}, $('#gform'));
// 		expect(mygform.toJSON()).toEqual({test: '' });
// 	});

// 	it('returns expected json - select w/ default value', function () {
// 		mygform = new gform({fields:{test:{type: 'select', value:'stuff', choices: ['hello', 'stuff'] }}}, $('#gform'));
// 		expect(mygform.toJSON()).toEqual({test: 'stuff'});
// 	});

// });
