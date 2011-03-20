var should = require('should'),
    delayPool = require('poolr.js').createPool(2),
    called = 0,
    running = 0;


var randomSleep = function(payload, callback) {
    called ++;
    running ++;
    running.should.be.below(3);
    // console.log('Called with arg: ' + payload);
    var args = Array.prototype.slice.call(arguments);

    var delay = Math.ceil(Math.random() * 1000);
    // console.log(payload + ' (Sleeping ' + delay/1000 + ' seconds)')
    setTimeout(function(){ running--; return callback(null, payload); }, delay);
}

exports['test limit is kept'] = function(){

    var timeout = setTimeout(function () { throw 'Timeout';  }, 11000);

    for (var i=0; i<10; i++) {
        (function(i){
            running.should.be.below(3);
            return delayPool.addTask(randomSleep, i, function(err, res) {
                running.should.be.below(3);
                // console.log('Result from ' + i + ' : ' + res);
            });
        })(i);
    }

    delayPool._addTask(function(cb){return cb(null);},function(dummy) {
        called.should.eql(10);
        clearTimeout(timeout);
    });
}

