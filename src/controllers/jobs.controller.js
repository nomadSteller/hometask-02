const { Job, Contract } = require('../models');
const { Op } = require('sequelize');
var sequelize = require('../config/db');

const getUnpaidJobs = async (req, res) => {
  const profileId = req.profile.id;

  const jobs = await Job.findAll({
    include: {
      model: Contract,
      where: { 
        [Op.or]: [
          { ClientId: profileId }, 
          { ContractorId: profileId }
        ], 
        status: 'in_progress' 
      }
    },
    where: { paid: false }
  });

  res.json(jobs);
}

module.exports = { getUnpaidJobs }