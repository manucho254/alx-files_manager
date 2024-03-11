import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.log(err);
    });
  }

  isAlive() {
    this.client.on('connect', () => true);
    return false;
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
    await this.client.set(key, value, { EX: duration });
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
