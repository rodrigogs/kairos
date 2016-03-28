var augend = document.getElementById('augend');
var addend = document.getElementById('addend');
var plusResult = document.getElementById('plusResult');

var minuend = document.getElementById('minuend');
var subtrahend = document.getElementById('subtrahend');
var minusResult = document.getElementById('minusResult');

var multiplier = document.getElementById('multiplier');
var multiplicand = document.getElementById('multiplicand');
var multiplyResult = document.getElementById('multiplyResult');

var dividend = document.getElementById('dividend');
var divisor = document.getElementById('divisor');
var divideResult = document.getElementById('divideResult');

Kairos.setPattern('hh:mm');

function plus() {
  plusResult.value = Kairos.plus(augend.value, addend.value);
}

function minus() {
  minusResult.value = Kairos.minus(minuend.value, subtrahend.value);
}

function multiply() {
  multiplyResult.value = Kairos.multiply(multiplier.value, multiplicand.value);
}

function divide() {
  divideResult.value = Kairos.divide(dividend.value, divisor.value);
}

augend.addEventListener('change', plus);
addend.addEventListener('change', plus);

minuend.addEventListener('change', minus);
subtrahend.addEventListener('change', minus);

multiplier.addEventListener('change', multiply);
multiplicand.addEventListener('change', multiply);

dividend.addEventListener('change', divide);
divisor.addEventListener('change', divide);
