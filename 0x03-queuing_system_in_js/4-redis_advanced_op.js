import { createClient } from "redis";
import redis from "redis";


// Create a Redis client
const client = createClient();

client.on('connect', () => console.log('Redis client connected to server'));

client.on('error', err => console.log('Redis client not connected to server:', err));

const hashKey = 'HolbertonSchools'
const schoolValues = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
}

// Set multiple key-value pairs in a hash
const setSchoolValues = (hashKey, schoolValues) => {
    // Loop through the fields object
    for (const [field, value] of Object.entries(schoolValues)) {
      client.hset(hashKey, field, value, (err, reply) => {
        if (err) {
            throw err;
        }
        else {
          redis.print(null, reply);
        }
      });
    }
};

const displayAllSchoolValues = (hashKey) => {
    client.hgetall(hashKey, (err, result) => {
      if (err) {
        console.log(`Error retrieving values for ${hashKey}: ${err.message}`);
      } else if (result) {
        console.log(`Values for ${hashKey}:`, result);
      } else {
        console.log(`No values found for ${hashKey}`);
      }
    });
  };

setSchoolValues(hashKey, schoolValues);
displayAllSchoolValues(hashKey);