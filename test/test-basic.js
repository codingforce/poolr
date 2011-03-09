var should = require('should'),
    poolr = require('../lib/poolr.js'),
    timeout = setTimeout(function () { throw 'Timeout';  }, 11000),
    delayPool = new poolr(5),
    called = 0;

var randomSleep = function(callback) {
    called ++;
    var delay = Math.ceil(Math.random() * 1000);
    setTimeout(function(){
        callback(null, 'returning after ' + delay/1000 + ' secs.');
    }, delay);
}

exports['all tasks are called'] = function(){
    for (var i=0; i<10; i++) {
        (function(i){
            // console.log('Launching task ' + i);
            delayPool._addTask(randomSleep, function(err, res) {
                // console.log('Task ' + i + ' returned: ' + res);
            });
        })(i);
    }

    delayPool._addTask(function(cb){return cb(null);},function(dummy) {
        called.should.eql(10);
        clearTimeout(timeout);
    });
}

