/*global describe:true, it:true */
'use strict';
var should = require('should'),
    poolr = require('../lib/poolr.js');

describe('poolr', function () {
    describe('taskArguments', function () {
        var testPool = poolr.createPool(5),
            called = 0,
            running = 0,

            checkArg = function (payload, callback) {
                payload.should.eql(called++);
                running ++;
                process.nextTick(function () {
                    return callback(null, payload);
                });
            };


        it('should be dispatched', function (done) {
            var outstanding = 0, i,
                check = function (i) {
                    testPool._addTask(
                        function (callback) {
                            return checkArg(i, callback);
                        },
                        function (err, res) {
                            res.should.eql(i);
                            if (--outstanding === 0) {
                                done();
                            }
                        }
                    );
                };

            for (i = 0; i < 10; i++) {
                outstanding++;
                check(i);
            }
        });
    });
});


