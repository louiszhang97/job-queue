var express = require('express')
var mongoose = require('mongoose')
var routes = require('./routes')
var app = express()

mongoose.connect('mongodb://localhost/JobQueueDB',
                  () => console.log('Mongoose server connected'))
var db = mongoose.connection

db.on('error', console.error.bind(console, 'Error connecting to Mongoose'))

app.set('port', process.env.PORT || 3000)
app.use(routes)

process.on('SIGINT', function () {
  console.log('\n=>Closing Server...')
  db.close(function () {
    console.log('=>Mongoose disconnected on app termination')
    process.exit(0)
  })
})

app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'))
})
