var time = Kairos.plus('10:10', '05:20');
console.log(time); // 15:30

//time = Kairos.multiply('01:00', 20);
//console.log(time); // 20:00
//
//time = Kairos.toMinutes(time);
//console.log(time); // 72000
//
//time = Kairos.toSeconds('00:01');
//console.log(time); // 60
//
//time = Kairos.toMilliseconds('00:01');
//console.log(time); // 60000
//
//time = new Kairos.Gnomon('01:10:20');
//console.log(time.getMilliseconds()); // 4220000
//console.log(time.getSeconds()); // 4220
//console.log(time.getMinutes()); // 70,33333333333333
//console.log(time.getHours()); // 1,172222222222222
//
//time = time.plus(new Kairos.Gnomon('01:00'));
//console.log(time.getSeconds()); // 7820
//console.log(time.getMilliseconds()); // 7820000
