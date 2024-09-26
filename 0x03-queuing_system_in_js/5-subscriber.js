import { createClient } from "redis";

const  client = createClient();

client.on('connect', () => console.log('Redis client connected to the server'));
client.on('error', (err) => console.log('Redis client not connected to the server:', err));

// subscribe to the channel
client.subscribe('holberton school channel');

// listen to the messages received
client.on('message', (channel, message) => {
  console.log(`Received message: ${message}`);

  if (message === 'KILL_SERVER') {
    client.unsubscribe(channel);
    client.quit();
    console.log('Unsubscribed and quitting')
}
});

