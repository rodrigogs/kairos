/**
 * @module Kairos.Lexicon
 */
;(function () {

  'use strict';

  /**
   * @type {{HOURS: string, MINUTES: string, SECONDS: string, MILLISECONDS: string}}
   */
  var TOKENS = {
    SIGN: '#', HOURS: 'h', MINUTES: 'm',
    SECONDS: 's', MILLISECONDS: 'S'
  };

  Kairos.Lexicon = {};

  /**
   * Gets a regex from a pattern.
   * 
   * @param {String} [Kairos pattern] pattern Pattern to convert
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
   * @param {String} expression Time expression to be validated
   * @param {String} [Kairos pattern] pattern Pattern to validate
   * @example Kairos.Lexicon.validate('10:00:00.000', 'hh:mm:ss.fff');
   * @returns {Boolean} True if expression is valid, false if expression is invalid
   */
  Kairos.Lexicon.validate = function (expression, pattern) {
    return Kairos.Lexicon.getValidator(pattern).test(expression);
  };

  /**
   * Parses given time expression to a Kairos.Engine instance.
   * 
   * @param {String} expression Time expression to be parsed
   * @param {String} [Kairos pattern] pattern Pattern to parse
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
   * @param {Kairos.Engine} instance The instance to format
   * @param {String} [Kairos pattern] pattern Pattern to format
   * @example Kairos.Lexicon.format(Kairos.new('10:30'), 'mm:hh');
   * @returns {String} Formated time expression
   */
  Kairos.Lexicon.format = function (instance, pattern) {
    if (!pattern) {
      pattern = Kairos._pattern;
    }

    var sign = instance.milliseconds >= 0,
        hours = String(instance.getHours()),
        minutes = String(instance.getMinutes()),
        seconds = String(instance.getSeconds()),
        milliseconds = String(instance.getMilliseconds());

    var result = '';
    for (var i = pattern.length - 1; i >= 0; i--) {
      var cur = pattern[i];
      switch (cur) {
        case TOKENS.SIGN:
          result = (sign ? '+' : '-') + result;
          break;
        case TOKENS.HOURS:
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
          result = cur + result;
      }
    }

    return result;
  };
}());