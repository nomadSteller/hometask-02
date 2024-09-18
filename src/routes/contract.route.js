const express = require('express');
const { getProfile } = require('../middlewares//getProfile');
const { getContractById } = require('../controllers/contracts.controller');
const router = express.Router();

router.get('/:id', getProfile, getContractById);

module.exports = router;