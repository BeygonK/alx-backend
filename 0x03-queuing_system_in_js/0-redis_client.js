import { createClient } from "redis";


// Create a Redis client
const client = createClient();

// on connect
client.on('connect', () => console.log('Redis client connected to the server'));

client.on('error', err => console.log('Redis client not connected to the server:', err));
