import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    return (async () => {
      const { env } = process;
      const host = env.DB_HOST ? env.DB_HOST : 'localhost';
      const port = env.DB_PORT ? env.DB_PORT : '27017';
      const database = env.DB_DATABASE ? env.DB_DATABASE : 'files_manager';
      this.client = new MongoClient(`mongodb://${host}:${port}`);
      await this.client.connect();
      this.db = this.client.db(database);

      return this; // Return the newly-created instance
    })();
  }

  isAlive() {
    return this.client.isConnected();
  }

  __collection(name) {
    return this.db.collection(name);
  }

  async nbUsers() {
    const users = await this.__collection('users').find({}).toArray();

    return users.length;
  }

  async nbFiles() {
    const files = await this.__collection('files').find({}).toArray();

    return files.length;
  }
}

const dbClient = DBClient();

module.exports = dbClient;
