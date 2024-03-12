import dbClient from '../utils/db';
import { hashPassword } from '../utils/helpers';

const postNew = (req, res) => {
  const { email, password } = req.body;
  let user = dbClient.findUser(email);

  if (!email) res.status(400).json({ error: 'Missing email' });
  if (!password) res.status(400).json({ error: 'Missing password' });
  if (user) res.status(400).json({ error: 'Already exist' });

  user = dbClient.addUser(email, hashPassword(password));
  res.status(200).json({ id: user._id, email: user.email });
};

module.exports = { postNew };
