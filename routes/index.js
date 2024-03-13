import express from 'express';

const { getStatus, getStats } = require('../controllers/AppController');
const { postNew } = require('../controllers/UsersController');
const { getConnect, getDisconnect, getMe } = require('../controllers/AuthController');
const { postUpload, getShow, getIndex } = require('../controllers/FilesController');

const router = express.Router();

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);
router.post('/files', postUpload);
router.get('/files/:id', getShow);
router.get('files', getIndex);

module.exports = router;
