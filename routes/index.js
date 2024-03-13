import express from 'express';

const { getStatus, getStats } = require('../controllers/AppController');
const { postNew, getMe } = require('../controllers/UsersController');
const { getConnect, getDisconnect } = require('../controllers/AuthController');
const {
  getShow, getIndex, postUpload, putPublish, putUnpublish, getFile,
} = require('../controllers/FilesController');

const router = express.Router();

router.route('/status').get(getStatus);
router.route('/stats').get(getStats);
router.route('/connect').get(getConnect);
router.route('/disconnect').get(getDisconnect);
router.route('/users/me').get(getMe);
router.route('/files').get(getIndex).post(postUpload);
router.route('/files/:id').get(getShow);
router.route('/users').post(postNew);
router.put('/files/:id/publish', putPublish);
router.put('/files/:id/unpublish', putUnpublish);
router.get('/files/:id/data', getFile);

module.exports = router;
