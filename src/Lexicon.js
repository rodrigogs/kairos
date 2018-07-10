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
