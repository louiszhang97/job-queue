var Queue = require('bull')
var Job = require('../models/job')
var jobQueue = new Queue('job queue')
