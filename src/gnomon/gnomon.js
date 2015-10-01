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
            this.setHours(timeStep);
            break;
          case 1:
            this.setMinutes(timeStep);
            break;
          case 2:
            this.setSeconds(timeStep);
            break;
          case 3:
            this.setMilliseconds(timeStep);
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
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getHours = function () {
    return (this.milliseconds / MILLIS.HOUR);
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
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getMinutes = function () {
    return (this.milliseconds / MILLIS.MINUTE);
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
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getSeconds = function () {
    return (this.milliseconds / MILLIS.SECOND);
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
    return this.milliseconds
      - (this.getHours() * MILLIS.HOUR)
      - (this.getMinutes() * MILLIS.MINUTE)
      - (this.getSeconds() * MILLIS.SECOND);
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
   * @returns {String}
   */
  Kairos.Gnomon.prototype.getTimeExpression = function () {
    var expression = this.getHours() + ':';
    expression += this.getMinutes();
    if (this.getSeconds() > 0 || this.getMilliseconds() > 0) {
      expression += ':' + this.getSeconds();
    }
    if (this.getMilliseconds() > 0) {
      expression += ':' + this.getMilliseconds();
    }
    return expression;
  };

  /**
   *
   * @param {Kairos.Gnomon} addend
   */
  Kairos.Gnomon.prototype.plus = function (addend) {
    this.milliseconds += addend.getMilliseconds();
  };

  /**
   *
   * @param {Kairos.Gnomon} substrahend
   */
  Kairos.Gnomon.prototype.minus = function (substrahend) {
    this.milliseconds -= substrahend.getMilliseconds();
  };
}());
