const express = require('express');
const { getBestProfession } = require('../controllers/admin.contoller');
const router = express.Router();

router.get('/best-profession', getBestProfession);

module.exports = router;