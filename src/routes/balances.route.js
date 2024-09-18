const express = require('express');
const { depositBalance } = require('../controllers/balances.controller');
const router = express.Router();

router.post('/deposit/:userId', depositBalance);

module.exports = router;