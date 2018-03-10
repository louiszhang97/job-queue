var mongoose = require('mongoose')

var JobSchema = mongoose.Schema({
  url: String,
  status: String,
  response: mongoose.Schema.Types.Mixed,
  createdAt: {type: Boolean, default: Date.now()}
})
var Job = mongoose.model('Job', JobSchema)

module.exports = Job
