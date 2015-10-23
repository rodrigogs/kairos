(function () {
    var _maxLen = 12,
        _val1 = '',
        _val2 = '',
        _operator,
        _doNotParse = false;
        
    var _sendNum = function () {
        var val = this.textContent;
        if (!_operator) {
            if (_val1.length >= _maxLen) {
                return;
            }
            _val1 += val;
        } else {
            if (_val2.length >= _maxLen) {
                return;
            }
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
        
        _refreshDisplay();
    };
    
    var _init = function () {
        var nums = document.getElementsByClassName('num');
        for (var num in nums) {
            num = nums[num];
            num.onclick = _sendNum;
        }
        
        document.getElementById('back').onclick = _back;
        
        document.getElementById('clearEntry').onclick = _clearEntry;
        
        document.getElementById('clear').onclick = _clear;
        
        document.getElementById('divide').onclick = _divide;
        
        document.getElementById('multiply').onclick = _multiply;
        
        document.getElementById('minus').onclick = _minus;
        
        document.getElementById('plus').onclick = _plus;
        
        document.getElementById('equals').onclick = _equals;
    };
    
    _init();
}());