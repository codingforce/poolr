var poolr = require('poolr.js'),
    should = require('should');

module.exports = {
    'version string' : function() {
        poolr.version.should.match(/^\d+\.\d+\.\d+$/);
    }
};
