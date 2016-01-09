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
    if (!(addend instanceof Kairos.Gnomon)) {
      addend = new Kairos.Gnomon(addend);
    }
    this.milliseconds += addend.toMilliseconds();
    return this;
  };

  /**
   *
   * @param {Number|String|Kairos.Gnomon} subtrahend
   * @returns {Kairos.Gnomon} self
   */
  Kairos.Gnomon.prototype.minus = function (subtrahend) {
    if (!(subtrahend instanceof Kairos.Gnomon)) {
      subtrahend = new Kairos.Gnomon(subtrahend);
    }
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
   * @param {Kairos.Gnomon} another
   * @returns {Number}
   */
  Kairos.Gnomon.prototype.compareTo = function (another) {
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

  // Polyfill
  Math.trunc = Math.trunc || function (x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  };
}());