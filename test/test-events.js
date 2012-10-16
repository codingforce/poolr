/*global describe:true, it:true */
'use strict';
var should = require('should');

describe('poolr', function () {
    describe('of two', function () {
        var delayPool = require('../lib/poolr.js').createPool(2),
            sleep05 = function (callback) {
                setTimeout(function () {
                    return callback(null);
                }, 250);
            },
            throttled = 0,
            drained = 0,
            idled = 0,
            lasted = 0;

        delayPool.on('throttle', function () {
            throttled ++;
        }).on('drain', function () {
            drained ++;
        }).on('last', function () {
            lasted ++;
        }).on('idle', function () {
            idled++;
        });

        it('should not emit throttle on first job', function () {
            delayPool.addTask(sleep05);
            throttled.should.eql(0);
        });
        it('should not emit drain after first job', function () {
            drained.should.eql(0);
        });
        it('should not emit throttle on second job', function () {
            delayPool.addTask(sleep05);
            throttled.should.eql(0);
        });
        it('should not emit drain after second job', function () {
            drained.should.eql(0);
        });
        it('should emit throttle on third job', function () {
            delayPool.addTask(sleep05);
            throttled.should.eql(1);
        });
        it('should have been throttled once on forth job', function () {
            delayPool.addTask(sleep05);
            throttled.should.eql(1);
        });

        it('should have emitted "idle" excactly once', function (done) {
            this.timeout(1100);
            setTimeout(function () {
                idled.should.eql(1);
                return done();
            }, 1000);
        });

        it('should have emitted "last" at least once', function (done) {
            this.timeout(1100);
            setTimeout(function () {
                lasted.should.be.above(0);
                return done();
            }, 1000);
        });

        // should be last:
        it('should have emitted "throttle" excactly once', function (done) {
            this.timeout(1100);
            setTimeout(function () {
                throttled.should.eql(1);
                done();
            }, 1000);
        });
        it('should have emitted "drain" excactly once', function (done) {
            this.timeout(1100);
            setTimeout(function () {
                drained.should.eql(1);
                return done();
            }, 1000);
        });

    });
});


