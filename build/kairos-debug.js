/**
 * Kairos.js - A non date-based time calculator
 * @author Rodrigo Gomes da Silva <rodrigo.smscom@gmail.com>
 * @version v2.1.2
 * @link https://github.com/kairos
 * @license BSD-2-Clause
 */
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

/**
 * @module Lexicon
 */
(function () {

  'use strict';

  /**
   * @type {{SIGN: string, HOURS: string, MINUTES: string, SECONDS: string, MILLISECONDS: string, ESCAPE: string}}
   */
  var TOKENS = {
    SIGN: '#', HOURS: 'h', MINUTES: 'm',
    SECONDS: 's', MILLISECONDS: 'S', ESCAPE: '\\'
  };

  Kairos.Lexicon = {};

  /**
   * Gets a regex from a pattern.
   *
   * @memberof module:Lexicon
   * @method getValidator
   * @param {String} [pattern] Pattern to convert
   * @example Kairos.Lexicon.getValidator('#hh:mm:ss.SSS');
   * @returns {RegExp}
   */
  Kairos.Lexicon.getValidator = function (pattern) {
    if (typeof pattern !== 'string') {
      pattern = Kairos._pattern;
    }
    if (pattern === Kairos._pattern) {
      return Kairos._validator;
    }

    var regex = '';
    for (var i = 0, len = pattern.length; len > i; i++) {
      var cur = pattern[i];
      switch (cur) {
        case TOKENS.SIGN:
          regex += '^[+-]?';
          break;
        case TOKENS.HOURS:
        case TOKENS.MINUTES:
        case TOKENS.SECONDS:
        case TOKENS.MILLISECONDS:
          regex += '\\d';
          break;
        default:
          regex += cur.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      }
    }

    return new RegExp(regex);
  };

  /**
   * Validates if given expression matches the current pattern.
   *
   * @memberof module:Lexicon
   * @method validate
   * @param {String} expression Time expression to be validated
   * @param {String} [pattern] Pattern to validate
   * @example Kairos.Lexicon.validate('10:00:00.000', 'hh:mm:ss.SSS');
   * @returns {Boolean} True if expression is valid, false if expression is invalid
   */
  Kairos.Lexicon.validate = function (expression, pattern) {
    return Kairos.Lexicon.getValidator(pattern).test(expression);
  };

  /**
   * Parses given time expression to a Kairos.Engine instance.
   *
   * @memberof module:Lexicon
   * @method parse
   * @param {String} expression Time expression to be parsed
   * @param {String} [pattern] Pattern to parse
   * @example Kairos.Lexicon.parse('01:00:03', 'hh:mm:ss');
   * @returns {Kairos.Engine} Given expression parsed to Kairos.Engine
   */
  Kairos.Lexicon.parse = function (expression, pattern) {
    if (!pattern) {
      pattern = Kairos._pattern;
    }
    if (!Kairos.Lexicon.validate(expression, pattern)) {
      throw new Error('Cannot parse expression. Time format doesn\'t match the current time pattern.');
    }

    var sign = true, hours = '', minutes = '', seconds = '', milliseconds = '';

    for (var i = 0, len = pattern.length; len > i; i++) {
      var cur = pattern[i];
      switch (cur) {
        case TOKENS.SIGN:
          var validSign = (['+', '-'].indexOf(expression[i]) !== -1);
          if (!validSign) {
            pattern = pattern.slice(0, i) + pattern.slice(i + 1);
            len--;
            i--;
          } else {
            sign = expression[i] === '+';
          }
          break;
        case TOKENS.HOURS:
          hours += expression[i];
          break;
        case TOKENS.MINUTES:
          minutes += expression[i];
          break;
        case TOKENS.SECONDS:
          seconds += expression[i];
          break;
        case TOKENS.MILLISECONDS:
          milliseconds += expression[i];
          break;
      }
    }

    var result = Kairos.new()
        .addHours(hours ? +hours : 0)
        .addMinutes(minutes ? +minutes : 0)
        .addSeconds(seconds ? +seconds : 0)
        .addMilliseconds(milliseconds ? +milliseconds : 0);

    if (!sign) {
      result.milliseconds =- result.milliseconds;
    }

    return result;
  };

  /**
   * Returns a formated string from an Kairos.Engine instance.
   *
   * You can escape any character by using \ before it.
   *
   * @memberof module:Lexicon
   * @method format
   * @param {Kairos.Engine} instance The instance to format
   * @param {String} [pattern] Pattern to format
   * @param {Boolean} allowOverflow If true, when hour field is bigger than the pattern definition, it will be printed anyway
   * @example Kairos.Lexicon.format(Kairos.new('10:30'), 'mm:hh');
   * @returns {String} Formated time expression
   */
  Kairos.Lexicon.format = function (instance, pattern, allowOverflow) {
    if (!pattern) {
      pattern = Kairos._pattern;
    }

    var sign = instance.milliseconds >= 0,
      hours = String(Math.abs(instance.getHours())),
      minutes = String(Math.abs(instance.getMinutes())),
      seconds = String(Math.abs(instance.getSeconds())),
      milliseconds = String(Math.abs(instance.getMilliseconds()));

    var result = '';
    var escapedHourTokens = (pattern.match(/\\h/g) || []).length;
    var hourTokens = ((pattern.match(/h/g) || []).length - escapedHourTokens);
    var usedHourTokens = 0;

    for (var i = pattern.length - 1; i >= 0; i--) {
      var cur = pattern[i];
      var hasLeadingEscape = pattern[i - 1] === TOKENS.ESCAPE;

      if (hasLeadingEscape) {
        result = cur + result;
        i--;
        continue;
      }

      switch (cur) {
        case TOKENS.SIGN:
          result = (sign ? '+' : '-') + result;
          break;
        case TOKENS.HOURS:
          usedHourTokens++;

          var isLastHourToken = usedHourTokens === hourTokens;
          var isOverflowing = isLastHourToken && hours.length > 1;

          if (isOverflowing && allowOverflow) {
            result = hours + result;
            allowOverflow = false;
            break;
          }

          result = (hours.slice(-1) || '0') + result;
          if (hours.length > 0) {
            hours = hours.slice(0, hours.length - 1);
          }
          break;
        case TOKENS.MINUTES:
          result = (minutes.slice(-1) || '0') + result;
          if (minutes.length > 0) {
            minutes = minutes.slice(0, minutes.length - 1);
          }
          break;
        case TOKENS.SECONDS:
          result = (seconds.slice(-1) || '0') + result;
          if (seconds.length > 0) {
            seconds = seconds.slice(0, seconds.length - 1);
          }
          break;
        case TOKENS.MILLISECONDS:
          result = (milliseconds.slice(-1) || '0') + result;
          if (milliseconds.length > 0) {
            milliseconds = milliseconds.slice(0, milliseconds.length - 1);
          }
          break;
        default:
          if (!hasLeadingEscape) {
            result = cur + result;
          }
      }
    }

    return result;
  };

  /**
   * Tries to extract a pattern from the given expression.
   *
   * @memberof module:Lexicon
   * @method findPattern
   * @param {String} expression Expression to be analysed
   * @example Kairos.Lexicon.findPattern('01:05:30');
   * @returns {String} Extracted pattern
   */
  Kairos.Lexicon.findPattern = function (expression) {
    var pattern = '',
        currentStep = TOKENS.HOURS;
    for (var i = 0, len = expression.length; len > i; i++) {
      var cur = expression[i];

      if (['+', '-'].indexOf(cur) !== -1) {
        pattern += TOKENS.SIGN;
        continue;
      }

      if (!isNaN(cur)) {
        pattern += currentStep || cur;
        continue;
      }

      if (isNaN(cur)) {
        pattern += cur;
        switch (currentStep) {
          case TOKENS.HOURS:
            currentStep = TOKENS.MINUTES;
            break;
          case TOKENS.MINUTES:
            currentStep = TOKENS.SECONDS;
            break;
          case TOKENS.SECONDS:
            currentStep = TOKENS.MILLISECONDS;
            break;
          default:
            currentStep = false;
        }
      }
    }

    return pattern;
  };
}());

