var Queue = require('bull')
var Job = require('../models/job')
var https = require('https')
var jobQueue = new Queue('job queue')
jobQueue.empty()

exports.createJob = function (jobUrl) {
  return Job.create({url: jobUrl, status: 'Waiting'})
}
exports.addJobToQueue = function (job) {
  jobQueue.add({url: job.url, jobID: job.id}).then(function (jobEntry) {
    console.log('Job ' + job.id + ' with URL: ' + job.url + ' added to queue')
  }, function (err) {
    console.log('ERROR: Cannot add job to queue: ' + err)
  })
}
exports.findJob = function (jobID) {
  console.log('Searching for job with ID: ' + jobID)
  return Job.findById(jobID, function (err, job) {
    if (err) {
      console.log('ERROR: Cannot find Job ' + jobID)
    }
  })
}

jobQueue.process(function (job, done) {
  var url = job.data.url
  var jobID = job.data.jobID
  console.log('Processing Job: ' + jobID)
  Job.findById(jobID, function (err, job) {
    if (err) {
      console.log('ERROR: Cannot find Job ' + jobID)
    } else {
      job.status = 'Processing'
      job.save()
      var req = https.get(url, (res) => {
        let body = ''
        res.on('data', (data) => { body += data })
        res.on('end', () => {
          job.response = body
          job.status = 'Completed'
          job.save()
          console.log(body)
          console.log('Done processing Job: ' + jobID)
          done()
        })
      })
    }
  })
})
