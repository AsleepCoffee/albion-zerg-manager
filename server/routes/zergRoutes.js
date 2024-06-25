const express = require('express');
const router = express.Router();
const zergController = require('../controllers/zergController');

router.get('/', zergController.getZergs);
router.post('/', zergController.addZerg);

module.exports = router;
