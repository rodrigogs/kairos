'use strict';

describe('Kairos', function () {

  // Setup =====================================================================

  var gnomon;

  before(function (done) {
    //TODO
    done();
  });

  // Tests =====================================================================

  beforeEach(function () {
    gnomon = new Kairos.Gnomon('01:30:30:123');
  });

  afterEach(function () {
    //TODO
  });

  it('should throw error when expression is undefined', function (done) {
    assert.throws(function () {
      new Kairos.Gnomon();
    }, Error);
    done();
  });

  it('should throw error when expression is invalid', function (done) {
    assert.throws(function () {
      new Kairos.Gnomon('00:00:00:00:00');
    }, Error);
    done();
  });

  it('should return the milliseconds in the expression', function (done) {
    assert.equal(gnomon.getMilliseconds(), 123);
    done();
  });

  it('should return the seconds in the expression', function (done) {
    assert.equal(gnomon.getSeconds(), 30);
    done();
  });

  it('should return the minutes in the expression', function (done) {
    assert.equal(gnomon.getMinutes(), 30);
    done();
  });

  it('should return the hours in the expression', function (done) {
    assert.equal(gnomon.getHours(), 1);
    done();
  });

  it('should convert the expression to milliseconds', function (done) {
    assert.equal(gnomon.toMilliseconds(), 5430123);
    done();
  });

  it('should convert the expression to seconds', function (done) {
    assert.equal(gnomon.toSeconds(), 5430.123);
    done();
  });

  it('should convert the expression to minutes', function (done) {
    assert.equal(gnomon.toMinutes(), 90.50205);
    done();
  });

  it('should convert the expression to hours', function (done) {
    assert.equal(gnomon.toHours(), 1.5083675);
    done();
  });

  it('should return the given expression', function (done) {
    assert.equal(gnomon.toExpression(), '01:30:30:123');
    done();
  });

  it('should add 900 milliseconds to the expression', function (done) {
    gnomon.addMilliseconds(900);
    assert.equal(gnomon.getMilliseconds(), 23);
    assert.equal(gnomon.getSeconds(), 31);
    done();
  });

  it('should add 31 seconds to the expression', function (done) {
    gnomon.addSeconds(31);
    assert.equal(gnomon.getMilliseconds(), 123);
    assert.equal(gnomon.getSeconds(), 1);
    assert.equal(gnomon.getMinutes(), 31);
    done();
  });

  it('should add 31 minutes to the expression', function (done) {
    gnomon.addMinutes(31);
    assert.equal(gnomon.getMilliseconds(), 123);
    assert.equal(gnomon.getSeconds(), 30);
    assert.equal(gnomon.getMinutes(), 1);
    assert.equal(gnomon.getHours(), 2);
    done();
  });

  it('should add 1.5 hours to the expression', function (done) {
    gnomon.addHours(1.5);
    assert.equal(gnomon.getMilliseconds(), 123);
    assert.equal(gnomon.getSeconds(), 30);
    assert.equal(gnomon.getMinutes(), 0);
    assert.equal(gnomon.getHours(), 3);
    done();
  });

  it('should remove 900 milliseconds to the expression', function (done) {
    gnomon.removeMilliseconds(900);
    assert.equal(gnomon.getMilliseconds(), 223);
    assert.equal(gnomon.getSeconds(), 29);
    done();
  });

  it('should remove 31 seconds to the expression', function (done) {
    gnomon.removeSeconds(31);
    assert.equal(gnomon.getMilliseconds(), 123);
    assert.equal(gnomon.getSeconds(), 59);
    assert.equal(gnomon.getMinutes(), 29);
    done();
  });

  it('should remove 31 minutes to the expression', function (done) {
    gnomon.removeMinutes(31);
    assert.equal(gnomon.getMilliseconds(), 123);
    assert.equal(gnomon.getSeconds(), 30);
    assert.equal(gnomon.getMinutes(), 59);
    assert.equal(gnomon.getHours(), 0);
    done();
  });

  it('should remove 1.5 hours to the expression', function (done) {
    gnomon.removeHours(1.5);
    assert.equal(gnomon.getMilliseconds(), 123);
    assert.equal(gnomon.getSeconds(), 30);
    assert.equal(gnomon.getMinutes(), 0);
    assert.equal(gnomon.getHours(), 0);
    done();
  });

  it('should set expression millisecons to 321', function (done) {
    gnomon.setMilliseconds(321);
    assert.equal(gnomon.getMilliseconds(), 321);
    done();
  });

  it('should set expression seconds to 45', function (done) {
    gnomon.setSeconds(45);
    assert.equal(gnomon.getSeconds(), 45);
    done();
  });

  it('should set expression minutes to 45', function (done) {
    gnomon.setMinutes(45);
    assert.equal(gnomon.getMinutes(), 45);
    done();
  });

  it('should set expression hours to 5', function (done) {
    gnomon.setHours(5);
    assert.equal(gnomon.getHours(), 5);
    done();
  });

  it('should sum two time expressions', function (done) {
    var addend = new Kairos.Gnomon('01:30:30:123');
    gnomon.plus(addend);
    assert.equal(gnomon.toExpression(), '03:01:00:246');
    done();
  });

  it('should subtract two time expressions', function (done) {
    var substrahend = new Kairos.Gnomon('01:30:30:123');
    gnomon.minus(substrahend);
    assert.equal(gnomon.toExpression(), '00:00');
    done();
  });

  it('should multiply the time expression by 2', function (done) {
    gnomon.multiply(2);
    assert.equal(gnomon.toExpression(), '03:01:00:246');
    done();
  });

  it('should divide the time expression by 2', function (done) {
    gnomon.divide(2);
    assert.equal(gnomon.toExpression(), '00:45:15:061');
    done();
  });

  it('should sum first time expression with second time expression', function (done) {
    var time = Kairos.plus('01:00', '01:30:35:100');
    assert.equal(time, '02:30:35:100');
    done();
  });

  it('should subtract first time expression with second time expression', function (done) {
    var time = Kairos.minus('01:30:35:100', '01:15');
    assert.equal(time, '00:15:35:100');
    done();
  });

  it('should multiply the time expression by 2', function (done) {
    assert.equal(Kairos.multiply('01:30:35:100', 2), '03:01:10:200');
    done();
  });

  it('should divide the time expression by 2', function (done) {
    assert.equal(Kairos.divide('01:30:35:100', 2), '00:45:17:550');
    done();
  });

});
