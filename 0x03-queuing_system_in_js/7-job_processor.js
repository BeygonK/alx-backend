import kue from "kue";
const queue = kue.createQueue({
  concurrency: 2, // Process two jobs at a time
});

// Array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);
  console.log(`Notification job ${job.id} 0% complete`);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
    console.log(`Notification job ${job.id} failed: ${errorMessage}`);
    return done(new Error(errorMessage));
  }

  // If not blacklisted, proceed with the notification
  job.progress(50, 100);
  console.log(`Notification job ${job.id} 50% complete`);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate the notification
  setTimeout(() => {
    job.progress(100);
    console.log(`Notification job ${job.id} completed`);
    done();
  }, 2000);
}

// Process jobs in the push_notification_code_2 queue
queue.process('push_notification_code_2', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Log job completion and failure
queue.on('job complete', (id) => {
  console.log(`Notification job ${id} completed`);
}).on('job failed', (id, err) => {
  console.log(`Notification job ${id} failed: ${err.message}`);
});
