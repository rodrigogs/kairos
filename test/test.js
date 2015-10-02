'use strict';

describe('Kairos', function () {

  // Setup =====================================================================

  before(function (done) {
    //TODO
  });

  // Tests =====================================================================

  beforeEach(function () {
    //TODO
  });

  afterEach(function () {
    //TODO
  });

  it('should sum first time expression with second time expression', function (done) {
    var time = Kairos.plus('01:00', '01:00');
    assert.equal(time, '02:00');

    done();
  });

});
