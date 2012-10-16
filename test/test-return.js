/*global describe:true, it:true */
'use strict';

var should = require('should'),
    poolr = require('../lib/poolr.js');


describe('poolr with limit two', function () {

    describe('addTask', function () {
        var delayPool = poolr.createPool(2),
            sleep05 = function (callback) {
                setTimeout(function () {
                    return callback(null);
                }, 500);
            };


        it('should return true on first invocation', function () {
            delayPool.addTask(sleep05).should.be.ok;
        });
        it('should return true on second invocation', function () {
            delayPool.addTask(sleep05).should.be.ok;
        });
        it('should return false on third invocation', function () {
            delayPool.addTask(sleep05).should.not.be.ok;
        });
    });
});


