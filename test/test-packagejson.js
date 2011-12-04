var should = require('should'),
    poolr = require('../lib/poolr'),
    fs     = require('fs');

var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));

module.exports = {
    'version of module and package.json must match' : function() {
        poolr.version.should.eql(pkg.version);
    }
}
