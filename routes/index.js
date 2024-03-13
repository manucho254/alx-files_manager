import express from 'express';

const { getStatus, getStats } = require('../controllers/AppController');
const { postNew } = require('../controllers/UsersController');
const { getConnect, getDisconnect, getMe } = require('../controllers/AuthController');
const { getShow, getIndex, postUpload } = require('../controllers/FilesController');

const router = express.Router();

router.route('/status').get(getStatus);
router.route('/stats').get(getStats);
router.route('/connect').get(getConnect);
router.route('/disconnect').get(getDisconnect);
router.route('/users/me').get(getMe);
router.route('/files').get(getIndex).post(postUpload);
router.route('/files/:id').get(getShow);
router.route('/users').post(postNew);

module.exports = router;
