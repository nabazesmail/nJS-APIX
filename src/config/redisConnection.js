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

  // Flag to track whether the connection error has been logged
  let connectionErrorLogged = false;

  // Handle Redis connection error
  redis.on('error', (err) => {
    if (!connectionErrorLogged) {
      console.error('Redis client failed to connect:', err);
      connectionErrorLogged = true;
    }
  });

  return redis;
}

 function resetCache() {
  const redisClient = connectToRedis();

  try {
    // Clear all keys from database 0 (cache database)
     redisClient.flushdb();
    console.log('Cache reset successful');
  } catch (error) {
    console.error('Error resetting cache:', error);
  } finally {
    // Close the Redis connection after resetting the cache
    redisClient.quit();
  }
}


module.exports = {connectToRedis,resetCache};