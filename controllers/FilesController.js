import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { checkPath } from '../utils/helpers';

const path = require('path');
const fs = require('fs');

const postUpload = async (req, res) => {
  const header = req.headers['x-token'];
  const userId = await redisClient.get(`auth_${header}`);
  const validTypes = ['folder', 'file', 'image'];
  const {
    name, type, parentId = '0', isPublic = false, data,
  } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!type || !validTypes.includes(type)) return res.status(400);
  if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });

  if (parentId !== '0') {
    const file = dbClient.findFile({ parentId });
    if (!file) return res.status(400).json({ error: 'Parent not found' });
    if (file.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
  }

  const newParentId = new ObjectId(userId);
  const newUserId = new ObjectId(parentId);
  const document = {
    newUserId,
    name,
    type,
    newParentId,
    isPublic,
  };
  if (type === 'folder') {
    const fData = await dbClient.insertFile(document);
    return res.status(200).json(fData);
  }

  const rootPath = process.env.FOLDER_PATH || '/tmp/files_manager';
  await checkPath(rootPath);
  const fullPath = path.join(rootPath, uuidv4());
  const fileContent = Buffer.from(data, 'base64');
  fs.writeFileSync(fullPath, fileContent);

  document.localPath = fullPath;
  const fData = await dbClient.insertFile(document);

  return res.status(200).json(fData);
};

module.exports = { postUpload };