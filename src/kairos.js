(function (window, undefined) {
  'use strict';

  window.Kairos = window.Kairos || {};

  /**
   * Sums augend time with addend time
   *
   * @param {String} augend Augend time in hh:mm format
   * @param {String} addend Addend time in hh:mm format
   * @param addend
   */
  Kairos.plus = function (augend, addend) {
    var a = new Kairos.Gnomon(augend);
    var b = new Kairos.Gnomon(addend);
    a.plus(b);
    return a.getTimeExpression();
  };
}(window));
