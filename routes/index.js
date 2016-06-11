var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var jobs = req.jobs;
  console.log(jobs[0].job); // for reference: what is available to display?
  res.render('index', { jobs: jobs });
});

module.exports = router;
