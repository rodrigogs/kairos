# Kairos

[![Build Status](https://travis-ci.org/rodrigogs/kairos.svg?branch=master)](https://travis-ci.org/rodrigogs/kairos)
[![Code Climate](https://codeclimate.com/github/rodrigogs/kairos/badges/gpa.svg)](https://codeclimate.com/github/rodrigogs/kairos)
[![Test Coverage](https://codeclimate.com/github/rodrigogs/kairos/badges/coverage.svg)](https://codeclimate.com/github/rodrigogs/kairos/coverage)
[![devDependency Status](https://david-dm.org/rodrigogs/kairos/dev-status.svg)](https://david-dm.org/rodrigogs/kairos#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/kairos.svg)](https://www.npmjs.com/package/kairos)
[![npm version](https://badge.fury.io/js/kairos.svg)](https://badge.fury.io/js/kairos)
[![Bower version](https://badge.fury.io/bo/kairos.svg)](https://badge.fury.io/bo/kairos)

*Kairós(καιρός) is a greek word that means "the right moment". Also, in the greek mithology Kairós is the son of the personification of time itself, Chronos.*

Now talking about the library, Kairos is being developed to be a non date-based time calculator. The aim is to use time expressions along with math expressions to have human time products, and also to have various representations of a time expression using the engine Gnomon(*references the first solar clock ever made*).

## Install

#### Node.js
> npm install kairos

#### Bower
> bower install kairos

The work has just begun here, but the idea is the following:

```javascript
var time = Kairos.plus('10:10', '05:20');
console.log(time); // 15:30

time = Kairos.minus('10:00', '05:00');
console.log(time); // 05:00

time = Kairos.multiply('01:00', 20);
console.log(time); // 20:00

time = Kairos.divide('03:00', 2);
console.log(time); // 01:30

var milliseconds = Kairos.toMilliseconds('00:01');
console.log(milliseconds); // 60000

var seconds = Kairos.toSeconds('00:01');
console.log(seconds); // 60

var minutes = Kairos.toMinutes(time);
console.log(minutes); // 90

var hours = Kairos.toHours('10:30');
console.log(hours); // 10.5

var fraction = Kairos.getFraction('01:00', 2, 3);
console.log(fraction); // 40

time = new Kairos.Gnomon('01:10:20');
console.log(time.getMilliseconds()); // 0
console.log(time.getSeconds()); // 20
console.log(time.getMinutes()); // 10
console.log(time.getHours()); // 1
console.log(time.toMilliseconds()); // 4220000
console.log(time.toSeconds()); // 4220
console.log(time.toMinutes()); // 70.333333333333
console.log(time.toHours()); // 1.172222222222

time = time.plus(new Kairos.Gnomon('01:00'));
console.log(time.getHours()); // 2
```

Ans so on...

**Help and ideas are FREAKING welcome. Feel free to open issues, fork and contribute! ;)**
