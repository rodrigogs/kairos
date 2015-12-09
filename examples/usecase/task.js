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
    var gnomon = new Kairos.Gnomon(diff);
    gnomon.removeMilliseconds(gnomon.getMilliseconds());
    return gnomon;
  };
  
  window.Task = Task;
}());