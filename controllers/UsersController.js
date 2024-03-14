import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import { hashPassword } from '../utils/helpers';
import redisClient from '../utils/redis';

const postNew = async (req, res) => {
  const { email, password } = req.body;
  let user = await dbClient.findUser({ email });

  if (!email) return res.status(400).json({ error: 'Missing email' });
  if (!password) return res.status(400).json({ error: 'Missing password' });
  if (user) return res.status(400).json({ error: 'Already exist' });

  user = await dbClient.addUser(email, hashPassword(password));
  return res.status(201).json({ id: user._id, email: user.email });
};

const getMe = async (req, res) => {
  try {
    const header = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${header}`);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const newObjId = new ObjectId(userId);
    const user = await dbClient.findUser({ _id: newObjId });

    return res.status(200).json({ id: userId, email: user.email });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { postNew, getMe };
