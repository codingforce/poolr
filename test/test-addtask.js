/*global describe:true, it:true */
'use strict';
var should = require('should');

describe('poolr', function () {

    describe('with limit two', function () {
        var delayPool = require('../lib/poolr.js').createPool(2),
            called = 0,
            running = 0,

            randomSleep = function (payload, callback) {
                var args = Array.prototype.slice.call(arguments),
                    delay = Math.ceil(Math.random() * 500);
                called ++;
                running ++;
                running.should.be.below(3);
                setTimeout(function () {
                    running--;
                    return callback(null, payload);
                }, delay);
            };


        it('should not run more than two tasks', function (done) {
            var outstanding = 0, i,
                check1 = function (i) {
                    running.should.be.below(3);
                    return delayPool.addTask(randomSleep, i, check2);
                },
                check2 = function (err, res) {
                    running.should.be.below(3);
                    if (--outstanding === 0) {
                        done();
                    }
                };

            for (i = 0; i < 10; i++) {
                outstanding++;
                check1(i, check2);
            }
        });

        it('should have been called 10 times', function (done) {
            delayPool._addTask(
                function (cb) {
                    return cb(null);
                },
                function (dummy) {
                    called.should.eql(10);
                    done();
                }
            );
        });
    });
});

