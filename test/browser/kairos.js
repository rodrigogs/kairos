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

  it('should return previous instance of Kairos if it already exists', function (done) {
    var previous = Kairos;
    assert.equal(Kairos.noConflict(), previous);
    Kairos = previous;
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

  it('should return a time fraction', function (done) {
    assert.equal(Kairos.getFraction('01:00', 2, 3), '00:40');
    done();
  });

  it('should throw error when a improper fraction is given', function (done) {
    assert.throws(function () {
      Kairos.getFraction('01:00', 3, 2);
    });
    done();
  });
  
  it('should return a time expression representing the interval between starting time and ending time', function (done) {
    assert.equal(Kairos.getInterval('01:00', '02:00'), '01:00');
    done();
  });
  
  it('should throw error when starting time is bigger than ending time', function (done) {
    assert.throws(function () {
      Kairos.getInterval('02:00', '01:00');
    });
    done();
  });

  it('should return total milliseconds in the given time expression', function (done) {
    assert.equal(Kairos.toMilliseconds('01:30:35:100'), 5435100);
    done();
  });

  it('should return total seconds in the given time expression', function (done) {
    assert.equal(Kairos.toSeconds('01:30:35:100'), 5435.1);
    done();
  });

  it('should return total minutes in the given time expression', function (done) {
    assert.equal(Kairos.toMinutes('01:30:35:100'), 90.585);
    done();
  });

  it('should return total hours in the given time expression', function (done) {
    assert.equal(Kairos.toHours('01:30:35:100'), 1.50975);
    done();
  });
  
  it('should compare first time with second time and return -1 for smaller, 0 for equals and 1 for bigger', function (done) {
    assert.equal(Kairos.compare('01:00', '02:00'), -1);
    assert.equal(Kairos.compare('01:00', '01:00'), 0);
    assert.equal(Kairos.compare('02:00', '01:00'), 1);
    done();
  });
  
  it('should return the minimun value from the given values', function (done) {
    assert.equal(Kairos.min(['01:00', '05:00', '00:30', '00:40']), '00:30');
    
    assert.equal(Kairos.min([
      new Kairos.Gnomon('01:00'),
      new Kairos.Gnomon('05:00'),
      new Kairos.Gnomon('00:30'),
      new Kairos.Gnomon('00:40')]), '00:30');
      
    assert.equal(Kairos.min('01:00', '05:00', '00:30', '00:40'), '00:30');
    
    assert.equal(Kairos.min(new Kairos.Gnomon('01:00'),
      new Kairos.Gnomon('05:00'),
      new Kairos.Gnomon('00:30'),
      new Kairos.Gnomon('00:40')), '00:30');
      
    assert.equal(Kairos.min('01:00'), '01:00');
    
    done();
  });
  
  it('should return the maximum value from the given values', function (done) {
    assert.equal(Kairos.max(['01:00', '05:00', '00:30', '00:40']), '05:00');
    
    assert.equal(Kairos.max([
      new Kairos.Gnomon('01:00'),
      new Kairos.Gnomon('05:00'),
      new Kairos.Gnomon('00:30'),
      new Kairos.Gnomon('00:40')]), '05:00');
      
    assert.equal(Kairos.max('01:00', '05:00', '00:30', '00:40'), '05:00');
    
    assert.equal(Kairos.max(new Kairos.Gnomon('01:00'),
      new Kairos.Gnomon('05:00'),
      new Kairos.Gnomon('00:30'),
      new Kairos.Gnomon('00:40')), '05:00');
      
    assert.equal(Kairos.max('01:00'), '01:00');
    
    done();
  });
});
