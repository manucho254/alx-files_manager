import dbClient from '../utils/db';
import { hashPassword } from '../utils/helpers';

const postNew = async (req, res) => {
  const { email, password } = req.body;
  let user = await dbClient.findUser(email);

  if (!email) return res.status(400).json({ error: 'Missing email' });
  if (!password) return res.status(400).json({ error: 'Missing password' });
  if (user) return res.status(400).json({ error: 'Already exist' });

  user = await dbClient.addUser(email, hashPassword(password));
  res.status(200).json({ id: user._id, email: user.email });
};

module.exports = { postNew };
