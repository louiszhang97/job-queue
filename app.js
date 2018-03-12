let express = require('express')
let mongoose = require('mongoose')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let routes = require('./routes')
let config = require('config')

let app = express()

mongoose.connect(config.DBHost, () => console.log('Mongoose server connected'))
let db = mongoose.connection

db.on('error', console.error.bind(console, 'Error connecting to Mongoose'))

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(routes)

if (config.util.getEnv('NODE_ENV') !== 'test') {
  // console.log = function () {} // disable logs for testing
  app.use(morgan('combined'))
}

process.on('SIGINT', function () {
  exit()
})

app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'))
})

function exit () {
  console.log('\n=>Closing Server...')
  db.close(function () {
    console.log('=>Mongoose disconnected on app termination')
    process.exit(0)
  })
}
module.exports = app
