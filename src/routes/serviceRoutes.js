const express = require('express');
const { authorize } = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');
const router = express.Router();

router.get('/', serviceController.getAllServices);
router.post('/', authorize(['provider', 'admin']), serviceController.createService);

module.exports = router;
