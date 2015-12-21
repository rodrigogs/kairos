'use strict';

// Pre assign variables
var assert = assert;
var Kairos = Kairos;

// Require modules when running with Node.js
if (typeof require !== 'undefined') {
  assert = require('assert');
  Kairos = require('../../build/kairos-node');
}

describe('Kairos.Gnomon', function () {

  // Setup =====================================================================

  var gnomon;

  before(function (done) {
    done();
  });

  // Tests =====================================================================

  beforeEach(function () {
    gnomon = new Kairos.Gnomon('01:30:30:123');
  });

  afterEach(function () {
  });

  it('should return an instance of Kairos.Gnomon', function (done) {
    assert.doesNotThrow(function () {
      var t1 = new Kairos.Gnomon('10:20:30:123');
      var t2 = new Kairos.Gnomon(1);
      
      assert.equal(t1.getMilliseconds(), 123);
      assert.equal(t1.getSeconds(), 30);
      assert.equal(t1.getMinutes(), 20);
      assert.equal(t1.getHours(), 10);
      assert.equal(t1.toMilliseconds(), 37230123);
      assert.equal(t1.toSeconds(), 37230.123);
      assert.equal(t1.toMinutes(), 620.50205);
      assert.equal(t1.toHours(), 10.341700833333332);
      
      assert.equal(t2.getMilliseconds(), 1);
      assert.equal(t2.getSeconds(), 0);
      assert.equal(t2.getMinutes(), 0);
      assert.equal(t2.getHours(), 0);
      assert.equal(t2.toMilliseconds(), 1);
      assert.equal(t2.toSeconds(), 0.001);
      assert.equal(t2.toMinutes(), 0.000016666666666666667);
      assert.equal(t2.toHours(), 2.7777777777777776e-7);
    });
    done();
  });

  it('should return an instance of Kairos.Gnomon with zero value', function (done) {
    assert.equal(new Kairos.Gnomon().toMilliseconds(), 0);
    done();
  });

  it('should throw error when expression is invalid', function (done) {
    assert.throws(function () {
      new Kairos.Gnomon('00:00:00:00:00');
    }, Error);
    done();
  });

  it('should throw error when a expression time step is not a number', function (done) {
    assert.throws(function () {
      new Kairos.Gnomon('00:00:00:a0');
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

  it('should return the given negative expression', function (done) {
    gnomon = new Kairos.Gnomon('-01:30:30:123');
    assert.equal(gnomon.toExpression(), '-01:30:30:123');
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
  
  it('should compare first time with second time and return -1 for smaller, 0 for equals and 1 for bigger', function (done) {
    gnomon = new Kairos.Gnomon('01:00');
    assert.equal(gnomon.compareTo(new Kairos.Gnomon('02:00')), -1);
    assert.equal(gnomon.compareTo(new Kairos.Gnomon('01:00')), 0);
    assert.equal(gnomon.compareTo(new Kairos.Gnomon('00:30')), 1);
    done();
  });
  
  it('should parse correctly expressions whith hours < 10 and > 99', function (done) {
    var a = new Kairos.Gnomon('60:00');
    var b = new Kairos.Gnomon('80:00');
    a.plus(b);
    assert.equal(a.toExpression(), '140:00');
    
    a.minus(new Kairos.Gnomon('139:00'));
    assert.equal(a.toExpression(), '01:00');
    
    done();
  });
});
