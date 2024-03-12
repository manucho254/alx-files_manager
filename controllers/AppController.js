import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getStatus = (req, res) => {
  const data = { redis: redisClient.isAlive(), db: dbClient.isAlive() };
  res.status(200).json(data);
};

const getStats = (req, res) => {
  const nbUsers = dbClient.nbUsers();
  const nbFiles = dbClient.nbFiles();

  res.status(200).json({ users: nbUsers, files: nbFiles });
};

module.exports = { getStatus, getStats };
