var should = require('should'),
    poolr = require('../lib/poolr.js'),
    timeout = setTimeout(function () { throw 'Timeout';  }, 11000),
    delayPool = new poolr(5),
    called = 0,
    running = 0;


var randomSleep = function(payload, callback) {
    payload.should.eql(called++);
    running ++;

    var delay = Math.ceil(Math.random() * 1000);
    // console.log(payload + ' (Sleeping ' + delay/1000 + ' seconds)')
    setTimeout(function(){ running--; return callback(null, payload); }, delay);
}

exports['argument is dispatched'] = function(){
    for (var i=0; i<10; i++) {
        (function(i){
            delayPool._addTask(
                function(callback) { return randomSleep(i, callback); },
                function(err, res) {
                    res.should.eql(i);
                    // console.log('Task ' + i + ' returned: ' + res);
                }
            );
        })(i);
    }
    delayPool._addTask(function(cb){return cb(null);},function(dummy) {
        clearTimeout(timeout);
    });
};


