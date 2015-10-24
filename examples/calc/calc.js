(function () {
    var _val1 = '',
        _val2 = '',
        _operator,
        _doNotParse = false,
        _error;
        
    var _sendNum = function () {
        var val = this.textContent;
        if (!_operator) {
            _val1 += val;
        } else {
            _val2 += val;
        }
        _refreshDisplay();
    };
    
    var _refreshDisplay = function () {
        var val1 = document.getElementById('val1'),
            val2 = document.getElementById('val2'),
            operator = document.getElementById('operator');
        
        val1.innerHTML = '';
        val2.innerHTML = '';
        operator.innerHTML = '';
        
        if (_error) {
          val1.innerHTML = _error.message;
          return _error = null;
        }
        if (!_operator) {
            val1.innerHTML = _val1;
        } else {
            val1.innerHTML = _val1;
            operator.innerHTML = _operator;
            val2.innerHTML = _val2;
        }
    };
    
    var _back = function () {
        if (!_operator) {
            _val1 = _val1.slice(0, -1);
        } else {
            _val2 = _val2.slice(0, -1);
        }
        _refreshDisplay();
    };
    
    var _clearEntry = function () {
        if (!_operator) {
            _val1 = '';
        } else {
            if (_val2 === '') {
                _operator = null;
            } else {
                _val2 = '';
            }
        }
        _refreshDisplay();
    };
    
    var _clear = function () {
        _val1 = '';
        _val2 = '';
        _operator = null;
        _refreshDisplay();
    };
    
    var _divide = function () {
        _doNotParse = true;
        _operator = '/';
    };
    
    var _multiply = function () {
        _doNotParse = true;
        _operator = '*';
    };
    
    var _minus = function () {
        _doNotParse = false;
        _operator = '-';
    };
    
    var _plus = function () {
        _doNotParse = false;
        _operator = '+';
    };
    
    var _equals = function () {
      try {
        var val1 = new Kairos.Gnomon(String(_val1));
        var val2 = _doNotParse ? parseInt(_val2) : new Kairos.Gnomon(_val2);
        
        switch (_operator) {
            case '/':
                val1.divide(val2);
                break;
            case '*':
                val1.multiply(val2);
                break;
            case '-':
                val1.minus(val2);
                break;
            case '+':
                val1.plus(val2);
                break;
        }
        
        _val1 = val1.toExpression();
        _val2 = '';
        _operator = null;
      } catch (err) {
        _error = err;
      } finally {
        _refreshDisplay();
      }
    };

    var _addNumShortCut = function (num) {
        Mousetrap.bind(num.innerHTML, function () {
            num.click();
        });
    };

    var _init = function () {
        var nums = document.getElementsByClassName('num');
        for (var i = 0, len = nums.length; i < len; i++) {
            var num = nums[i];
            num.onclick = _sendNum;
            _addNumShortCut(num);
        }
        
        var back = document.getElementById('back');
        back.onclick = _back;
        Mousetrap.bind('backspace', _back);

        var clearEntry = document.getElementById('clearEntry');
        clearEntry.onclick = _clearEntry;
        Mousetrap.bind('tab', _clearEntry);
        
        var clear = document.getElementById('clear');
        clear.onclick = _clear;
        Mousetrap.bind('esc', _clear);

        var divide = document.getElementById('divide');
        divide.onclick = _divide;
        Mousetrap.bind('/', _divide);
        
        var multiply = document.getElementById('multiply');
        multiply.onclick = _multiply;
        Mousetrap.bind('*', _multiply);

        var minus = document.getElementById('minus');
        minus.onclick = _minus;
        Mousetrap.bind('-', _minus);
        
        var plus = document.getElementById('plus');
        plus.onclick = _plus;
        Mousetrap.bind('+', _plus);

        var equals = document.getElementById('equals');
        equals.onclick = _equals;
        Mousetrap.bind('=', _equals);
        Mousetrap.bind('enter', _equals);
    };
    
    _init();
}());
