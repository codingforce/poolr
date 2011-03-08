var poolr = require('../poolr.js');

var randomPool = new poolr(2);


var randomSleep = function(payload, callback) {
    console.log('Called with arg: ' + payload);
    var args = Array.prototype.slice.call(arguments);

    var delay = Math.ceil(Math.random() * 1000);
    // console.log(payload + ' (Sleeping ' + delay/1000 + ' seconds)')
    setTimeout(function(){ callback(null, payload); }, delay);
}





for (var i=0; i<10; i++) {
    (function(i){
        randomPool.addTask(randomSleep, i, function(err, res) {
            console.log('Result from ' + i + ' : ' + res);
        });
    })(i);
}



