var should = require('should'),
    poolr = require('poolr.js'),
    delayPool = new poolr(2);


var sleep05 = function(callback) {
    setTimeout(function(){return callback(null)}, 500);
}

var throttled = 0;
var drained = 0;
var idled = 0;
var lasted = 0;

delayPool.on('throttle', function() {
    throttled ++;
}).on('drain', function() {
    drained ++;
}).on('last', function() {
    lasted ++;
}).on('idle', function() {
    idled++;
});

exports['emits throttle on limit'] = function(){
    delayPool.addTask(sleep05);
    throttled.should.eql(0);
    drained.should.eql(0);

    delayPool.addTask(sleep05);
    throttled.should.eql(0);
    drained.should.eql(0);

    delayPool.addTask(sleep05);
    throttled.should.eql(1);

    delayPool.addTask(sleep05);
    throttled.should.eql(1);


    delayPool.addTask(
        clearTimeout, setTimeout(function () { throw 'Timeout';  }, 2800)
    );
}; 

setTimeout(function(){
    throttled.should.eql(1);
    drained.should.eql(1);
    lasted.should.be.above(0);
    idled.should.be.above(0);
}, 2500);


