var should = require('should'),
    delayPool = require('../lib/poolr.js').createPool(2);


var sleep05 = function(callback) {
    setTimeout(function(){return callback(null)}, 500);
}

exports['addTask return false on limit'] = function(){
    delayPool.addTask(sleep05).should.be.ok;
    delayPool.addTask(sleep05).should.be.ok;
    delayPool.addTask(sleep05).should.not.be.ok;

    delayPool.addTask(
        clearTimeout, setTimeout(function () { throw 'Timeout';  }, 2000)
    );
}; 

