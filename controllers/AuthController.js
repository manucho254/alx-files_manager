import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { hashPassword } from '../utils/helpers';

const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;
  try {
    // verify auth credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    const hashedPass = hashPassword(password);
    const user = await dbClient.findUser({ email, password: hashedPass });
    const token = uuidv4();

    if (!user) {
       return res.status(401).json({ error: 'Unauthorized' });
    }
  
    await redisClient.set(`auth_${token}`, user._id.toString(), 86400);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const getDisconnect = async (req, res) => {
  const header = req.headers['x-token'];
  const userId = await redisClient.get(`auth_${header}`);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  await redisClient.del(`auth_${header}`);
  return res.status(204).send();
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
