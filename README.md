# Massdrop Job Queue

This is my Job Queue coding challenge for Massdrop!  The stack uses Node.js, Express, Mongoose (and MongoDB), as well as Mocha and Chai for testing/assertion.  

The directions are as follows:
Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

Example:
User submits www.google.com to your endpoint. The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result. The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com.

## Local Setup
To run the program locally, clone this repo into your local machine and follow these steps:
1. Ensure that you have Node.js (and npm) installed. You can do this on Mac with `brew install node`. This will install both Node.js and npm
2. Ensure that you have MongoDB installed. Directions can be found here: https://docs.mongodb.com/manual/installation/. Make sure you are able to run the command `mongod` without any errors.
3. Install all dependencies
```
npm install
```
4. In another terminal window or tab, run
```
mongod
```
5. Start the app with
```
npm start
```
6. The app will then run on http://localhost:3000 by default

## Usage
Using https://google.com as our URL,
### Adding a job the queue
cURL:
```bash
curl -d '{"url": "https://google.com"}' -H "Content-Type: application/json" -X POST http://localhost:3000/jobs

```
or HTTPie:
```bash
http POST http://localhost:3000/jobs url=https://google.com
```

The JSON response will look like this:
```bash
{"jobID":"5aa5deac7d546409544411f3","jobUrl":"https://google.com/"}
```
### Checking the status of a Job
Using the jobID from the response above: 5aa5deac7d546409544411f3

cURL:
```bash
curl -X GET http://localhost:3000/jobs/5aa5deac7d546409544411f3
```
or HTTPie:
```bash
http GET http://localhost:3000/jobs/5aa5deac7d546409544411f3
```
The JSON response will be of the format:
```bash
{"jobID": JOB_ID, "createdAt": DATE, "response": RESPONSE, "status": STATUS, "url": URL}
```
NOTE: A job that has not completed yet will not have the "response" field included

The following are the possible statuses of a Job:
1. Waiting  - Job is in queue
2. Processing - Job is being processed (API is fetching the url)
3. Completed - Job is completed
4. Completed with error - API attempted to fetch the URL, but there was an error (most likely from the URL not being a working one). The result is still stored in Job's response.


## Testing
I've provided tests in `test/testJob.js` using Mocha and Chai as my testing and assertion frameworks.  They can be run with
```bash
npm test
```
Feel free to add additional tests if you'd like! (:
