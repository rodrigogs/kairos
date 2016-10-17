/**
 * @module Kairos
 */
(function () {

  'use strict';

  var Kairos = {};

  // Set defaults
  Kairos._pattern = '#hh:mm:ss.SSS';
  Kairos._validator = new RegExp(/^[+-]?\d\d:\d\d:\d\d\.\d\d\d/);
  Kairos._autoParser = false;

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
   * Avoid conflict in case of another instance of Kairos is already in the scope.
   *
   * @memberof module:Kairos
   * @method noConflict
   * @returns {Object} Previous Kairos object
   */
  Kairos.noConflict = function () {
    root.Kairos = previous_Kairos;
    return Kairos;
  };

  /**
   * Sets Kairos time expression pattern.
   * Pattern structure is the following:
   * <ul>
   *  <li># -> sign</li>
   *  <li>h -> hours</li>
   *  <li>m -> minutes</li>
   *  <li>s -> seconds</li>
   *  <li>S -> milliseconds</li>
   * </ul>
   *
   * @memberof module:Kairos
   * @method setPattern
   * @param {String} pattern The pattern to parse and format time expressions
   * @example Kairos.setPattern('#hh:mm:ss.SSS');
   */
  Kairos.setPattern = function (pattern) {
    Kairos._validator = Kairos.Lexicon.getValidator(pattern);
    Kairos._pattern = pattern;
  };

  /**
   * Gets current Kairos pattern.
   *
   * @memberof module:Kairos
   * @method getPattern
   * @returns {String} Current Kairos pattern
   */
  Kairos.getPattern = function () {
    return Kairos._pattern;
  };

  /**
   * Sets Kairos configuration for auto parse feature.
   *
   * @memberof module:Kairos
   * @method setAutoParser
   * @param {Boolean} yN True to use or false to not use auto parser
   * @example Kairos.setAutoParser(true);
   */
  Kairos.setAutoParser = function (yN) {
    Kairos._autoParser = !!yN;
  };

  /**
   * Gets current Kairos configuration for auto parse feature.
   *
   * @memberof module:Kairos
   * @method getAutoParser
   * @returns {Boolean} True if auto parse is being used or false if not
   */
  Kairos.getAutoParser = function () {
    return Kairos._autoParser;
  };

  /**
   * Validates the give expression with the current or given pattern.
   *
   * @memberof module:Kairos
   * @method validate
   * @param {String} expression Time expression, milliseconds or a Kairos.Engine instance to validate
   * @param {String} pattern Pattern to test the expression
   * @example Kairos.validate('10:30', 'hh:mm');
   * @returns {Boolean} True if valid, false if invalid
   */
  Kairos.validate = function (expression, pattern) {
    return Kairos.Lexicon.validate(expression, pattern);
  };

  /**
   * Returns a new Kairos.Engine instance.
   *
   * @memberof module:Kairos
   * @method new
   * @param {String|Number|Kairos.Engine} time Time expression, milliseconds or a Kairos.Engine instance to create an instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.new('01:00', 'hh:mm');
   * @returns {Kairos.Engine} Kairos.Engine instance from the given time
   */
  Kairos.new = function (time, pattern) {
    return new Kairos.Engine(time, pattern);
  };

  /**
   * Returns an instance of Kairos.Engine with absolute time.
   *
   * @memberof module:Kairos
   * @method absolute
   * @param {String|Number|Kairos.Engine} time Time expression, milliseconds or a Kairos.Engine instance to get its absolute value
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.absolute('-01:00', '#hh:mm');
   * @returns {Kairos.Engine} Kairos.Engine instance with absolute value
   */
  Kairos.absolute = function (time, pattern) {
    return Kairos.new(time, pattern).toAbsolute();
  };

  /**
   * Sums augend time with addend time.
   *
   * @memberof module:Kairos
   * @method plus
   * @param {String|Number|Kairos.Engine} augend Augend time expression, milliseconds or a Kairos.Engine instance
   * @param {String|Number|Kairos.Engine} addend Addend time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.plus(currentInstance, '01:00');
   * @example Kairos.plus('01:00', '01:00', 'hh:mm');
   * @example Kairos.plus('01:00', 1000);
   * @returns {Kairos.Engine} Kairos.Engine instance with the sum result
   */
  Kairos.plus = function (augend, addend, pattern) {
    return Kairos.new(augend, pattern).plus(addend, pattern);
  };

  /**
   * Subtracts minuend time with subtrahend time.
   *
   * @memberof module:Kairos
   * @method minus
   * @param {String|Number|Kairos.Engine} minuend Minuend time expression
   * @param {String|Number|Kairos.Engine} subtrahend Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.minus(currentInstance, '01:00');
   * @example Kairos.minus('02:00', '01:00', 'hh:mm');
   * @example Kairos.minus('01:00', 1000);
   * @returns {Kairos.Engine} Kairos.Engine instance with subtract result
   */
  Kairos.minus = function (minuend, subtrahend, pattern) {
    return Kairos.new(minuend, pattern).minus(subtrahend, pattern);
  };

  /**
   * Multiplies multiplier by the multiplicand.
   *
   * @memberof module:Kairos
   * @method multiply
   * @param {String|Number|Kairos.Engine} multiplier Multiplier time expression, milliseconds or a Kairos.Engine instance
   * @param {Number} multiplicand Multiplicand value
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.multiply(currentInstance, 2);
   * @example Kairos.multiply('02:00', 10, 'hh:mm');
   * @example Kairos.multiply(300000, 5);
   * @returns {Kairos.Engine} Kairos.Engine instance with multiplication result
   */
  Kairos.multiply = function (multiplier, multiplicand, pattern) {
    return Kairos.new(multiplier, pattern).multiply(multiplicand);
  };

  /**
   * Divides dividend by the divisor.
   *
   * @memberof module:Kairos
   * @method divide
   * @param {String|Number|Kairos.Engine} dividend Dividend time expression, milliseconds or a Kairos.Engine instance
   * @param {Number} divisor Divisor value
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.divide(currentInstance, 2);
   * @example Kairos.divide('02:00', 10, 'hh:mm');
   * @example Kairos.divide(300000, 5);
   * @returns {Kairos.Engine} Kairos.Engine instance with division result
   */
  Kairos.divide = function (dividend, divisor, pattern) {
    return Kairos.new(dividend, pattern).divide(divisor);
  };

  /**
   * Returns a fraction of the current time.
   *
   * @memberof module:Kairos
   * @method getFraction
   * @param {String|Number|Kairos.Engine} time Time expression, milliseconds or a Kairos.Engine instance to extract a fraction
   * @param {Number} numerator Numerator value
   * @param {Number} denominator Denominator value
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.getFraction(currentInstance, 2, 3);
   * @example Kairos.getFraction('02:00', 2, 3 'hh:mm');
   * @example Kairos.getFraction(300000, 3, 4);
   * @returns {Kairos.Engine} Kairos.Engine instance with the fraction extracted
   */
  Kairos.getFraction = function (time, numerator, denominator, pattern) {
    if (numerator > denominator) {
      throw new Error('Improper fraction');
    }
    return Kairos.new(time, pattern).multiply(numerator).divide(denominator);
  };

  /**
   * Returns a time expression representing the time between starting time and ending time.
   *
   * @memberof module:Kairos
   * @method getInterval
   * @param {String|Number|Kairos.Engine} time1 Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String|Number|Kairos.Engine} time2 Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.getInterval(instance, anotherInstance);
   * @example Kairos.getInterval('02:00', '03:00', 'hh:mm');
   * @example Kairos.getInterval(300000, 800000);
   * @returns {Kairos.Engine} Kairos.Engine instance with the interval between time1 and time2
   */
  Kairos.getInterval = function (time1, time2, pattern) {
    return Kairos.new(time1, pattern).minus(time2, pattern).toAbsolute();
  };

  /**
   * Converts the given time expression to milliseconds.
   *
   * @memberof module:Kairos
   * @method toMilliseconds
   * @param {String|Number} time Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.toMilliseconds(instance);
   * @example Kairos.toMilliseconds('02:00', 'hh:mm');
   * @example Kairos.toMilliseconds(300000);
   * @returns {Number} Total milliseconds in the time expression
   */
  Kairos.toMilliseconds = function (time, pattern) {
    return Kairos.new(time, pattern).toMilliseconds();
  };

  /**
   * Converts the given time expression to seconds.
   *
   * @memberof module:Kairos
   * @method toSeconds
   * @param {String|Number} time Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.toSeconds(instance);
   * @example Kairos.toSeconds('02:00', 'hh:mm');
   * @example Kairos.toSeconds(300000);
   * @returns {Number} Total seconds in the time expression
   */
  Kairos.toSeconds = function (time, pattern) {
    return Kairos.new(time, pattern).toSeconds();
  };

  /**
   * Converts the given time expression to minutes.
   *
   * @memberof module:Kairos
   * @method toMinutes
   * @param {String|Number} time Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.toMinutes(instance);
   * @example Kairos.toMinutes('02:00', 'hh:mm');
   * @example Kairos.toMinutes(300000);
   * @returns {Number} Total minutes in the time expression
   */
  Kairos.toMinutes = function (time, pattern) {
    return Kairos.new(time, pattern).toMinutes();
  };

  /**
   * Converts the given time expression to hours.
   *
   * @memberof module:Kairos
   * @method toHours
   * @param {String|Number} time Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.toHours(instance);
   * @example Kairos.toHours('02:00', 'hh:mm');
   * @example Kairos.toHours(300000);
   * @returns {Number} Total hours in the time expression
   */
  Kairos.toHours = function (time, pattern) {
    return Kairos.new(time, pattern).toHours();
  };

  /**
   * Compares first time with second time and returns -1, 0 or 1 if first value
   * is smaller, equals or bigger than second value.
   *
   * @memberof module:Kairos
   * @method compare
   * @param {String|Number} comparand Literal time expression, milliseconds or a Kairos.Engine instance to compare with
   * @param {String|Number} comparator Literal time expression, milliseconds or a Kairos.Engine instance to be compared with
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.compare(instance, anotherInstance);
   * @example Kairos.compare('02:00', '03:00', 'hh:mm');
   * @example Kairos.compare(300000, 10000);
   * @returns {Number} Smaller -1 | Equals 0 | Bigger 1
   */
  Kairos.compare = function (comparand, comparator, pattern) {
    return Kairos.new(comparand, pattern).compareTo(comparator, pattern);
  };

  /**
   * Returns the minimum value from the given values.
   *
   * @memberof module:Kairos
   * @method min
   * @param {String[]|Number[]|Kairos.Engine[]} values Array with time expressions
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.min(a, b, c, d);
   * @example Kairos.min(['02:00', '03:00', '01:00', '10:00'], 'hh:mm');
   * @example Kairos.min(300000, 10000);
   * @returns {Kairos.Engine} Kairos.Engine instance with the lowest value found in the list
   */
  Kairos.min = function (values, pattern) {
    if (!(values instanceof Array)) {
      pattern = null;
      values = Array.prototype.slice.call(arguments);
    }

    var min = values.reduce(function (previous, current) {
      return Kairos.compare(previous, current, pattern) < 0 ? previous : current;
    });

    return Kairos.new(min, pattern);
  };

  /**
   * Returns the maximum value from the given values.
   *
   * @memberof module:Kairos
   * @method max
   * @param {String[]|Number[]|Kairos.Engine[]} values Array with time expressions
   * @param {String} [pattern] Overrides Kairos pattern
   * @example Kairos.max(a, b, c, d);
   * @example Kairos.max(['02:00', '03:00', '01:00', '10:00'], 'hh:mm');
   * @example Kairos.max(300000, 10000);
   * @returns {String} Kairos.Engine instance with the greatest value found in the list
   */
  Kairos.max = function (values, pattern) {
    if (!(values instanceof Array)) {
      pattern = null;
      values = Array.prototype.slice.call(arguments);
    }

    var max = values.reduce(function (previous, current) {
      return Kairos.compare(previous, current, pattern) > 0 ? previous : current;
    });

    return Kairos.new(max, pattern);
  };

  // Node.js
  if (typeof module === 'object' && module.exports) {
    //=include /Lexicon.js
    //=include /Engine.js
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
