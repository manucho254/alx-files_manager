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
    const val = await this.client.get(key);
    return val;
  }

  async set(key, value, duration) {
    await this.client.set(key, value, { EX: duration });
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = RedisClient();

module.exports = redisClient;
