import redis  from "redis";
import { createClient } from "redis";


// Create a Redis client
const client = createClient();

// on connect
client.on('connect', () => console.log('Redis client connected to the server'));

client.on('error', err => console.log('Redis client not connected to the server:', err));

// Function to  Set a key-value pair
function setNewSchool(key, value) {
    client.set(key, value, redis.print);
}

// Function to get the value of a key
function displaySchoolValue(key) {
    client.get(key, (err, reply) => {
        if (err) throw err;
        console.log(`${reply}`);
    });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');