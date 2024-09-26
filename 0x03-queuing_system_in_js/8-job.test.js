const { expect } = require('chai');
const kue = require('kue');
const queue = kue.createQueue();
const createPushNotificationsJobs = require('./8-jobs');

describe('createPushNotificationsJobs', () => {
  before(() => {
    queue.testMode.enter(); // Enter test mode
  });

  after(() => {
    queue.testMode.exit(); // Exit test mode
    queue.testMode.clear(); // Clear the queue
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw(Error, 'Jobs is not an array');
  });

  it('should create jobs in the queue', () => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Job 1 notification' },
      { phoneNumber: '0987654321', message: 'Job 2 notification' },
    ];

    createPushNotificationsJobs(jobs, queue);

    const jobIds = queue.testMode.jobs;

    expect(jobIds).to.have.lengthOf(2);
    expect(jobIds[0].data).to.deep.equal(jobs[0]);
    expect(jobIds[1].data).to.deep.equal(jobs[1]);
  });

  it('should log the correct messages for job statuses', (done) => {
    // Create a job with a listener to capture console logs
    const consoleLog = console.log;
    let logs = [];
    console.log = (message) => logs.push(message); // Capture console logs

    const jobs = [{ phoneNumber: '1234567890', message: 'Job notification' }];
    createPushNotificationsJobs(jobs, queue);

    setImmediate(() => {
      expect(logs).to.include.members([
        'Notification job created: 1',
        'Notification job 1 completed'
      ]);
      console.log = consoleLog;
      done();
    });
  });
});
