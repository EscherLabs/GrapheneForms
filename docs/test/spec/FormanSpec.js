describe('Forman Initialization', function () {

	beforeEach(function() {
    // triggerOnChange = jasmine.createSpy();
		myForman = new forman({name: 'berryTest', fields:[{label:'test' ,value: 'hello'}]}, '#forman')//.on('change', triggerOnChange);
	//	myForman.on('initialized', function(){ done(); }, this, myForman.initialized);
	});

  afterEach(function() {
    // myForman.toJSON();
  });

  // it('should create a global reference', function () {
  //   expect(Berry.instances.berryTest).toBeDefined();
  // });

  it('should be defined', function () {
    expect(myForman).toBeDefined();
  });

	it('should create a form', function () {
		expect(document.querySelector('form')).not.toBe(null);
	});

// 	it('should create actions correctly', function () {
// 		expect($('[data-id=berry-submit]')[0]).toBeDefined();
// 		expect($('[data-id=berry-close]')[0]).toBeDefined();
// 		myForman.destroy();
// 		myForman = new Berry({actions: ['cancel'], fields:{test:{value: 'hello'}}}, $('#berry')).on('change', triggerOnChange);
// 		expect($('[data-id=berry-submit]')[0]).not.toBeDefined();
// 		expect($('[data-id=berry-close]')[0]).toBeDefined();
// 	});

// 	it('should create field reference', function () {
// 		expect(myForman.fields.test).toBeDefined();
// 		expect(myForman.fields.test).toEqual(jasmine.any(Berry.field));
// 	});

// 	it('should return expected json', function () {
// 		expect(myForman.toJSON()).toEqual({test: 'hello'});
// 	});

//   it('should have triggerable events', function () {
//     myForman.trigger('change');
//     expect(triggerOnChange).toHaveBeenCalled();
//   });

});

// describe('Berry Post Initialization', function () {
// 	var myForman;

// 	beforeEach(function(done) {
//     myForman = new Berry({attributes: {test: 'hello'}, fields:{test:{}}}, $('#berry'));
//   	myForman.on('initialized', function(){ done(); }, this, myForman.initialized);
// 	});

//   afterEach(function() {
//     myForman.destroy();
//   });

//   it('should support attributes paramater', function () {
//     expect(myForman.toJSON()).toEqual({test: 'hello'});   
//   });
// });



// describe('Berry in action', function () {
// 	var myForman;

// 	beforeEach(function() {
// 		//myForman = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
// 	});

//   afterEach(function() {
//     myForman.destroy();
//   });

// 	it('will handle null attributes', function () {
// 		myForman = new Berry({attributes: {test: null}, fields:{test:{value: null}}}, $('#berry'));
// 		expect(myForman.fields.test.value).toEqual('');
// 		expect(myForman.toJSON()).toEqual({test: ''});
// 		myForman.destroy();

// 		myForman = new Berry({attributes: {test: null}, fields:{test:{type: 'select', choices: ['hello', 'stuff'], value: null }}}, $('#berry'));

// 		//possibly revisit this
// 		expect(myForman.toJSON()).toEqual({test: '' });
// 	});

// 	it('returns expected json - select default', function () {
// 		myForman = new Berry({fields:{test:{type: 'select', choices: ['hello', 'stuff'] }}}, $('#berry'));
// 		expect(myForman.toJSON()).toEqual({test: '' });
// 	});

// 	it('returns expected json - select w/ default value', function () {
// 		myForman = new Berry({fields:{test:{type: 'select', value:'stuff', choices: ['hello', 'stuff'] }}}, $('#berry'));
// 		expect(myForman.toJSON()).toEqual({test: 'stuff'});
// 	});

// });
