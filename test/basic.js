var poolr = require('../poolr.js');

var randomPool = new poolr(5);


var randomSleep = function(callback) {
    var delay = Math.ceil(Math.random() * 5000);
    console.log('Sleeping ' + delay/1000 + ' seconds')
    setTimeout(function(){ callback(null, 'some result'); }, delay);
}

for (var i=0; i<10; i++) {
    (function(i){
        randomPool.addTask(randomSleep, function(err, res) {
            console.log('Task ' + i + 'A returned:' + res);
        });
    })(i);
}
console.log('Next Round');
for (var i=0; i<10; i++) {
    (function(i){
        randomPool.addTask(randomSleep, function(err, res) {
            console.log('Task ' + i + 'B returned:' + res);
        });
    })(i);
}

