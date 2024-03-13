import { MongoClient, ObjectId } from 'mongodb';

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
    const data = {};

    if (file) {
      for (const [key, val] of Object.entries(file)) {
        if (key === '_id') {
          data.id = val;
        } else {
          data[key] = val;
        }
      }
      return data;
    }
    return null;
  }

  async findFiles(query) {
    const skipCount = query.pageNumber >= 1 ? ((query.pageNumber - 1) * 20) : 20;
    let newParentId = query.parentId;

    if (query.parentId !== '0') {
      newParentId = ObjectId(query.parentId);
    }
    // Define the aggregation pipeline
    const pipeline = [
      // Pagination: Skip and Limit
      { $match: { parentId: newParentId } },
      { $skip: skipCount },
      { $limit: 20 },
      // Additional aggregation stages if needed
    ];

    const files = await this.db.collection('files').aggregate(pipeline).toArray();
    const data = [];

    files.forEach((file) => {
      const obj = {};
      for (const [key, val] of Object.entries(file)) {
        if (key === '_id') {
          obj.id = val;
        } else {
          obj[key] = val;
        }
      }
      data.push(obj);
    });
    return data;
  }

  async insertFile(query) {
    const data = { ...query };
    if (query.parentId !== '0') {
      const newParentId = ObjectId(data.parentId);
      data.parentId = newParentId;
    }
    const newUserId = ObjectId(data.userId);
    data.userId = newUserId;

    await this.db.collection('files').insertOne(data);
    const file = await this.findFile({ userId: data.userId });

    return file;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
