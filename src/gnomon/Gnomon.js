/**
 * @requires ../kairos.js
 */
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
   * @param {String} expression Time expression
   * @constructor
   */
  Kairos.Gnomon = function (expression) {
    if (!expression) {
      throw new Error('Expression is undefined');
    }

    var timeSteps = expression.split(':');
    for (var i = 0, len = timeSteps.length; i < len; i++) {
      var timeStep = timeSteps[i];

      if (!isNaN(timeStep)) {
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
          default:
            throw new Error('Wrong time expression');
        }
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
        instance.milliseconds -= instance.getMilliseconds();
        break;
      case MILLIS.SECOND:
        instance.milliseconds -= (instance.getSeconds() * MILLIS.SECOND);
        break;
      case MILLIS.MINUTE:
        instance.milliseconds -= (instance.getMinutes() * MILLIS.MINUTE);
        break;
      case MILLIS.HOUR:
        instance.milliseconds -= (instance.getHours() * MILLIS.HOUR);
        break;
    }
    return instance.milliseconds + (millis * time);
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
   */
  Kairos.Gnomon.prototype.setHours = function (hours) {
    this.milliseconds = _parse(this, MILLIS.HOUR, hours);
  };

  /**
   *
   * @returns {*|Number}
   */
  Kairos.Gnomon.prototype.getHours = function () {
    return Math.floor(this.milliseconds / MILLIS.HOUR);
  };

  /**
   *
   * @param {Number} minutes
   */
  Kairos.Gnomon.prototype.setMinutes = function (minutes) {
    this.milliseconds = _parse(this, MILLIS.MINUTE, minutes);
  };

  /**
   *
   * @returns {*|Number}
   */
  Kairos.Gnomon.prototype.getMinutes = function () {
    return Math.floor(Math.floor(this.milliseconds - (Math.floor(this.toHours()) * MILLIS.HOUR)) / MILLIS.MINUTE);
  };

  /**
   *
   * @param {Number} seconds
   */
  Kairos.Gnomon.prototype.setSeconds = function (seconds) {
    this.milliseconds = _parse(this, MILLIS.SECOND, seconds);
  };

  /**
   *
   * @returns {*|Number}
   */
  Kairos.Gnomon.prototype.getSeconds = function () {
    return Math.floor(Math.floor(this.milliseconds - (Math.floor(this.toMinutes()) * MILLIS.MINUTE)) / MILLIS.SECOND);
  };

  /**
   *
   * @param {Number} milliseconds
   */
  Kairos.Gnomon.prototype.setMilliseconds = function (milliseconds) {
    this.milliseconds = _parse(this, 1, milliseconds);
  };

  /**
   *
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getMilliseconds = function () {
    return Math.floor(this.milliseconds - (Math.floor(this.toSeconds()) * MILLIS.SECOND));
  };

  /**
   *
   * @param {Number} hours
   */
  Kairos.Gnomon.prototype.addHours = function (hours) {
    this.milliseconds += (MILLIS.HOUR * hours);
  };

  /**
   *
   * @param {Number} minutes
   */
  Kairos.Gnomon.prototype.addMinutes = function (minutes) {
    this.milliseconds += (MILLIS.MINUTE * minutes);
  };

  /**
   *
   * @param {Number} seconds
   */
  Kairos.Gnomon.prototype.addSeconds = function (seconds) {
    this.milliseconds += (MILLIS.SECOND * seconds);
  };

  /**
   *
   * @param {Number} milliseconds
   */
  Kairos.Gnomon.prototype.addMilliseconds = function (milliseconds) {
    this.milliseconds += milliseconds;
  };

  /**
   *
   * @returns {Number}
   */
  Kairos.Gnomon.prototype.toHours = function () {
    return (this.milliseconds / MILLIS.HOUR);
  };

  /**
   *
   * @returns {Number}
   */
  Kairos.Gnomon.prototype.toMinutes = function () {
    return (this.milliseconds / MILLIS.MINUTE);
  };

  /**
   *
   * @returns {Number}
   */
  Kairos.Gnomon.prototype.toSeconds = function () {
    return (this.milliseconds / MILLIS.SECOND);
  };

  /**
   *
   * @returns {Number}
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
    expression += ('00' + Math.floor(this.getHours())).slice(-2) + ':';
    // Minutes
    expression += ('00' + Math.floor(this.getMinutes())).slice(-2);
    // Seconds
    if (this.getSeconds() > 0 || this.getMilliseconds() > 0) {
      expression += ':' + ('00' + Math.floor(this.getSeconds())).slice(-2);
    }
    // Millis
    if (this.getMilliseconds() > 0) {
      expression += ':' + ('000' + Math.floor(this.getMilliseconds())).slice(-3);
    }
    return expression;
  };

  /**
   *
   * @param {Kairos.Gnomon} addend
   */
  Kairos.Gnomon.prototype.plus = function (addend) {
    this.milliseconds += addend.toMilliseconds();
  };

  /**
   *
   * @param {Kairos.Gnomon} subtrahend
   */
  Kairos.Gnomon.prototype.minus = function (subtrahend) {
    this.milliseconds -= subtrahend.toMilliseconds();
  };
}());
