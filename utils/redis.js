import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.log(err);
    });
    this.client.connect();
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    await this.client.get(key, (err, data) => {
      if (err) {
        throw err;
      }
      return data;
    });
  }

  async set(key, value, duration) {
    await this.client.set(key, value);
    await this.client.expire(key, duration);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
