var express = require('express');
var router = express.Router();

function findJob(jobs, job_name, job_schedule, callback) {
  callback(
    jobs.filter(function(job) {
      var sameName = ( job.name === job_name );
      var sameSchedule = ( job.job.cronTime.source === job_schedule );
      return sameName && sameSchedule;
    })[0] // we should only have one job left
  );
}

function toggleJob(job) {
  if(job.job.running) {
    job.job.stop();
  } else {
    job.job.start();
  }
}

// PUT job - currently used to toggle it's running state.
router.put('/', function(req, res, next) {
  var jobs = req.jobs;
  var job_name = req.body.job_name;
  var job_schedule = req.body.job_schedule;

  findJob(jobs, job_name, job_schedule, function(job) {
    toggleJob(job);
    res.send(job.running);
  });
});

module.exports = router;
