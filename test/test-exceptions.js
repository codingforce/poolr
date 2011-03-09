var assert = require('assert'),
    poolr = require('poolr.js'),
    pool = new poolr(2);


exports['runNext on empty queue throws'] = function(){
    assert.throws(function(){pool.runNext()}, /empty queue/);
}


