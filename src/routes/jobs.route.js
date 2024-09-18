const express = require('express');
const { getProfile } = require('../middlewares/getProfile');
const { getUnpaidJobs, payForJob } = require('../controllers/jobs.controller');
const router = express.Router();

router.get('/unpaid', getProfile, getUnpaidJobs);
router.post('/:job_id/pay', getProfile, payForJob);

module.exports = router;