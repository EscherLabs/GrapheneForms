describe('Carbon Initialization', function () {

	beforeEach(function() {
    // triggerOnChange = jasmine.createSpy();
		myCarbon = new carbon({name: 'carbonTest', fields:[{label:'test' ,value: 'hello'}]}, '#carbon')//.on('change', triggerOnChange);
	//	myCarbon.on('initialized', function(){ done(); }, this, myCarbon.initialized);
	});

  afterEach(function() {
    // myCarbon.toJSON();
  });

  // it('should create a global reference', function () {
  //   expect(Carbon.instances.carbonTest).toBeDefined();
  // });

  it('should be defined', function () {
    expect(myCarbon).toBeDefined();
  });

	it('should create a form', function () {
		expect(document.querySelector('form')).not.toBe(null);
	});

// 	it('should create actions correctly', function () {
// 		expect($('[data-id=carbon-submit]')[0]).toBeDefined();
// 		expect($('[data-id=carbon-close]')[0]).toBeDefined();
// 		myCarbon.destroy();
// 		myCarbon = new Carbon({actions: ['cancel'], fields:{test:{value: 'hello'}}}, $('#carbon')).on('change', triggerOnChange);
// 		expect($('[data-id=carbon-submit]')[0]).not.toBeDefined();
// 		expect($('[data-id=carbon-close]')[0]).toBeDefined();
// 	});

// 	it('should create field reference', function () {
// 		expect(myCarbon.fields.test).toBeDefined();
// 		expect(myCarbon.fields.test).toEqual(jasmine.any(Carbon.field));
// 	});

// 	it('should return expected json', function () {
// 		expect(myCarbon.toJSON()).toEqual({test: 'hello'});
// 	});

//   it('should have triggerable events', function () {
//     myCarbon.trigger('change');
//     expect(triggerOnChange).toHaveBeenCalled();
//   });

});

// describe('Carbon Post Initialization', function () {
// 	var myCarbon;

// 	beforeEach(function(done) {
//     myCarbon = new Carbon({attributes: {test: 'hello'}, fields:{test:{}}}, $('#carbon'));
//   	myCarbon.on('initialized', function(){ done(); }, this, myCarbon.initialized);
// 	});

//   afterEach(function() {
//     myCarbon.destroy();
//   });

//   it('should support attributes paramater', function () {
//     expect(myCarbon.toJSON()).toEqual({test: 'hello'});   
//   });
// });



// describe('Carbon in action', function () {
// 	var myCarbon;

// 	beforeEach(function() {
// 		//myCarbon = new Carbon({fields:{test:{value: 'hello'}}}, $('#carbon'));
// 	});

//   afterEach(function() {
//     myCarbon.destroy();
//   });

// 	it('will handle null attributes', function () {
// 		myCarbon = new Carbon({attributes: {test: null}, fields:{test:{value: null}}}, $('#carbon'));
// 		expect(myCarbon.fields.test.value).toEqual('');
// 		expect(myCarbon.toJSON()).toEqual({test: ''});
// 		myCarbon.destroy();

// 		myCarbon = new Carbon({attributes: {test: null}, fields:{test:{type: 'select', choices: ['hello', 'stuff'], value: null }}}, $('#carbon'));

// 		//possibly revisit this
// 		expect(myCarbon.toJSON()).toEqual({test: '' });
// 	});

// 	it('returns expected json - select default', function () {
// 		myCarbon = new Carbon({fields:{test:{type: 'select', choices: ['hello', 'stuff'] }}}, $('#carbon'));
// 		expect(myCarbon.toJSON()).toEqual({test: '' });
// 	});

// 	it('returns expected json - select w/ default value', function () {
// 		myCarbon = new Carbon({fields:{test:{type: 'select', value:'stuff', choices: ['hello', 'stuff'] }}}, $('#carbon'));
// 		expect(myCarbon.toJSON()).toEqual({test: 'stuff'});
// 	});

// });
