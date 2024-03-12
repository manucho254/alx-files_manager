import { MongoClient } from 'mongodb';

const { env } = process;

class DBClient {
  constructor() {
    const host = env.DB_HOST ? env.DB_HOST : 'localhost';
    const port = env.DB_PORT ? env.DB_PORT : '27017';
    this.client = new MongoClient(`mongodb://${host}:${port}`, { useUnifiedTopology: true });
    this.db = undefined;
    this.isConnected = false;
    this.connection();
  }

  async connection() {
    const database = env.DB_DATABASE ? env.DB_DATABASE : 'files_manager';
    this.client.connect().then(() => {
      this.db = this.client.db(database);
      this.isConnected = true;
    }).catch((err) => console.log(err));
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    if (!this.db) return 0;
    const users = await this.db.collection('users').find({}).toArray();

    return users.length;
  }

  async nbFiles() {
    if (!this.db) return 0;
    const files = await this.db.collection('files').find({}).toArray();

    return files.length;
  }

  async findUser(query) {
    const user = await this.db.collection('users').findOne(query);

    return user;
  }

  async addUser(userEmail, userPassword) {
    const query = { email: userEmail, password: userPassword };
    await this.db.collection('users').insertOne(query);
    const user = await this.findUser({ email: userEmail });

    return user;
  }

  async findFile(query) {
    const file = await this.db.collection('files').findOne(query);

    return file;
  }

  async insertFile(query) {
    await this.db.collection('files').insertOne(query);
    const file = await this.findUser({ userId: query.userId });

    return file;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
