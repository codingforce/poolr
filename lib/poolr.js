var util = require('util'),
    events = require('events');

var poolr = module.exports = function (poolSize, context)  {
    events.EventEmitter.call(this);
    this.ctx = context;
    this.poolSize = poolSize || 1;
    this.queue = [];
    this.runningJobs = 0;
    this.throttled = false;
};

util.inherits(poolr, events.EventEmitter);

poolr.prototype._addTask = function (job, callback) {
    // job must be a function expecting a callback with two parameters.
    // callback is the callback to be used for that.
    this.queue.push({'job' : job, 'callback' : callback});
    return this.runNext();
};

poolr.prototype.addTask = function () {
    var args = Array.prototype.slice.call(arguments),
        func = args.shift(),
        originalCallback = (typeof(args[args.length-1]) === 'function') ?
            args.pop() : function() {};

    return this._addTask(
        function (callback) {
            args.push(callback);
            return func.apply(this.ctx, args);
        }.bind(this),
        originalCallback
    );
};

poolr.prototype.runNext = function () {
    if (this.queue.length === 0 ) {
        this.emit('last');
        return;
    }

    if (this.runningJobs >= this.poolSize) {
        // console.log('Resource pool full: ' + this.runningJobs);
        if (! this.throttled) {
            // only emit on first queued task:
            this.emit('throttle');
            this.throttled = true;
        }
        return false;
    }

    var job = this.queue.shift();
    this.runningJobs ++;
    if (this.throttled && this.runningJobs < this.poolSize) {
        // in case anybody is interested: we have free slots again..
        this.throttled = false;
        this.emit('drain');
    }
    job.job(function(err, res) {
        this.runningJobs --;
        process.nextTick(function(){this.runNext();}.bind(this));
        if (this.runningJobs < 1) {
            this.emit('idle');
        }
        return job.callback(err, res);
    }.bind(this));
    return true;
};


