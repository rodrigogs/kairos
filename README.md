# Kairos

[![Build Status](https://travis-ci.org/rodrigogs/kairos.svg?branch=master)](https://travis-ci.org/rodrigogs/kairos)
[![Code Climate](https://codeclimate.com/github/rodrigogs/kairos/badges/gpa.svg)](https://codeclimate.com/github/rodrigogs/kairos)
[![Test Coverage](https://codeclimate.com/github/rodrigogs/kairos/badges/coverage.svg)](https://codeclimate.com/github/rodrigogs/kairos/coverage)
[![devDependency Status](https://david-dm.org/rodrigogs/kairos/dev-status.svg)](https://david-dm.org/rodrigogs/kairos#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/kairos.svg)](https://www.npmjs.com/package/kairos)
[![npm version](https://badge.fury.io/js/kairos.svg)](https://badge.fury.io/js/kairos)

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

time = Kairos.multiply('01:00', 20);
console.log(time); // 20:00

time = Kairos.toMinutes(time);
console.log(time); // 72000

time = Kairos.toSeconds('00:01');
console.log(time); // 60

time = Kairos.toMilliseconds('00:01');
console.log(time); // 60000

time = new Kairos.Gnomon('01:10:20');
console.log(time.getMilliseconds()); // 0
console.log(time.getSeconds()); // 20
console.log(time.getMinutes()); // 10
console.log(time.getHours()); // 1

time = time.plus(new Kairos.Gnomon('01:00'));
console.log(time.getHours()); // 2
```

Ans so on...

**Help and ideas are FREAKING welcome. Feel free to open issues, fork and contribute! ;)**
