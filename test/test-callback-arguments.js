var should = require('should')
  , poolr = require('../lib/poolr.js')
  , testfunc = function(i,callback) {
        process.nextTick(function(){return callback(i,i+1,i+2)});
    }
  ;

describe('poolr', function() {
    var testPool = poolr.createPool(5);
    describe('callbacks', function() {
        it('should be called with correct arguments', function(done) {
            var outstanding = 0;

            for (var i=0; i<10; i++) {
                outstanding++;
                (function(i){
                    testPool.addTask(testfunc,i,function(a,b,c) {
                        a.should.eql(i);
                        b.should.eql(i+1);
                        c.should.eql(i+2);
                        if (--outstanding === 0) {
                           done();
                        }
                    });
                })(i);
            }
        });
    });
});


