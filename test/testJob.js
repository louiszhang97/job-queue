process.env.NODE_ENV = 'test'
process.env.NODE_NO_WARNINGS = 1

let mongoose = require('mongoose')
let Job = require('../models/job')

let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app')
let should = chai.should()


console.log('NODE ENV' + process.env.NODE_ENV)
chai.use(chaiHttp)

describe('Jobs', () => { // ensures that test DB is empty
  beforeEach((done) => {
    Job.remove({}, (err) => {
      console.log(err)
      done()
    })
  })
  describe('/POST job', ()  => {
    it('It should not POST a Job without a URL field', (done) => {
      let notUrl = {notUrl: "https://www.google.com"}
      chai.request(app)
          .post('/jobs')
          .send(notUrl)
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
    })
    it('It should not POST a Job without a valid HTTPS url', (done) => {
      let url = {url: "www.google.com"}
      chai.request(app)
          .post('/jobs')
          .send(url)
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
    })
    it('It should POST a Job with a valid HTTPS url', (done) => {
      let url = {url: "https://en.wikipedia.org/wiki/Massdrop"}
      chai.request(app)
          .post('/jobs')
          .send(url)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.have.property('_id')
            res.body.should.have.property('url')
            done()
          })
    })
  })

  describe('/GET job', () => {
    it('It should not GET a Job that doesn\'t exist', (done) => {
      chai.request(app)
          .get('/jobs/1234')
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
    })
    it('It should GET a Job that has been put', (done) => {
      let url = {url: "https://en.wikipedia.org/wiki/Massdrop"}
      chai.request(app)
          .post('/jobs')
          .send(url)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.have.property('_id')
            res.body.should.have.property('url')
            chai.request(app)
                .get('/jobs/' + res.body._id)
                .end((err, res) => {
                  res.should.have.status(200)
                  res.body.should.have.property('_id')
                  res.body.should.have.property('url')
                  res.body.should.have.property('status')
                  res.body.should.have.property('createdAt')
                  done()
                })
          })
    })
  })
})
