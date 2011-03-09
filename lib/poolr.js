var poolr = module.exports = function (poolSize, context)  {
    this.ctx = context;
    this.poolSize = poolSize || 1;
    this.queue = [];
    this.runningJobs = 0;
};

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
}

poolr.prototype.runNext = function () {
    if (this.queue.length == 0 ) {
        throw 'runNext called on empty queue';
    }

    if (this.runningJobs >= this.poolSize) {
        // console.log('Resource pool full: ' + this.runningJobs);
        return;
    }

    var job = this.queue.shift();
    this.runningJobs ++;
    job.job(function(err, res) {
        this.runningJobs --;
        // console.log('Job returned. ' + this.runningJobs + ' still running.');
        if (this.queue.length) {
            // console.log('Queue length: ' + this.queue.length);
            process.nextTick(function(){this.runNext()}.bind(this));
        }
        return job.callback(err, res);
    }.bind(this));
};


