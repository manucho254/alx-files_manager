import { uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import { hashPassword } from '../utils/helpers';
import redisClient from '../utils/redis';

const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader.indexOf('Basic ') === -1) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // verify auth credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');
  const user = await dbClient.findUser({ email });

  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = uuidv4();
  await redisClient.set(`auth_${token}`, user._id, 86400);
  return res.status(200).json({ token });
};

const getDisconnect = async (req, res) => {
  const header = req.headers['x-token'];

  await redisClient.del(`auth_${header}`);
  res.status(204).json();
};

const getMe = async (req, res) => {
  const header = req.headers['x-token'];
  const userId = await redisClient.get(`auth_${header}`);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const newObjId = new ObjectId(userId);
  const user = await dbClient.findUser({ _id: newObjId });

  return res.status(201).json({ id: userId, email: user.email });
};

module.exports = { getConnect, getDisconnect, getMe };
