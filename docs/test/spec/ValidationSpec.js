describe('Validation - Required', function () {
  var mygform;

	beforeEach(function() {
    // triggerOnChange = jasmine.createSpy('onChange');
		mygform = new gform({fields:[
      {name:'text', required: true},
      {name:'textarea', type: 'textarea', required: true},
      {name:'checkbox', type: 'checkbox', required: true},
      {name:'select', type: 'select', required: true, options:['First', 'Second']},
      {name:'radio', type: 'radio', required: true, options:['First', 'Second']}
    ]}, '#gform')
	});

  afterEach(function() {
    mygform.destroy();
  });


  it('"Text" should be invalid if value is empty', function () {
    gform.validateItem(mygform.find('text'))
    expect(mygform.valid ).toEqual(false);
  });
  it('"Text" should be valid if it contains any text', function () {
    mygform.find('text').setValue('text');
    gform.prototype.validateItem.call(mygform.find('text'))
    expect(mygform.valid).toEqual(true);
  });

  it('"Textarea" should be invalid if value is empty', function () {
    gform.prototype.validateItem.call(mygform.find('textarea'))
    expect(mygform.valid ).toEqual(false);
  });

  it('"Textarea" should be valid if it contains any text', function () {
    mygform.find('textarea').setValue('textarea');
    gform.prototype.validateItem.call(mygform.find('textarea'))
    expect(mygform.valid).toEqual(true);
  });



  it('"Checkbox" should be invalid if value is falsey', function () {
    gform.prototype.validateItem.call(mygform.find('checkbox'))
    expect(mygform.valid ).toEqual(false);
  });
  it('"Checkbox" should be valid if value is truthy', function () {
    mygform.find('checkbox').setValue(true);
    gform.prototype.validateItem.call(mygform.find('checkbox'))
    expect(mygform.valid).toEqual(true);
  });

  it('"Select" should be invalid if value not selected', function () {
    gform.prototype.validateItem.call(mygform.find('select'))
    expect(mygform.valid).toEqual(false);
  });

  it('"Select" should be valid if value selected', function () {
    mygform.find('select').set('Second');
    gform.prototype.validateItem.call(mygform.find('select'))
    expect(mygform.valid).toEqual(true);
  });

  it('"Radio" should be invalid if value not selected', function () {
    gform.prototype.validateItem.call(mygform.find('radio'))
    expect(mygform.valid).toEqual(false);
  });

  it('"Radio" should be valid if value selected', function () {
    mygform.find('radio').set('Second');
    gform.prototype.validateItem.call(mygform.find('radio'))
    expect(mygform.valid).toEqual(true);
  });

});