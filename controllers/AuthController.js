import { uuid } from 'uuidv4';
import dbClient from '../utils/db';
import { hashPassword } from '../utils/helpers';
import redisClient from '../utils/redis';

const getConnect = async (req, res) => {
  const authHeader = req.headers.Authorization;

  if (!authHeader || authHeader.indexOf('Basic ') === -1) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // verify auth credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');
  const user = await dbClient.findUser(email);

  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = uuid();
  await redisClient.set(`auth_${token}`, user.id, 86400);
  return res.status(200).json({ token });
};

const getDisconnect = async (req, res) => {
  const header = req.headers['X-Token'];

  await redisClient.del(`auth_${header}`);
  res.status(204).json({});
};

const getMe = (req, res) => {
  const header = req.headers['X-Token'];
  const user = redisClient.get(`auth_${header}`);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  return res.status(201).json({ id: user._id, email: user.email });
};

module.exports = { getConnect, getDisconnect, getMe };
