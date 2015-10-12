(function(window, undefined) {
  'use strict';

  window.Kairos = window.Kairos || {};

  /**
   * Sums augend time with addend time
   *
   * @param {String} augend Augend time expression
   * @param {String} addend Addend time expression
   */
  Kairos.plus = function(augend, addend) {
    var a = new Kairos.Gnomon(augend);
    var b = new Kairos.Gnomon(addend);
    a.plus(b);
    return a.toExpression();
  };

  /**
   * Subtracts minuend time with subtrahend time
   *
   * @param {String} minuend Minuend time expression
   * @param {String} subtrahend Subtrahend time expression
   */
  Kairos.minus = function(minuend, subtrahend) {
    var a = new Kairos.Gnomon(minuend);
    var b = new Kairos.Gnomon(subtrahend);
    a.minus(b);
    return a.toExpression();
  };
}(window));
