import redis  from "redis";
import { createClient } from "redis";
import { promisify } from "util";


// Create a Redis client
const client = createClient();

// on connect
client.on('connect', () => console.log('Redis client connected to the server'));

client.on('error', err => console.log('Redis client not connected to the server:', err));

// Function to  Set a key-value pair
function setNewSchool(key, value) {
    client.set(key, value, redis.print);
}

// Function to get the value of a key using async/await
const displaySchoolValue = async (schoolName) => {
    // Promisify the client.get method
    const getAsync = promisify(client.get).bind(client);
    
    try {
      const value = await getAsync(schoolName);  // Await the promise
      if (value) {
        console.log(`${value}`);
      } else {
        console.log(`No value found for ${schoolName}`);
      }
    } catch (err) {
      console.log(`Error retrieving value for ${schoolName}: ${err.message}`);
    }
  };

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');