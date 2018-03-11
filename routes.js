var express = require('express')
var url = require('url')
var jobController = require('./controllers/jobController')
var validURL = require('valid-url')
// var mongoose = require('mongoose')
var router = express.Router()

router.get('/', function (req, res) {
  res.send('Hello World!')
})

router.post('/jobs', function (req, res) {
  var jobUrl = req.query.url
  if (validURL.isUri(jobUrl)) {
    var parsedUrl = url.parse(jobUrl)
    var formattedUrl = url.format(parsedUrl)
    formattedUrl = 'https://' + parsedUrl.host + parsedUrl.pathname // use HTTPS by default
    console.log('Adding job url to queue: ' + formattedUrl)
    jobController.createJob(formattedUrl).then(function (job) {
      var jsonResponse = JSON.stringify({jobID: job.id, jobUrl: job.url})

      res.status(200).type('json').send(jsonResponse + '\n')
      jobController.addJobToQueue(job)
    })
  } else {
    res.status(400).send('ERROR: Please enter a valid https URL\n')
  }
})

router.get('/jobs', function (req, res) {
  res.send('Get all jobs\n')
})

router.get('/jobs/:id', function (req, res) {
  jobController.findJob(req.params.id).then(function (job) {
    var jsonResponse = JSON.stringify(job)
    res.status(200).send(jsonResponse + '\n')
  }).catch((error) => {
    res.status(400).send('ERROR: Cannot find Job with ID ' + req.params.id + '\n')
    console.log(error)
  })
})

module.exports = router