(function () {

  'use strict';

  /**
   * @type {{SECOND: number, MINUTE: number, HOUR: number}}
   * @ignore
   */
  var MILLIS = {
    SECOND: 1000,
    MINUTE: 60000,
    HOUR: 3600000
  };

  /**
   * Kairos time engine.
   *
   * @param {String|Number|Kairos.Engine} expression Literal time expression, milliseconds or a Kairos.Engine instance
   * @param {String} [pattern] Overrides Kairos pattern
   * @example new Kairos.Engine('10:30', 'hh:mm');
   * @example new Kairos.Engine(1000);
   * @example new kairos.Engine(previousInstance);
   * @constructor
   */
  Kairos.Engine = function (expression, pattern) {
    if (!expression) {
      return;
    }

    if (expression instanceof Kairos.Engine) {
      return expression;
    }

    if (typeof expression === 'number') {
      this.milliseconds = expression;
      return this;
    }

    if (typeof expression === 'string' && expression.length > 0) {
      if (Kairos.getAutoParser()) {
        pattern = Kairos.Lexicon.findPattern(expression);
      }
      return new Kairos.Lexicon.parse(expression, pattern);
    }

    throw new Error('Invalid arguments');
  };

  /**
   * @param {Number} millis
   * @param {Number} time
   * @returns {Number}
   * @private
   */
  Kairos.Engine.prototype._resolveStep = function (millis, time) {
    switch (millis) {
      case 1:
        this.removeMilliseconds(this.getMilliseconds());
        break;
      case MILLIS.SECOND:
        this.removeSeconds(this.getSeconds());
        break;
      case MILLIS.MINUTE:
        this.removeMinutes(this.getMinutes());
        break;
      case MILLIS.HOUR:
        this.removeHours(this.getHours());
        break;
    }
    return this.milliseconds + (time * millis);
  };

  /**
   * @type {Number}
   * @default 0
   * @protected
   */
  Kairos.Engine.prototype.milliseconds = 0;

  /**
   * Sets hours fraction in the current instance.
   *
   * @param {Number} hours Hours to set
   * @example new Kairos.Engine('02:00').setHours(1);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.setHours = function (hours) {
    this.milliseconds = this._resolveStep(MILLIS.HOUR, hours);
    return this;
  };

  /**
   * Gets hours fraction in the current instance.
   *
   * @example new Kairos.Engine('01:00').getHours();
   * @returns {Number} Hours fraction from the instance
   */
  Kairos.Engine.prototype.getHours = function () {
    return Math.trunc(this.milliseconds / MILLIS.HOUR);
  };

  /**
   * Sets minutes fraction in the current instance.
   *
   * @param {Number} minutes Minutes to set
   * @example new Kairos.Engine('01:00').setMinutes(30);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.setMinutes = function (minutes) {
    this.milliseconds = this._resolveStep(MILLIS.MINUTE, minutes);
    return this;
  };

  /**
   * Gets minutes fraction in the current instance.
   *
   * @example new Kairos.Engine('01:00').getMinutes();
   * @returns {Number} Minutes fraction from the instance
   */
  Kairos.Engine.prototype.getMinutes = function () {
    return Math.trunc(Math.trunc(this.milliseconds - (Math.trunc(this.toHours()) * MILLIS.HOUR)) / MILLIS.MINUTE);
  };

  /**
   * Sets seconds fraction in the current instance.
   *
   * @param {Number} seconds Seconds to set
   * @example new Kairos.Engine('01:00').setSeconds(30);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.setSeconds = function (seconds) {
    this.milliseconds = this._resolveStep(MILLIS.SECOND, seconds);
    return this;
  };

  /**
   * Gets seconds fraction in the current instance.
   *
   * @example new Kairos.Engine('01:00').getSeconds();
   * @returns {Number} Seconds fraction from the instance
   */
  Kairos.Engine.prototype.getSeconds = function () {
    return Math.trunc(Math.trunc(this.milliseconds - (Math.trunc(this.toMinutes()) * MILLIS.MINUTE)) / MILLIS.SECOND);
  };

  /**
   * Sets milliseconds fraction in the current instance.
   *
   * @param {Number} milliseconds Milliseconds to set
   * @example new Kairos.Engine('01:00').setMilliseconds(200);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.setMilliseconds = function (milliseconds) {
    this.milliseconds = this._resolveStep(1, milliseconds);
    return this;
  };

  /**
   * Gets milliseconds fraction in the current instance.
   *
   * @example new Kairos.Engine('01:00').getMilliseconds();
   * @returns {Number} Milliseconds fraction from the instance
   */
  Kairos.Engine.prototype.getMilliseconds = function () {
    return Math.trunc(this.milliseconds - (Math.trunc(this.toSeconds()) * MILLIS.SECOND));
  };

  /**
   * Adds hours to the current instance.
   *
   * @param {Number} hours Hours to add
   * @example new Kairos.Engine('01:00').addHours(1);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.addHours = function (hours) {
    this.milliseconds += (MILLIS.HOUR * hours);
    return this;
  };

  /**
   * Adds minutes to the current instance.
   *
   * @param {Number} minutes Minutes to add
   * @example new Kairos.Engine('01:00').addMinutes(30);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.addMinutes = function (minutes) {
    this.milliseconds += (MILLIS.MINUTE * minutes);
    return this;
  };

  /**
   * Adds seconds in the current instance.
   *
   * @param {Number} seconds Seconds to add
   * @example new Kairos.Engine('01:00').addSeconds(30);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.addSeconds = function (seconds) {
    this.milliseconds += (MILLIS.SECOND * seconds);
    return this;
  };

  /**
   * Adds milliseconds in the current instance.
   *
   * @param {Number} milliseconds Milliseconds to add
   * @example new Kairos.Engine('01:00').addMilliseconds(500);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.addMilliseconds = function (milliseconds) {
    this.milliseconds += milliseconds;
    return this;
  };

  /**
   * Removes hours from the current instance.
   *
   * @param {Number} hours Hours to remove
   * @example new Kairos.Engine('01:00').removeHours(1);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.removeHours = function (hours) {
    this.milliseconds -= (MILLIS.HOUR * hours);
    return this;
  };

  /**
   * Removes minutes from the current instance.
   *
   * @param {Number} minutes Minutes to remove
   * @example new Kairos.Engine('01:00').removeMinutes(30);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.removeMinutes = function (minutes) {
    this.milliseconds -= (MILLIS.MINUTE * minutes);
    return this;
  };

  /**
   * Removes seconds from the current instance.
   *
   * @param {Number} seconds Seconds to remove
   * @example new Kairos.Engine('01:00').removeSeconds(30);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.removeSeconds = function (seconds) {
    this.milliseconds -= (MILLIS.SECOND * seconds);
    return this;
  };

  /**
   * Removes milliseconds from the current instance.
   *
   * @example new Kairos.Engine('01:00').removeMilliseconds(50);
   * @param {Number} milliseconds Milliseconds to remove
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.removeMilliseconds = function (milliseconds) {
    this.milliseconds -= milliseconds;
    return this;
  };

  /**
   * Returns total hours within the current instance.
   *
   * @example new Kairos.Engine('01:00').toHours();
   * @returns {Number} Hours within the current instance
   */
  Kairos.Engine.prototype.toHours = function () {
    return (this.milliseconds / MILLIS.HOUR);
  };

  /**
   * Returns total minutes within the current instance.
   *
   * @example new Kairos.Engine('01:00').toMinutes();
   * @returns {Number} Minutes within the current instance
   */
  Kairos.Engine.prototype.toMinutes = function () {
    return (this.milliseconds / MILLIS.MINUTE);
  };

  /**
   * Returns total seconds within the current instance.
   *
   * @example new Kairos.Engine('01:00').toSeconds();
   * @returns {Number} Seconds within the current instance
   */
  Kairos.Engine.prototype.toSeconds = function () {
    return (this.milliseconds / MILLIS.SECOND);
  };

  /**
   * Returns total milliseconds within the current instance.
   *
   * @example new Kairos.Engine('01:00').toMilliseconds();
   * @returns {Number} Milliseconds within the current instance
   */
  Kairos.Engine.prototype.toMilliseconds = function () {
    return this.milliseconds;
  };

  /**
   * Makes the current instance's value absolute.
   *
   * @example new Kairos.Engine('01:00').toAbsolute();
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.toAbsolute = function () {
    this.milliseconds = Math.abs(this.milliseconds);
    return this;
  };

  /**
   * Sums the given addend.
   *
   * @param {Number|String|Kairos.Engine} addend
   * @param {String} [pattern] Overrides Kairos pattern
   * @example new Kairos.Engine('01:00').minus('00:30');
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.plus = function (addend, pattern) {
    addend = new Kairos.Engine(addend, pattern);
    this.milliseconds += addend.toMilliseconds();
    return this;
  };

  /**
   * Subtracts the given subtrahend.
   *
   * @param {Number|String|Kairos.Engine} subtrahend
   * @param {String} [pattern] Overrides Kairos pattern
   * @example new Kairos.Engine('01:00').minus('00:30');
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.minus = function (subtrahend, pattern) {
    subtrahend = new Kairos.Engine(subtrahend, pattern);
    this.milliseconds -= subtrahend.toMilliseconds();
    return this;
  };

  /**
   * Multiply by the given multiplicand.
   *
   * @param {Number} multiplicand Multiplicand value
   * @example new Kairos.Engine('01:00').multiply(2);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.multiply = function (multiplicand) {
    this.milliseconds *= multiplicand;
    return this;
  };

  /**
   * Divies by the given dividend.
   *
   * @param {Number} divisor Divisor value
   * @example new Kairos.Engine('01:00').divide(2);
   * @returns {Kairos.Engine} Self
   */
  Kairos.Engine.prototype.divide = function (divisor) {
    this.milliseconds /= divisor;
    return this;
  };

  /**
   * Compares with another instance.
   *
   * @param {String|Number|Kairos.Engine} another Expression to compare with
   * @param {String} [pattern] Overrides Kairos pattern
   * @example new Kairos.Engine('01:00').compareTo('00:30');
   * @returns {Number} Smaller -1 | Equals 0 | Bigger 1
   */
  Kairos.Engine.prototype.compareTo = function (another, pattern) {
    another = new Kairos.Engine(another, pattern);

    if (this.milliseconds < another.toMilliseconds()) {
      return -1;
    }
    if (this.milliseconds === another.toMilliseconds()) {
      return 0;
    }
    if (this.milliseconds > another.toMilliseconds()) {
      return 1;
    }
  };

  /**
   * Returns a string representation of the object.
   *
   * @param {String} pattern Pattern to format the time expression
   * @param {Boolean} allowOverflow If true, when hour field is bigger than the pattern definition, it will be printed anyway
   * @example new Kairos.Engine('22:10').toString('hh:mm');
   * @returns {String} String representing the instance time
   */
  Kairos.Engine.prototype.toString = function (pattern, allowOverflow) {
    if (typeof pattern === 'boolean') {
      allowOverflow = pattern;
      pattern = null;
    }
    return Kairos.Lexicon.format(this, pattern, allowOverflow);
  };
}());
