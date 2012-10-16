/*global describe:true, it:true */
'use strict';

var should = require('should'),
    poolr = require('../lib/poolr.js').createPool,
    SomeClass;


SomeClass = function (someval) {
    this.state = someval;
};
SomeClass.prototype.someFunc = function (someArg, callback) {
    return callback(this.state, someArg);
};

describe('poolr default object', function () {
    var obj = new SomeClass('foo'),
        myPool = poolr(1, obj);
    it('should preserve method context', function (done) {
        myPool.addTask(obj.someFunc, 'bar', function (err, res) {
            err.should.eql('foo');
            res.should.eql('bar');
            done();
        });
    });
});


