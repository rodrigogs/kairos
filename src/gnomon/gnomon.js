/**
 * @requires Gnomon.js
 */
(function () {
  'use strict';

  var MAX_MINUTES = 59;
  var MAX_SECONDS = 59;
  var MAX_MILLISECONDS = 999;

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
      var timeStep = timeSteps.length[i];
      if (isNaN(timeStep)) {

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

      } else {
        return NaN;
      }
    }
  };

  /**
   * @type {Number}
   * @default 0
   * @protected
   */
  Kairos.Gnomon.prototype.hours = 0;

  /**
   * @type {Number}
   * @default 0
   * @protected
   */
  Kairos.Gnomon.prototype.minutes = 0;

  /**
   * @type {Number}
   * @default 0
   * @protected
   */
  Kairos.Gnomon.prototype.seconds = 0;

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
    this.hours = hours;
  };

  /**
   *
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getHours = function () {
    return this.hours;
  };

  /**
   *
   * @param {Number} minutes
   */
  Kairos.Gnomon.prototype.setMinutes = function (minutes) {
    this.minutes = minutes;
  };

  /**
   *
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getMinutes = function () {
    return this.minutes;
  };

  /**
   *
   * @param {Number} seconds
   */
  Kairos.Gnomon.prototype.setSeconds = function (seconds) {
    this.seconds = seconds;
  };

  /**
   *
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getSeconds = function () {
    return this.seconds;
  };

  /**
   *
   * @param {Number} milliseconds
   */
  Kairos.Gnomon.prototype.setMilliseconds = function (milliseconds) {
    this.milliseconds = milliseconds;
  };

  /**
   *
   * @returns {Number|*}
   */
  Kairos.Gnomon.prototype.getMilliseconds = function () {
    return this.milliseconds;
  };

  /**
   *
   * @param {Number} hours
   */
  Kairos.Gnomon.prototype.addHours = function (hours) {
    this.hours += hours;
  };

  /**
   *
   * @param {Number} minutes
   */
  Kairos.Gnomon.prototype.addMinutes = function (minutes) {
    if ((this.minutes + minutes) > MAX_MINUTES) {

    }
    this.minutes = minutes;
  };

  /**
   *
   * @param {Number} seconds
   */
  Kairos.Gnomon.prototype.addSeconds = function (seconds) {
    this.seconds = seconds;
  };

  /**
   *
   * @param {Number} milliseconds
   */
  Kairos.Gnomon.prototype.addMilliseconds = function (milliseconds) {
    this.milliseconds = milliseconds;
  };

  /**
   *
   * @param {Kairos.Gnomon} addend
   */
  Kairos.Gnomon.prototype.plus = function (addend) {
    this.addHours(addend.getHours());
    this.addMinutes(addend.getMilliseconds());
    this.addSeconds(addend.getSeconds());
    this.addMilliseconds(addend.getMilliseconds());
  };
}());
