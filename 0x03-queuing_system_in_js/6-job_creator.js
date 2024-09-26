import { createQueue } from "kue";

// create job object
const jobs = createQueue();

// define object
const jobData = {
    phoneNumber: '0703707551',
    message: 'Hello there',
}

// define queue
const job = jobs.create('push_notification_code', jobData).save(
    (err) => {
        if (!err) {
            console.log(`Notification job created: ${job.id}`);
        }
    }
);

// Job completion and failure events
job.on('complete', () => {
    console.log('Notification job completed');
  }).on('failed', (err) => {
    console.log('Notification job failed');
  });
