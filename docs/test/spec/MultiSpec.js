describe('gform Multiple', function () {
	var mygform;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy();
		mygform = new gform({
			"flatten": false, 
			fields:
			[
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"max": 2
							},
							"toArray": false,
							"fields": {
								"Candy Type": {value: "Kit Kat"}
							}
						}
					}
				}
			]
		}, $('#berry')).sub('change', triggerOnChange);

	});

  afterEach(function() {
    mygform.destroy();
  });

	it('should create field reference', function () {
		expect(mygform.fields.candies).toBeDefined();
		expect(mygform.fields.candies.instances[0]).toEqual(jasmine.any(gform.field));
	});

	it('should return expected json - value set', function () {
		var actual = mygform.toJSON()
		var expected = { candies: { fs: [{candy_type: "Kit Kat"}]} } ;
		expect(actual).toEqual(expected);
	});


	it('should return expected json', function () {
		expect(mygform.parsefields({flatten: true})).toEqual({fs: [{candy_type: "Kit Kat"}]} );
	});


	it('should return expected json min = 2', function () {
    mygform.destroy();
    // debugger;
		mygform = new gform({
			flatten: false,
			fields: [
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"min": 2,
								"max": 3
							},
							"toArray": false,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			] }, $('#berry')).on('change', triggerOnChange);

		expect(mygform.toJSON()).toEqual({ candies: { fs: [ { candy_type: '' }, { candy_type: '' } ] } });
	});



	it('should return expected json with multiple supplied', function () {
    mygform.destroy();
    // debugger;
		mygform = new gform({
			flatten: false,
			fields: [
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"min": 2,
								"max": 3
							},
							"toArray": false,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			],
		'attributes': { candies: { fs: [ { candy_type: 'Kit Kat' }, { candy_type: 'Reases' } ] } } }, $('#berry')).on('change', triggerOnChange);

		expect(mygform.toJSON()).toEqual({ candies: { fs: [ { candy_type: 'Kit Kat' }, { candy_type: 'Reases' } ] } });
	});


	it('should return expected json with multiple supplied - flatten', function () {
    mygform.destroy();
    // debugger;
		mygform = new gform({
			flatten: true,
			fields: [
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"max": 3
							},
							"toArray": false,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			],
		'attributes': { fs: [ { candy_type: 'Kit Kat' }, { candy_type: 'Reases' } ] }  }, $('#berry')).on('change', triggerOnChange);

		expect(mygform.toJSON()).toEqual({ fs: [ { candy_type: 'Kit Kat' }, { candy_type: 'Reases' } ] });
	});

	it('should return expected json with multiple supplied w/array', function () {
    mygform.destroy();
		mygform = new gform({
			flatten: false,
			fields:
			[
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"max": 2
							},
							"toArray": true,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			],
		'attributes': { candies: { fs: { candy_type: ['Hello', 'Stuff'] } } }   }, $('#berry')).on('change', triggerOnChange);

		var actual = mygform.toJSON()
		var expected = { candies: { fs: { candy_type: [ 'Hello' , 'Stuff' ] } } };
		expect(actual).toEqual(expected);
	});


	it('should return expected json with multiple supplied - flatten w/array', function () {
    mygform.destroy();
		mygform = new gform({
			flatten: true,
			fields:
			[
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"max": 2
							},
							"toArray": true,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			],
		'attributes': { fs: { candy_type: ['Hello', 'Stuff'] } }  }, $('#berry')).on('change', triggerOnChange);

		var actual = mygform.toJSON()
		var expected = { fs: { candy_type: [ 'Hello' , 'Stuff' ] } };
		expect(actual).toEqual(expected);
	});

 //  it('should have triggerable events', function () {
 //    mygform.trigger('change');
 //    expect(triggerOnChange).toHaveBeenCalled();
 //  });

 //  it('should allow attributes paramater', function () {
 //    mygform.destroy();
 //    mygform = new gform({attributes: {test: 'hello'}, fields:{test:{}}}, $('#berry'));
 //    expect(mygform.toJSON()).toEqual({test: 'hello'});
 //  });
});


// {
//   "attributes":{
// 	"name": "",
// 	"title": "",
// 	"fs": 
// 		{
// 			"candy_type": ["asdfasfda", "asdfasdfa"]
// 		}
// },
//   "flatten":true,
// 	"fields": [
// 		{
// 			"label": "Name",
// 			"type": "text",
// 			"required": false,
// 			"name": "name"
// 		},
// 		{
// 			"label": "Title",
// 			"type": "text",
// 			"name": "title"
// 		},
// 		{
// 			"name": "fs_c",
// 			"type": "fieldset",
// 			"legend": "Favorite Candies",
// 			"fields": {
// 				"fs": {
// 					"label": false,
// 					"type": "fieldset",
// 					"multiple": {
// 						"duplicate": true,
// 						"max": 2
// 					},
// 					"toArray": true,
// 					"fields": {
// 						"Candy Type": {}
// 					}
// 				}
// 			}
// 		}
// 	]
// }

// {
//   "attributes":{
// 	"name": "",
// 	"title": "",
// 	"fs": [
// 		{
// 			"candy_type": "asdfasfda"
// 		},
// 		{
// 			"candy_type": "asdfasdfa"
// 		}
// 	]
// },
//   "flatten":true,
// 	"fields": [
// 		{
// 			"label": "Name",
// 			"type": "text",
// 			"required": false,
// 			"name": "name"
// 		},
// 		{
// 			"label": "Title",
// 			"type": "text",
// 			"name": "title"
// 		},
// 		{
// 			"name": "fs_c",
// 			"type": "fieldset",
// 			"legend": "Favorite Candies",
// 			"fields": {
// 				"fs": {
// 					"label": false,
// 					"type": "fieldset",
// 					"multiple": {
// 						"duplicate": true,
// 						"max": 2
// 					},
// 					"toArray": false,
// 					"fields": {
// 						"Candy Type": {}
// 					}
// 				}
// 			}
// 		}
// 	]
// }