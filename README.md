# Kairos
*Kairós(καιρός) is a greek word that means "the right moment". Also, in the greek mithology Kairós is the son of the personification of time itself, Chronos.*

Now talking about the library, Kairos is being developed to be a non date-based time calculator. The aim is to use time expressions along with math expressions to have human time products, and also to have various representations of a time expression using the engine Gnomon(*references the first solar clock ever made*).

The work has just begun here, but the idea is the following:

```javascript
var time = Kairos.plus('10:10', '05:20');
console.log(time); // 15:30

time = Kairos.multiply('01:00', 20);
console.log(time); // 20:00

time = new Kairos.Gnomon('01:10:20');
console.log(time.getMilliseconds()); // 4220000
console.log(time.getSeconds()); // 4220
console.log(time.getMinutes()); // 70,33333333333333
console.log(time.getHours()); // 1,172222222222222

time = time.plus(new Kairos.Gnomon('01:00'));
console.log(time.getSeconds()); // 7820
console.log(time.getMilliseconds()); // 7820000
```

Ans so on...

**Help and ideas are FREAKING welcome. Feel free to open issues, fork and contribute! ;)**
