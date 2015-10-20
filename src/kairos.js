(function () {
  'use strict';

  var Kairos = {};

  // global on the server, window in the browser
  var previous_Kairos;

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self === 'object' && self.self === self && self || // jshint ignore:line
    typeof global === 'object' && global.global === global && global || // jshint ignore:line
    this;

  if (root !== null) { // jshint ignore:line
    previous_Kairos = root.Kairos; // jshint ignore:line
  }

  /**
   * Avoid conflict in case of another instance of Kairos is already in the scope
   *
   * @returns {Object}
   */
  Kairos.noConflict = function () {
    root.Kairos = previous_Kairos;
    return Kairos;
  };

  /**
   * Sums augend time with addend time
   *
   * @param {String|Number} augend Augend time expression
   * @param {String|Number} addend Addend time expression
   */
  Kairos.plus = function (augend, addend) {
    var a = new Kairos.Gnomon(augend);
    var b = new Kairos.Gnomon(addend);
    a.plus(b);
    return a.toExpression();
  };

  /**
   * Subtracts minuend time with subtrahend time
   *
   * @param {String|Number} minuend Minuend time expression
   * @param {String|Number} subtrahend Subtrahend time expression
   * @returns {String}
   */
  Kairos.minus = function (minuend, subtrahend) {
    var a = new Kairos.Gnomon(minuend);
    var b = new Kairos.Gnomon(subtrahend);
    a.minus(b);
    return a.toExpression();
  };

  /**
   * Multiplies multiplier by the multiplicand
   *
   * @param {String|Number} multiplier Multiplier time expression
   * @param {String|Number} multiplicand Multiplicand number
   * @returns {String}
   */
  Kairos.multiply = function (multiplier, multiplicand) {
    var m = new Kairos.Gnomon(multiplier);
    m.multiply(multiplicand);
    return m.toExpression();
  };

  /**
   * Divides dividend by the divisor
   *
   * @param {String|Number} dividend Dividend time expression
   * @param {Number} divisor Dividor number
   * @returns {String}
   */
  Kairos.divide = function (dividend, divisor) {
    var d = new Kairos.Gnomon(dividend);
    d.divide(divisor);
    return d.toExpression();
  };

  /**
   *
   * @param {String|Number} time
   * @param {Number} numerator
   * @param {Number} denominator
   * @returns {String}
   */
  Kairos.getFraction = function (time, numerator, denominator) {
    if (numerator > denominator) {
      throw new Error('Improper fraction');
    }

    var gnomon = new Kairos.Gnomon(time);
    gnomon.multiply(numerator);
    gnomon.divide(denominator);
    return gnomon.toExpression();
  };

  /**
   * Converts the given time expression to milliseconds
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toMilliseconds = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toMilliseconds();
  };

  /**
   * Converts the given time expression to seconds
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toSeconds = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toSeconds();
  };

  /**
   * Converts the given time expression to minutes
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toMinutes = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toMinutes();
  };

  /**
   * Converts the given time expression to hours
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toHours = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toHours();
  };

  // Node.js
  if (typeof module === 'object' && module.exports) {
    //=include /gnomon/Gnomon.js
    module.exports = Kairos;
  }
  // AMD / RequireJS
  else if (typeof define === 'function' && define.amd) { // jshint ignore:line
    define([], function () { // jshint ignore:line
      return Kairos;
    });
  }
  // included directly via <script> tag
  else {
    root.Kairos = Kairos;
  }
}());
