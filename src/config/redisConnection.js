const Redis = require('ioredis');

function connectToRedis() {
  // Redis connection options
  const redisOptions = {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: 0,
  };

  // Create a new Redis client with options
  const redis = new Redis(redisOptions);

  // Connect to Redis
  redis.on('connect', () => {
    console.log('Connected to Redis');
  });

  // Ping Redis server
  redis.ping((err, result) => {
    if (err) {
      console.error('Error pinging Redis:', err);
    } else {
      console.log('Redis ping result:', result);
    }
  });

  return redis;
}


module.exports = connectToRedis;