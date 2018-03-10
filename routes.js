var express = require('express')
// var mongoose = require('mongoose')
var router = express.Router()

router.get('/', function (req, res) {
  res.send('Hello World!')
})

router.get('/jobs', function (req, res) {
  console.log('Get all jobs')
})

router.post('/jobs/:url', function (req, res) {
  console.log('Add new job')
})

router.get('/jobs/:id', function (req, res) {
  console.log('Find this job')
})

module.exports = router
