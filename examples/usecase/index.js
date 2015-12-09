(function (window) {
    'use strict';
    
    var _tasks = [];
    
    var exports = {};
    
    var _taskNameInput,
        _taskStartBtn,
        _tasksTableBody,
        _totalTime;
    
    var _initSelectors = function () {
        _taskNameInput = document.querySelector('input#task-name');
        _taskStartBtn = document.querySelector('div#taks-start');
        _tasksTableBody = document.querySelector('table#tasks-table tbody');
        _totalTime = document.getElementById('total-time');
    };
    
    var _initEventHandlers = function () {
        _taskStartBtn.addEventListener('click', _addTask);
    };
    
    var _addTask = function () {
        var task = new Task(_taskNameInput.value);
        _tasks.push(task);
        
        var row = document.createElement('tr'),
            taskCol = document.createElement('td'),
            executedForCol = document.createElement('td'),
            actionCol = document.createElement('td'),
            taskContent = document.createTextNode(task.name),
            stopTaskBtn = document.createElement('button');
        
        taskCol.appendChild(taskContent);
        row.appendChild(taskCol);
        
        var updateInterval = setInterval(function () {
            executedForCol.innerHTML = task.getTimeElapsed().toExpression();
            _updateTotal();
        }, 1000);
        row.appendChild(executedForCol);
        
        stopTaskBtn.setAttribute('class', 'btn btn-danger');
        stopTaskBtn.innerHTML = 'Stop';
        stopTaskBtn.addEventListener('click', function () {
            task.finish();
            clearInterval(updateInterval);
        });
        actionCol.appendChild(stopTaskBtn);
        row.appendChild(actionCol);
        
        _tasksTableBody.appendChild(row);
        _taskNameInput.value = '';
    };
    
    var _updateTotal = function () {
        var g = new Kairos.Gnomon();
        for (var i = 0, len = _tasks.length; i < len; i++) {
            g.plus(_tasks[i].getTimeElapsed());
        }
        
        _totalTime.innerHTML = g.toExpression();
    };
    
    var _init = function () {
        _initSelectors();
        _initEventHandlers();
    };
    
    exports.init = _init;
    
    window.TaskManager = exports;
})(window);

TaskManager.init();