(function () {
  'use strict';

  /**
   * @param {String} name Task name
   * @constructor
   */
  var Task = function (name) {
      this.name = name;
      this.startedAt = new Date();
  };

  /**
   * @type {String}
   * @default ''
   * @protected
   */
  Task.prototype.name = '';

  /**
   * @type {Date}
   * @default new Date
   * @protected
   */
  Task.prototype.startedAt = null;

  /**
   * @type {Date}
   * @default null
   * @protected
   */
  Task.prototype.finishedAt = null;

  /**
   * 
   */
  Task.prototype.finish = function () {
      this.finishedAt = new Date();
  };

  /**
   * @returns {Kairos.Gnomon}
   */
  Task.prototype.getTimeElapsed = function () {
    var diff = ((this.finishedAt || new Date()).getTime() - this.startedAt.getTime());
    var engine = Kairos.new(diff);
    engine.removeMilliseconds(engine.getMilliseconds());
    return engine;
  };

  window.Task = Task;
}());