'use strict';

// Pre assign variables
var assert = assert;
var Kairos = Kairos;

// Require modules when running with Node.js
if (typeof require !== 'undefined') {
  assert = require('assert');
  Kairos = require('../../build/kairos-node');
}

describe('Kairos.Lexicon', function () {

  it('should generate a validator from the given pattern', function (done) {
    var validator = Kairos.Lexicon.getValidator('hh:mm');
    assert.ok(validator.test('10:30'));
    assert.equal(validator.test('10'), false);

    validator = Kairos.Lexicon.getValidator();
    assert.ok(validator.test('10:30:00.000'));
    assert.equal(validator.test('10:30'), false);

    validator = Kairos.Lexicon.getValidator(123456);
    assert.ok(validator.test('10:30:00.000'));
    assert.equal(validator.test('10:30'), false);

    done();
  });

  it('should validate an expression using a pattern', function (done) {
    assert.ok(Kairos.Lexicon.validate('10:00:30.000'));
    assert.equal(Kairos.Lexicon.validate('10:00:30'), false);
    assert.equal(Kairos.Lexicon.validate('10:00:30', 'hh:mm:ss'), true);

    done();
  });

  it('should parse the given expression to a Kairos.Engine instance', function (done) {
    var time = Kairos.Lexicon.parse('10:30:00.000');
    assert.ok(time instanceof Kairos.Engine);
    assert.equal(time.toString(), '+10:30:00.000');

    time = Kairos.Lexicon.parse('10:30', 'hh:mm');
    assert.ok(time instanceof Kairos.Engine);
    assert.equal(time.toString(), '+10:30:00.000');

    assert.throws(function () {
      Kairos.Lexicon.parse('10:30');
    }, Error);

    done();
  });

  it('should return a formated string from a Kairos.Engine ', function (done) {
    var time = Kairos.Lexicon.format(Kairos.new('10:00:00.000'), 'hh:mm');
    assert.equal(time, '10:00');

    time = Kairos.Lexicon.format(Kairos.new('10:00:00.000'));
    assert.equal(time, '+10:00:00.000');

    done();
  });
});