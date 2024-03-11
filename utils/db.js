import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    return (async () => {
      const { env } = process;
      const host = env.DB_HOST ? env.DB_HOST : 'localhost';
      const port = env.DB_PORT ? env.DB_PORT : '27017';
      const database = env.DB_DATABASE ? env.DB_DATABASE : 'files_manager';
      this.client = new MongoClient(`mongodb://${host}:${port}`);

      try { await this.client.connect(); } catch (err) { console.log(err); }
      this.db = this.client.db(database);

      return this; // Return the newly-created instance
    })();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = await this.db.collection('users').find({}).toArray();

    return users.length;
  }

  async nbFiles() {
    const files = await this.db.collection('files').find({}).toArray();

    return files.length;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
