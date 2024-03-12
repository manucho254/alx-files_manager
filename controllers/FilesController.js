// import redisClient from '../utils/redis';
const postUpload = async (req, res) => {
  //   const header = req.headers['x-token'];
  //   const userId = await redisClient.get(`auth_${header}`);
  //   const validTypes = ['folder', 'file', 'image'];
  //   const {
  //     name, type, parentId, isPublic, data,
  //   } = req.body;
  //   if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  //   if (!name) return res.status(400).json({ error: 'Missing name' });
  //   if (!type || !validTypes.includes(type)) return res.status(400)
  //   if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
  res.status(200).json();
};

module.exports = { postUpload };
