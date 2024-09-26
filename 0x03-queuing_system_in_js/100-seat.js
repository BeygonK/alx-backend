const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const kue = require('kue');
const bodyParser = require('body-parser');

const app = express();
const PORT = 1245;

// Create a Redis client
const redisClient = redis.createClient();
const getAvailableSeatsAsync = promisify(redisClient.get).bind(redisClient);

// Initialize available seats
const INITIAL_SEATS = 50;
let reservationEnabled = true;

// Set initial available seats in Redis
redisClient.set('available_seats', INITIAL_SEATS);

// Create a Kue queue
const queue = kue.createQueue();

// Function to reserve seats
const reserveSeat = async (number) => {
    await redisClient.decrby('available_seats', number);
};

// Function to get current available seats
const getCurrentAvailableSeats = async () => {
    const seats = await getAvailableSeatsAsync('available_seats');
    return parseInt(seats, 10);
};

// Start the Express server
app.use(bodyParser.json());

app.get('/available_seats', async (req, res) => {
    const availableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: "Reservation are blocked" });
    }

    const job = queue.create('reserve_seat', { seats: 1 }).save((err) => {
        if (err) {
            return res.json({ status: "Reservation failed" });
        }
        return res.json({ status: "Reservation in process" });
    });
});

app.get('/process', async (req, res) => {
    res.json({ status: "Queue processing" });

    queue.process('reserve_seat', async (job, done) => {
        const availableSeats = await getCurrentAvailableSeats();
        const newAvailableSeats = availableSeats - job.data.seats;

        if (newAvailableSeats < 0) {
            return done(new Error('Not enough seats available'));
        }

        await reserveSeat(job.data.seats);

        if (newAvailableSeats === 0) {
            reservationEnabled = false;
        }

        console.log(`Seat reservation job ${job.id} completed`);
        done();
    });

    queue.on('failed', (job, err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
