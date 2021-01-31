const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000, //If we lose the connection with redis, we will try to re-connect every 1000miliseconds = 1 second
});
const sub = redisClient.duplicate(); //We duplicate the redisClient

//We wrote the fibonacci function.
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  // We are hashing the index with its value.
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert'); //We subscribed to the 'insert' event.
