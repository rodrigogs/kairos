/**
 * Kairos.js - A non date-based time calculator
 * @author Rodrigo Gomes da Silva <rodrigo.smscom@gmail.com>
 * @version v1.1.0
 * @link https://github.com/kairos
 * @license BSD-2-Clause
 */
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
    (function () {
      'use strict';
    
      /**
       *
       * @type {{SECOND: number, MINUTE: number, HOUR: number}}
       */
      var MILLIS = {
        SECOND: 1000,
        MINUTE: 60 * 1000,
        HOUR: 60 * 60 * 1000
      };
    
      /**
       * Gnomon is the time engine for Kairos. It's name references the first solar clock ever made.
       *
       * @param {String|Number} expression Time expression
       * @constructor
       */
      Kairos.Gnomon = function (expression) {
        if (typeof expression === 'number') {
    
          this.milliseconds = expression;
    
        } else if (typeof expression === 'string' && expression.length > 0) {
          
          if (!Kairos.validateExpression(expression)) {
            throw new Error('Invalid time expression');
          }
    
          var timeSteps = expression.split(':');
          var positive = expression.slice(0, 1)[0] !== '-';
    
          for (var i = 0, len = timeSteps.length; i < len; i++) {
            var timeStep = timeSteps[i];
    
            timeStep = Math.abs(timeStep);
            switch (i) {
              case 0:
                this.milliseconds = _parse(this, MILLIS.HOUR, timeStep);
                break;
              case 1:
                this.milliseconds = _parse(this, MILLIS.MINUTE, timeStep);
                break;
              case 2:
                this.milliseconds = _parse(this, MILLIS.SECOND, timeStep);
                break;
              case 3:
                this.milliseconds = _parse(this, 1, timeStep);
                break;
            }
          }
          if (!positive) {
            this.milliseconds = -Math.abs(this.milliseconds);
          }
        }
      };
    
      /**
       * @param {Kairos.Gnomon} instance
       * @param {Number} millis
       * @param {Number} time
       * @returns {Number}
       * @private
       */
      var _parse = function (instance, millis, time) {
        switch (millis) {
          case 1:
            instance.removeMilliseconds(instance.getMilliseconds());
            break;
          case MILLIS.SECOND:
            instance.removeSeconds(instance.getSeconds());
            break;
          case MILLIS.MINUTE:
            instance.removeMinutes(instance.getMinutes());
            break;
          case MILLIS.HOUR:
            instance.removeHours(instance.getHours());
            break;
        }
        return instance.milliseconds + (time * millis);
      };
      
      /**
       * @type {Number}
       * @default 0
       * @protected
       */
      Kairos.Gnomon.prototype.milliseconds = 0;
    
      /**
       *
       * @param {Number} hours
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.setHours = function (hours) {
        this.milliseconds = _parse(this, MILLIS.HOUR, hours);
        return this;
      };
    
      /**
       *
       * @returns {*|Number}
       */
      Kairos.Gnomon.prototype.getHours = function () {
        return Math.trunc(this.milliseconds / MILLIS.HOUR);
      };
    
      /**
       *
       * @param {Number} minutes
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.setMinutes = function (minutes) {
        this.milliseconds = _parse(this, MILLIS.MINUTE, minutes);
        return this;
      };
    
      /**
       *
       * @returns {*|Number}
       */
      Kairos.Gnomon.prototype.getMinutes = function () {
        return Math.trunc(Math.trunc(this.milliseconds - (Math.trunc(this.toHours()) * MILLIS.HOUR)) / MILLIS.MINUTE);
      };
    
      /**
       *
       * @param {Number} seconds
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.setSeconds = function (seconds) {
        this.milliseconds = _parse(this, MILLIS.SECOND, seconds);
        return this;
      };
    
      /**
       *
       * @returns {*|Number}
       */
      Kairos.Gnomon.prototype.getSeconds = function () {
        return Math.trunc(Math.trunc(this.milliseconds - (Math.trunc(this.toMinutes()) * MILLIS.MINUTE)) / MILLIS.SECOND);
      };
    
      /**
       *
       * @param {Number} milliseconds
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.setMilliseconds = function (milliseconds) {
        this.milliseconds = _parse(this, 1, milliseconds);
        return this;
      };
    
      /**
       *
       * @returns {Number|*}
       */
      Kairos.Gnomon.prototype.getMilliseconds = function () {
        return Math.trunc(this.milliseconds - (Math.trunc(this.toSeconds()) * MILLIS.SECOND));
      };
    
      /**
       *
       * @param {Number} hours
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.addHours = function (hours) {
        this.milliseconds += (MILLIS.HOUR * hours);
        return this;
      };
    
      /**
       *
       * @param {Number} minutes
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.addMinutes = function (minutes) {
        this.milliseconds += (MILLIS.MINUTE * minutes);
        return this;
      };
    
      /**
       *
       * @param {Number} seconds
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.addSeconds = function (seconds) {
        this.milliseconds += (MILLIS.SECOND * seconds);
        return this;
      };
    
      /**
       *
       * @param {Number} milliseconds
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.addMilliseconds = function (milliseconds) {
        this.milliseconds += milliseconds;
        return this;
      };
    
      /**
       *
       * @param {Number} hours
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.removeHours = function (hours) {
        this.milliseconds -= (MILLIS.HOUR * hours);
        return this;
      };
    
      /**
       *
       * @param {Number} minutes
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.removeMinutes = function (minutes) {
        this.milliseconds -= (MILLIS.MINUTE * minutes);
        return this;
      };
    
      /**
       *
       * @param {Number} seconds
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.removeSeconds = function (seconds) {
        this.milliseconds -= (MILLIS.SECOND * seconds);
        return this;
      };
    
      /**
       *
       * @param {Number} milliseconds
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.removeMilliseconds = function (milliseconds) {
        this.milliseconds -= milliseconds;
        return this;
      };
    
      /**
       *
       * @returns {Number} hours within the time expression
       */
      Kairos.Gnomon.prototype.toHours = function () {
        return (this.milliseconds / MILLIS.HOUR);
      };
    
      /**
       *
       * @returns {Number} minutes within the time expression
       */
      Kairos.Gnomon.prototype.toMinutes = function () {
        return (this.milliseconds / MILLIS.MINUTE);
      };
    
      /**
       *
       * @returns {Number} seconds within the time expression
       */
      Kairos.Gnomon.prototype.toSeconds = function () {
        return (this.milliseconds / MILLIS.SECOND);
      };
    
      /**
       *
       * @returns {Number} milliseconds within the time expression
       */
      Kairos.Gnomon.prototype.toMilliseconds = function () {
        return this.milliseconds;
      };
    
      /**
       *
       * @returns {String}
       */
      Kairos.Gnomon.prototype.toExpression = function () {
        var expression = '';
        // Hours
        var hours = Math.trunc(Math.abs(this.getHours()));
        expression += ((String(hours).length > 1) ? '' : '0') + hours + ':';
        // Minutes
        expression += ('00' + Math.trunc(Math.abs(this.getMinutes()))).slice(-2);
        // Seconds
        if (this.getSeconds() !== 0 || this.getMilliseconds() !== 0) {
          expression += ':' + ('00' + Math.trunc(Math.abs(this.getSeconds()))).slice(-2);
        }
        // Millis
        if (this.getMilliseconds() !== 0) {
          expression += ':' + ('000' + Math.trunc(Math.abs(this.getMilliseconds()))).slice(-3);
        }
    
        if (this.milliseconds < 0) {
          expression = '-' + expression;
        }
        return expression;
      };
    
      /**
       *
       * @param {Number|String|Kairos.Gnomon} addend
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.plus = function (addend) {
        addend = (addend instanceof Kairos.Gnomon) ? addend : new Kairos.Gnomon(addend);
        this.milliseconds += addend.toMilliseconds();
        return this;
      };
    
      /**
       *
       * @param {Number|String|Kairos.Gnomon} subtrahend
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.minus = function (subtrahend) {
        subtrahend = (subtrahend instanceof Kairos.Gnomon) ? subtrahend : new Kairos.Gnomon(subtrahend);
        this.milliseconds -= subtrahend.toMilliseconds();
        return this;
      };
    
      /**
       *
       * @param {Number} multiplicand
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.multiply = function (multiplicand) {
        this.milliseconds *= multiplicand;
        return this;
      };
    
      /**
       *
       * @param {Number} dividend
       * @returns {Kairos.Gnomon} self
       */
      Kairos.Gnomon.prototype.divide = function (dividend) {
        this.milliseconds /= dividend;
        return this;
      };
    
      /**
       * Compares with another instance.
       * Smaller  -1
       * Equals   0
       * Bigger   1
       * 
       * @param {String|Number|Kairos.Gnomon} another Expression to compare with
       * @returns {Number}
       */
      Kairos.Gnomon.prototype.compareTo = function (another) {
        another = (another instanceof Kairos.Gnomon) ? another : new Kairos.Gnomon(another);
    
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
    }());
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