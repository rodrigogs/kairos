'use strict';

// Pre assign variables
var assert = assert;
var Kairos = Kairos;

// Require modules when running with Node.js
if (typeof require !== 'undefined') {
  assert = require('assert');
  Kairos = require('../../build/kairos-node');
}

describe('Kairos.Engine', function () {

  // Setup =====================================================================

  var loadDefaults = function () {
    Kairos._pattern = '#hh:mm:ss.SSS';
    Kairos._validator = new RegExp(/^[+-]?\d\d:\d\d:\d\d\.\d\d\d/);
  };

  var engine;

  before(function (done) {
    done();
  });

  // Tests =====================================================================

  beforeEach(function (done) {
    loadDefaults();
    engine = new Kairos.Engine('01:30:30.123');

    done();
  });

  afterEach(function () {
  });

  it('should return an instance of Kairos.Engine', function (done) {
    assert.doesNotThrow(function () {
      var t1 = new Kairos.Engine('10:20:30.123');
      var t2 = new Kairos.Engine(1);
      
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
      
      var time = new Kairos.Engine(new Kairos.Engine());
      assert.equal(time.getMilliseconds(), 0);
      
      time = new Kairos.Engine('10:00', 'hh:mm');
      assert.equal(time.toString('hh:mm'), '10:00');

      Kairos.setPattern('hhh:mm:ss');

      time = new Kairos.Engine('100:00:00');
      assert.equal(time.toString(), '100:00:00');
    });

    done();
  });

  it('should return an instance of Kairos.Engine with zero value', function (done) {
    assert.equal(new Kairos.Engine().toMilliseconds(), 0);

    done();
  });

  it('should throw error when expression is invalid', function (done) {
    assert.throws(function () {
      new Kairos.Engine('00:00:00:00:00');
    }, Error);

    done();
  });

  it('should return the milliseconds in the expression', function (done) {
    assert.equal(engine.getMilliseconds(), 123);
    done();
  });

  it('should return the seconds in the expression', function (done) {
    assert.equal(engine.getSeconds(), 30);
    done();
  });

  it('should return the minutes in the expression', function (done) {
    assert.equal(engine.getMinutes(), 30);
    done();
  });

  it('should return the hours in the expression', function (done) {
    assert.equal(engine.getHours(), 1);
    done();
  });

  it('should convert the expression to milliseconds', function (done) {
    assert.equal(engine.toMilliseconds(), 5430123);
    done();
  });

  it('should convert the expression to seconds', function (done) {
    assert.equal(engine.toSeconds(), 5430.123);
    done();
  });

  it('should convert the expression to minutes', function (done) {
    assert.equal(engine.toMinutes(), 90.50205);
    done();
  });

  it('should convert the expression to hours', function (done) {
    assert.equal(engine.toHours(), 1.5083675);
    done();
  });

  it('should return the given expression', function (done) {
    assert.equal(engine.toString(), '+01:30:30.123');
    done();
  });

  it('should return the given negative expression', function (done) {
    engine = new Kairos.Engine('-01:30:30.123');
    assert.equal(engine.toString(), '-01:30:30.123');
    done();
  });

  it('should add 900 milliseconds to the expression', function (done) {
    var t = engine.addMilliseconds(900);
    assert.equal(engine.getMilliseconds(), 23);
    assert.equal(engine.getSeconds(), 31);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getMilliseconds(), 23);
    done();
  });

  it('should add 31 seconds to the expression', function (done) {
    var t = engine.addSeconds(31);
    assert.equal(engine.getMilliseconds(), 123);
    assert.equal(engine.getSeconds(), 1);
    assert.equal(engine.getMinutes(), 31);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getSeconds(), 1);
    done();
  });

  it('should add 31 minutes to the expression', function (done) {
    var t = engine.addMinutes(31);
    assert.equal(engine.getMilliseconds(), 123);
    assert.equal(engine.getSeconds(), 30);
    assert.equal(engine.getMinutes(), 1);
    assert.equal(engine.getHours(), 2);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getMinutes(), 1);
    done();
  });

  it('should add 1.5 hours to the expression', function (done) {
    var t = engine.addHours(1.5);
    assert.equal(engine.getMilliseconds(), 123);
    assert.equal(engine.getSeconds(), 30);
    assert.equal(engine.getMinutes(), 0);
    assert.equal(engine.getHours(), 3);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getHours(), 3);
    done();
  });

  it('should remove 900 milliseconds to the expression', function (done) {
    var t = engine.removeMilliseconds(900);
    assert.equal(engine.getMilliseconds(), 223);
    assert.equal(engine.getSeconds(), 29);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getMilliseconds(), 223);
    done();
  });

  it('should remove 31 seconds to the expression', function (done) {
    var t = engine.removeSeconds(31);
    assert.equal(engine.getMilliseconds(), 123);
    assert.equal(engine.getSeconds(), 59);
    assert.equal(engine.getMinutes(), 29);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getSeconds(), 59);
    done();
  });

  it('should remove 31 minutes to the expression', function (done) {
    var t = engine.removeMinutes(31);
    assert.equal(engine.getMilliseconds(), 123);
    assert.equal(engine.getSeconds(), 30);
    assert.equal(engine.getMinutes(), 59);
    assert.equal(engine.getHours(), 0);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getMinutes(), 59);
    done();
  });

  it('should remove 1.5 hours to the expression', function (done) {
    var t = engine.removeHours(1.5);
    assert.equal(engine.getMilliseconds(), 123);
    assert.equal(engine.getSeconds(), 30);
    assert.equal(engine.getMinutes(), 0);
    assert.equal(engine.getHours(), 0);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getHours(), 0);
    done();
  });

  it('should set expression millisecons to 321', function (done) {
    var t = engine.setMilliseconds(321);
    assert.equal(engine.getMilliseconds(), 321);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getMilliseconds(), 321);
    done();
  });

  it('should set expression seconds to 45', function (done) {
    var t = engine.setSeconds(45);
    assert.equal(engine.getSeconds(), 45);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getSeconds(), 45);
    done();
  });

  it('should set expression minutes to 45', function (done) {
    var t = engine.setMinutes(45);
    assert.equal(engine.getMinutes(), 45);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getMinutes(), 45);
    done();
  });

  it('should set expression hours to 5', function (done) {
    var t = engine.setHours(5);
    assert.equal(engine.getHours(), 5);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.getHours(), 5);
    done();
  });

  it('should sum two time expressions', function (done) {
    var addend = new Kairos.Engine('01:30:30.123');
    var t = engine.plus(addend);
    assert.equal(engine.toString(), '+03:01:00.246');
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.toString(), '+03:01:00.246');
    done();
  });

  it('should subtract two time expressions', function (done) {
    var substrahend = new Kairos.Engine('01:30:30.123');
    var t = engine.minus(substrahend);
    assert.equal(engine.toString('hh:mm'), '00:00');
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.toString('hh:mm'), '00:00');
    done();
  });

  it('should multiply the time expression by 2', function (done) {
    var t = engine.multiply(2);
    assert.equal(engine.toString(), '+03:01:00.246');
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.toString(), '+03:01:00.246');
    done();
  });

  it('should divide the time expression by 2', function (done) {
    var t = engine.divide(2);
    assert.equal(engine.toString(), '+00:45:15.061');
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.toString(), '+00:45:15.061');
    done();
  });

  it('should compare first time with second time and return -1 for smaller, 0 for equals and 1 for bigger', function (done) {
    Kairos.setPattern('hh:mm');
    engine = new Kairos.Engine('01:00');
    assert.equal(engine.compareTo(new Kairos.Engine('02:00')), -1);
    assert.equal(engine.compareTo(new Kairos.Engine('01:00')), 0);
    assert.equal(engine.compareTo(new Kairos.Engine('00:30')), 1);
    done();
  });

  it('should parse correctly expressions whith hours < 10 and > 99', function (done) {
    Kairos.setPattern('hh:mm');
    var a = new Kairos.Engine('60:00');
    var b = new Kairos.Engine('80:00');
    a.plus(b);
    assert.equal(a.toString('hhh:mm'), '140:00');

    a.minus(new Kairos.Engine('139:00', 'hhh:mm'));
    assert.equal(a.toString(), '01:00');

    done();
  });

  it('should execute commands in sequence and output the correct result', function (done) {
    Kairos.setPattern('hh:mm');
    var t = new Kairos.Engine('01:00').plus('02:00').minus('01:00').divide(2).multiply(10);
    assert.ok(t instanceof Kairos.Engine);
    assert.equal(t.toString(), '10:00');
    done();
  });

  it('should parse instance to string', function (done) {
    var time = Kairos.new('10:00:00.000');
    assert.equal(time.toString(), '+10:00:00.000');
    assert.equal(time.toString('hh:mm'), '10:00');

    time = Kairos.new('100:00', 'hhh:mm');
    assert.equal(time.toString(true), '+100:00:00.000');
    assert.equal(time.toString('hh:mm', true), '100:00');

    done();
  });
});
