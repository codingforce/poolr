var poolr = require('poolr.js'),
    should = require('should');

module.exports = {
    'version string' : function() {
        poolr.version.should.match(/^\d+\.\d+\.\d+$/);
    },
    'constructor' : function() {
        poolr.should.respondTo('createPool');
        var testPool = poolr.createPool(1);
        testPool.should.be.a('object');
    }
};
