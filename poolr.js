var poolr = module.exports = function (poolSize)  {
    this.poolSize = poolSize || 1;
    this.queue = [];
    this.runningJobs = 0;
};

poolr.prototype.addTask = function (job, callback) {
    // job must be a function expecting a callback with two parameters.
    // callback is the callback to be used for that.
    this.queue.push({'job' : job, 'callback' : callback});
    return this.runNext();
};

poolr.prototype.runNext = function () {
    var that = this;
    if (this.queue.length == 0 ) {
        // console.log('Queue emtpy');
        return;
    }

    if (this.runningJobs >= this.poolSize) {
        // console.log('Resource pool full: ' + this.runningJobs);
        return;
    }

    var job = this.queue.shift();
    this.runningJobs ++;
    job.job(function(err, res) {
        that.runningJobs --;
        // console.log('Job returned. ' + that.runningJobs + ' still running.');
        job.callback(err, res);
        if (that.queue.length) {
            process.nextTick(function(){that.runNext()});
        }
    });
};

