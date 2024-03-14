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
    if (!user) {
      return null;
    }
    return user;
  }

  async addUser(userEmail, userPassword) {
    const query = { email: userEmail, password: userPassword };
    await this.db.collection('users').insertOne(query);
    const user = await this.findUser({ email: userEmail });

    return user;
  }

  async findFile(query) {
    const obj = { ...query };

    if (obj._id) { obj._id = new ObjectId(query._id); }
    if (obj.userId) { obj.userId = new ObjectId(query.userId); }
    if (obj.parentId && obj.parentId !== '0') { obj.parentId = new ObjectId(query.parentId); }

    const file = await this.db.collection('files').findOne(obj);

    if (file) {
      return DBClient.cleanData(file);
    }
    return null;
  }

  async findFiles(query) {
    const skipCount = query.pageNumber >= 1 ? ((query.pageNumber - 1) * 20) : 0;
    let newParentId = query.parentId;

    // Define the aggregation pipeline
    const pipeline = [
      // Pagination: Skip and Limit
      { $skip: skipCount },
      { $limit: 20 },
      // Additional aggregation stages if needed
    ];

    if (query.parentId !== '0') {
      newParentId = new ObjectId(query.parentId);
      pipeline.push({ $match: { parentId: newParentId } });
    }

    const files = await this.db.collection('files').aggregate(pipeline).toArray();
    const data = [];

    files.forEach((file) => {
      data.push(DBClient.cleanData(file));
    });
    return data;
  }

  async insertFile(query) {
    const data = { ...query };
    if (query.parentId !== '0') {
      data.parentId = new ObjectId(query.parentId);
    }
    const newUserId = new ObjectId(data.userId);
    data.userId = newUserId;

    const result = await this.db.collection('files').insertOne(data);
    const file = await this.findFile({ userId: query.userId, _id: result.insertedId });

    return file;
  }

  async updateFile(query) {
    const data = { ...query };
    const filter = { userId: ObjectId(data.userId), _id: ObjectId(data._id) };
    delete data._id;
    delete data.userId;

    // Define the update operation
    const updateOperation = {
      $set: data, // Use $set to specify the fields to update
    };
    // Perform the update operation
    await this.db.collection('files').updateOne(filter, updateOperation);
    const file = await this.findFile({ userId: query.userId, _id: query._id });

    return file;
  }

  static cleanData(file) {
    const data = { };

    for (const [key, val] of Object.entries(file)) {
      if (key === '_id') {
        data.id = val;
      } else {
        data[key] = val === '0' ? Number(val) : val;
      }
    }

    return data;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
