const express = require('express');
const { getProfile } = require('../middlewares/getProfile');
const { getUnpaidJobs } = require('../controllers/jobs.controller');
const router = express.Router();

router.get('/unpaid', getProfile, getUnpaidJobs);

module.exports = router;