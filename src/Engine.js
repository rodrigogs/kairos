(function () {

  'use strict';

  /**
   * @type {{SECOND: number, MINUTE: number, HOUR: number}}
   */
  var MILLIS = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000
  };

  /**
   * Kairos time engine.
   *
   * @param {String|Number|Kairos.Engine} expression Literal time expression, milliseconds or a Kairos.Engine instance
   * @pattern {String} [pattern] Overrides Kairos pattern
   * @example new Kairos.Engine('10:30', 'hh:mm');
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
   * @param {Kairos.Engine} instance
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
   * @example new Kairos.Engine('01:00').setHours(1);
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