import kue from "kue";
const queue = kue.createQueue();

// Function to create push notifications jobs
export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through the jobs array and create jobs in the queue
  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (err) {
          console.error('Failed to create job:', err);
        } else {
          console.log(`Notification job created: ${job.id}`);
        }
      });

    // Log job completion
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    // Log job failure
    job.on('failed', (errorMessage) => {
      console.log(`Notification job ${job.id} failed: ${errorMessage}`);
    });

    // Log job progress
    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}
