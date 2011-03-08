var poolr = require('../poolr.js');

var randomPool = new poolr(5);


var randomSleep = function(payload, callback) {
    var delay = Math.ceil(Math.random() * 1000);
    // console.log(payload + ' (Sleeping ' + delay/1000 + ' seconds)')
    setTimeout(function(){ callback(null, payload); }, delay);
}

for (var i=0; i<10; i++) {
    (function(i){
        randomPool.addTask(
            function(callback) { return randomSleep(i, callback); },
            function(err, res) {
                console.log('Task ' + i + ' returned: ' + res);
            }
        );
    })(i);
}

