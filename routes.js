var express = require('express')
var url = require('url')
var jobController = require('./controllers/jobController')
var validURL = require('valid-url')
// var mongoose = require('mongoose')
var router = express.Router()

router.post('/jobs', function (req, res) {
  let jobUrl = req.body.url
  if (jobUrl && validURL.isUri(jobUrl)) {
    var parsedUrl = url.parse(jobUrl)
    var formattedUrl = url.format(parsedUrl)
    formattedUrl = 'https://' + parsedUrl.host + parsedUrl.pathname // use HTTPS by default
    jobController.createJob(formattedUrl).then(function (job) {
      var jsonResponse = JSON.stringify({_id: job.id, url: job.url})

      res.status(200).type('json').send(jsonResponse + '\n')
      jobController.addJobToQueue(job)
    })
  } else {
    res.status(400).send('ERROR: Please enter a valid https URL\n')
  }
})

router.get('/jobs/:id', function (req, res) {
  jobController.findJob(req.params.id).then(function (job) {
    console.log('Found Job: ' + job.id)
    var jsonResponse = JSON.stringify(job)
    res.status(200).type('json').send(jsonResponse + '\n')
  }).catch((error) => {
    res.status(404).send('ERROR: Cannot find Job: ' + req.params.id + '\n')
  })
})

module.exports = router
