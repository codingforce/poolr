/*global describe:true, it:true */
'use strict';
var should = require('should'),
    poolr = require('../lib/poolr.js');

describe('poolr with limit 5', function () {
    var delayPool = poolr.createPool(5),
        called = 0;



    it('should call all tasks', function (done) {
        var outstanding = 0, i,
            check = function (i) {
                delayPool._addTask(
                    function (callback) {
                        called ++;
                        var delay = Math.ceil(Math.random() * 200);
                        setTimeout(function () {
                            callback(
                                null,
                                'returning after ' + delay / 1000 + ' secs.'
                            );
                        }, delay);
                    },
                    function (err, res) {
                        if (--outstanding === 0) {
                            called.should.eql(10);
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


