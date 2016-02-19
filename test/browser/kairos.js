'use strict';

// Pre assign variables for further usage
var assert = assert;
var Kairos = Kairos;

// Require modules when running with Node.js
if (typeof require !== 'undefined') {
  assert = require('assert');
  Kairos = require('../../build/kairos-node');
}

describe('Kairos', function () {

  // Setup =====================================================================

  var loadDefaults = function () {
    Kairos._pattern = '#hh:mm:ss.SSS';
    Kairos._validator = new RegExp(/^[+-]?\d\d:\d\d:\d\d\.\d\d\d/);
  };

  // Tests =====================================================================

  afterEach(function (done) {
    loadDefaults();
    done();
  });

  it('should return previous instance of Kairos if it already exists', function (done) {
    var previous = Kairos;
    assert.equal(Kairos.noConflict(), previous);
    Kairos = previous;
    done();
  });

  it('should set a new pattern to Kairos', function (done) {
    Kairos.setPattern('hh:mm');
    assert.equal(Kairos.getPattern() === 'hh:mm', true);
    done();
  });

  it('should validate the expression with the given pattern or the current Kairos pattern', function (done) {
    assert.equal(Kairos.validate('22:30', 'hh:mm'), true);
    assert.equal(Kairos.validate('22:30', 'hh'), true);
    assert.equal(Kairos.validate('-22:30:30.500'), true);
    assert.equal(Kairos.validate('-22:30:30'), false);
    assert.equal(Kairos.validate('-300:30:30'), false);
    done();
  });

  it('should sum first time expression with second time expression', function (done) {
    var time = Kairos.plus('01:00:00.000', '01:30:35.100');
    assert.equal(time.toString(), '+02:30:35.100');
    time = Kairos.plus('01:00:00', '01:30:35', 'hh:mm:ss');
    assert.equal(time.toString('hh:mm:ss'), '02:30:35');
    done();
  });

  it('should subtract first time expression with second time expression', function (done) {
    var time = Kairos.minus('01:30:35.100', '01:15:00.000');
    assert.equal(time.toString(), '+00:15:35.100');
    time = Kairos.minus('01:30:35', '01:15:00', 'hh:mm:ss');
    assert.equal(time.toString('hh:mm:ss'), '00:15:35');
    done();
  });

  it('should multiply the time expression by 2', function (done) {
    assert.equal(Kairos.multiply('01:30:35.100', 2).toString(), '+03:01:10.200');
    assert.equal(Kairos.multiply('01:30:35', 2, 'hh:mm:ss').toString('hh:mm:ss'), '03:01:10');
    done();
  });

  it('should divide the time expression by 2', function (done) {
    assert.equal(Kairos.divide('01:30:35.100', 2).toString(), '+00:45:17.550');
    assert.equal(Kairos.divide('01:30:35', 2, 'hh:mm:ss').toString('hh:mm:ss'), '00:45:17');
    done();
  });

  it('should return a time fraction', function (done) {
    assert.equal(Kairos.getFraction('01:00:00.000', 2, 3).toString(), '+00:40:00.000');
    assert.equal(Kairos.getFraction('01:00:00', 2, 3, 'hh:mm:ss').toString('hh:mm:ss'), '00:40:00');
    done();
  });

  it('should throw error when a improper fraction is given', function (done) {
    assert.throws(function () {
      Kairos.getFraction('01:00:00.000', 3, 2);
    });
    done();
  });

  it('should return a time expression representing the interval between starting time and ending time', function (done) {
    assert.equal(Kairos.getInterval('01:00:00.000', '02:00:00.000').toString(), '+01:00:00.000');
    assert.equal(Kairos.getInterval('01:00:00', '02:00:00', 'hh:mm:ss').toString('hh:mm:ss'), '01:00:00');
    done();
  });
  
  it('should return total milliseconds in the given time expression', function (done) {
    assert.equal(Kairos.toMilliseconds('01:30:35.100'), 5435100);
    assert.equal(Kairos.toMilliseconds('01:30:35', 'hh:mm:ss'), 5435000);
    done();
  });

  it('should return total seconds in the given time expression', function (done) {
    assert.equal(Kairos.toSeconds('01:30:35.100'), 5435.1);
    assert.equal(Kairos.toSeconds('01:30:35', 'hh:mm:ss'), 5435);
    done();
  });

  it('should return total minutes in the given time expression', function (done) {
    assert.equal(Kairos.toMinutes('01:30:35.100'), 90.585);
    assert.equal(Kairos.toMinutes('01:30:35', 'hh:mm:ss'), 90.58333333333333);
    done();
  });

  it('should return total hours in the given time expression', function (done) {
    assert.equal(Kairos.toHours('01:30:35.100'), 1.50975);
    assert.equal(Kairos.toHours('01:30:35', 'hh:mm:ss'), 1.5097222222222222);
    done();
  });
  
  it('should compare first time with second time and return -1 for smaller, 0 for equals and 1 for bigger', function (done) {
    assert.equal(Kairos.compare('01:00:00.000', '02:00:00.000'), -1);
    assert.equal(Kairos.compare('01:00:00.000', '01:00:00.000'), 0);
    assert.equal(Kairos.compare('02:00:00.000', '01:00:00.000'), 1);
    assert.equal(Kairos.compare('01:00:00', '01:00:00.000', 'hh:mm:ss'), 0);
    done();
  });

  it('should return the minimun value from the given values', function (done) {
    assert.equal(Kairos.min(['01:00', '05:00', '00:30', '00:40'], 'hh:mm').toString('hh:mm'), '00:30');

    assert.equal(Kairos.min([
      new Kairos.Engine('01:00:00.000'),
      new Kairos.Engine('05:00:00.000'),
      new Kairos.Engine('00:30:00.000'),
      new Kairos.Engine('00:40', 'hh:mm')]).toString(), '+00:30:00.000');

    assert.equal(Kairos.min('01:00:00.000', '05:00:00.000', '00:30:00.000', '00:40:00.000').toString('hh:mm'), '00:30');
    
    assert.equal(Kairos.min(100, 200, 300).toString('SSS'), '100');

    assert.equal(Kairos.min(new Kairos.Engine('01:00:00.000'),
      new Kairos.Engine('05:00:00.000'),
      new Kairos.Engine('00:30:00.000'),
      new Kairos.Engine('00:40', 'hh:mm')).toString('mm'), '30');

    assert.equal(Kairos.min('01:00:00.000').toString('hh:mm'), '01:00');

    done();
  });

  it('should return the maximum value from the given values', function (done) {
    assert.equal(Kairos.max(['01:00', '05:00', '00:30', '00:40'], 'hh:mm').toString('hh:mm'), '05:00');

    assert.equal(Kairos.max([
      new Kairos.Engine('01:00:00.000'),
      new Kairos.Engine('05:00:00.000'),
      new Kairos.Engine('00:30:00.000'),
      new Kairos.Engine('00:40', 'hh:mm')]).toString(), '+05:00:00.000');

    assert.equal(Kairos.max('01:00:00.000', '05:00:00.000', '00:30:00.000', '00:40:00.000').toString('hh:mm'), '05:00');
    
    assert.equal(Kairos.max(100, 200, 300).toString('SSS'), '300');

    assert.equal(Kairos.max(new Kairos.Engine('01:00:00.000'),
      new Kairos.Engine('05:00:00.000'),
      new Kairos.Engine('00:30:00.000'),
      new Kairos.Engine('00:40', 'hh:mm')).toString('hh'), '05');

    assert.equal(Kairos.max('01:00:00.000').toString('hh:mm'), '01:00');

    done();
  });
  
  it('should create an instance of Kairos.Engine', function (done) {
    var a = Kairos.new();
    var b = Kairos.new('+01:00:00.000');
    var c = Kairos.new(123);
    var d = Kairos.new('01:00', 'hh:mm');

    assert.ok(a instanceof Kairos.Engine);
    assert.ok(b instanceof Kairos.Engine);
    assert.ok(c instanceof Kairos.Engine);
    assert.ok(d instanceof Kairos.Engine);

    assert.throws(function () {
      assert.Kairos.new('+01:00:00:000');
    }, Error);

    done();
  });

  it('should return an instance with absolute value', function (done) {
    assert.equal(Kairos.absolute('-10:30:00.000').toString(), '+10:30:00.000');
    assert.equal(Kairos.absolute('-10:30', '#hh:mm').toString(), '+10:30:00.000');
    assert.equal(Kairos.absolute(new Kairos.Engine('-10:30:00.000')), '+10:30:00.000');
    assert.equal(Kairos.absolute(-500).toString(), '+00:00:00.500');

    done();
  });
});
