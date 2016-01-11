/**
 * @module Kairos
 */
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
   * @memberof module:Kairos
   * @method noConflict
   * @returns {Object}
   */
  Kairos.noConflict = function () {
    root.Kairos = previous_Kairos;
    return Kairos;
  };

  /**
   * Validates if the given expression is valid.
   * 
   * @memberof module:Kairos
   * @method validateExpression
   * @param {String|Number} expression Time expression
   * @returns {Boolean}
   */
  Kairos.validateExpression = function (expression) {
    var regex = /^[+-]?\d+(?::?\d{1,2}(?::\d{1,2}(?::\d{1,3})?)?)?$/;
    return regex.test(expression);
  };

  /**
   * Return a Kairos.Gnomon instance.
   *
   * @memberof module:Kairos
   * @method with
   * @param {String|Number} expression Time expression
   * @returns {Kairos.Gnomon}
   */
  Kairos.with = function (expression) {
    return new Kairos.Gnomon(expression);
  };

  /**
   * Sums augend time with addend time
   *
   * @memberof module:Kairos
   * @method plus
   * @param {String|Number} augend Augend time expression
   * @param {String|Number} addend Addend time expression
   * @returns {String}
   */
  Kairos.plus = function (augend, addend) {
    return Kairos.with(augend).plus(addend).toExpression();
  };

  /**
   * Subtracts minuend time with subtrahend time
   * 
   * @memberof module:Kairos
   * @method minus
   * @param {String|Number} minuend Minuend time expression
   * @param {String|Number} subtrahend Subtrahend time expression
   * @returns {String}
   */
  Kairos.minus = function (minuend, subtrahend) {
    return Kairos.with(minuend).minus(subtrahend).toExpression();
  };

  /**
   * Multiplies multiplier by the multiplicand
   *
   * @memberof module:Kairos
   * @method multiply
   * @param {String|Number} multiplier Multiplier time expression
   * @param {String|Number} multiplicand Multiplicand number
   * @returns {String}
   */
  Kairos.multiply = function (multiplier, multiplicand) {
    return Kairos.with(multiplier).multiply(multiplicand).toExpression();
  };

  /**
   * Divides dividend by the divisor
   *
   * @memberof module:Kairos
   * @method divide
   * @param {String|Number} dividend Dividend time expression
   * @param {Number} divisor Dividor number
   * @returns {String}
   */
  Kairos.divide = function (dividend, divisor) {
    return Kairos.with(dividend).divide(divisor).toExpression();
  };

  /**
   * Returns a fraction of the current time
   * 
   * @memberof module:Kairos
   * @method getFraction
   * @param {String|Number} time
   * @param {Number} numerator
   * @param {Number} denominator
   * @returns {String}
   */
  Kairos.getFraction = function (time, numerator, denominator) {
    if (numerator > denominator) {
      throw new Error('Improper fraction');
    }
    return Kairos.with(time).multiply(numerator).divide(denominator).toExpression();
  };

  /**
   * Returns a time expression representing the time between starting time and ending time
   * 
   * @memberof module:Kairos
   * @method getInterval
   * @param {String|Number} time1 time expression representing the starting time
   * @param {String|Number} time2 time expression representing the ending time
   * @returns {String}
   */
  Kairos.getInterval = function (starting, ending) {
    var st = new Kairos.Gnomon(starting);
    var en = new Kairos.Gnomon(ending);
    if (st.compareTo(en) > 0) {
      throw new Error('Starting time must be bigger than ending time');
    }
    return en.minus(st).toExpression();
  };

  /**
   * Converts the given time expression to milliseconds
   *
   * @memberof module:Kairos
   * @method toMilliseconds
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toMilliseconds = function (expression) {
    return Kairos.with(expression).toMilliseconds();
  };

  /**
   * Converts the given time expression to seconds
   *
   * @memberof module:Kairos
   * @method toSeconds
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toSeconds = function (expression) {
    return Kairos.with(expression).toSeconds();
  };

  /**
   * Converts the given time expression to minutes
   *
   * @memberof module:Kairos
   * @method toMinutes
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toMinutes = function (expression) {
    return Kairos.with(expression).toMinutes();
  };

  /**
   * Converts the given time expression to hours
   *
   * @memberof module:Kairos
   * @method toHours
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toHours = function (expression) {
    return Kairos.with(expression).toHours();
  };

  /**
   * Compares first time with second time and returns -1, 0 or 1 if first value
   * is smaller, equals or bigger than second value
   * 
   * @memberof module:Kairos
   * @method compare
   * @param {String|Number} time1 Time expression
   * @param {String|Number} time2 Time expression for comparation
   * @returns {Number}
   */
  Kairos.compare = function (time1, time2) {
    return Kairos.with(time1).compareTo(time2);
  };

  /**
   * Returns the minimum value from the given values
   * 
   * @memberof module:Kairos
   * @method min
   * @param {String[]|Number[]|Kairos.Gnomon[]} values Array with time expressions
   * @returns {String}
   */
  Kairos.min = function (values) {
    if (!(values instanceof Array)) {
      values = Array.prototype.slice.call(arguments);
    }

    var min = values.reduce(function (previous, current) {
      if (!(previous instanceof Kairos.Gnomon)) {
        previous = new Kairos.Gnomon(previous ? previous : 0);
      }
      if (!(current instanceof Kairos.Gnomon)) {
        current = new Kairos.Gnomon(current ? current : 0);
      }
      return ( previous.toMilliseconds() < current.toMilliseconds() ? previous : current );
    });
    
    return (min instanceof Kairos.Gnomon) ? min.toExpression() : new Kairos.Gnomon(min).toExpression();
  };

  /**
   * Returns the maximum value from the given values
   * 
   * @memberof module:Kairos
   * @method max
   * @param {String[]|Number[]|Kairos.Gnomon[]} values Array with time expressions
   * @returns {String}
   */
  Kairos.max = function (values) {
    if (!(values instanceof Array)) {
      values = Array.prototype.slice.call(arguments);
    }

    var max = values.reduce(function (previous, current) {
      if (!(previous instanceof Kairos.Gnomon)) {
        previous = new Kairos.Gnomon(previous ? previous : 0);
      }
      if (!(current instanceof Kairos.Gnomon)) {
        current = new Kairos.Gnomon(current ? current : 0);
      }
      return ( previous.toMilliseconds() > current.toMilliseconds() ? previous : current );
    });

    return (max instanceof Kairos.Gnomon) ? max.toExpression() : new Kairos.Gnomon(max).toExpression();
  };

  // Node.js
  if (typeof module === 'object' && module.exports) {
    //=include /engine/Gnomon.js
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

  // Polyfill
  Math.trunc = Math.trunc || function (x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  };
}());