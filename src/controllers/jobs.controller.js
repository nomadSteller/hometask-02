const { Profile, Job, Contract } = require('../models');
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

const payForJob = async (req, res) => {
  const { job_id } = req.params;
  const profileId = req.profile.id;

  try {
    // Start a transaction
    await sequelize.transaction(async (transaction) => {
      // Inside this function, Sequelize operations are part of the transaction

      const job = await Job.findOne({ where: { id: job_id }, include: Contract }, { transaction });
      if (!job) return res.status(404).end();

      const client = await Profile.findOne({ where: { id: job.Contract.ClientId } }, { transaction });
      const contractor = await Profile.findOne({ where: { id: job.Contract.ContractorId } }, { transaction });

      if (client.balance < job.price) return res.status(400).json({ error: 'Insufficient balance' });

      // Update balances
      client.balance -= job.price;
      contractor.balance += job.price;
      contractor.status = 'terminated'  // assuming the job got completed after that only client is making payment.
      job.paid = true;

      // Save updated entities within the transaction
      await client.save({ transaction });
      await contractor.save({ transaction });
      await job.save({ transaction });
    });
    // If no errors were thrown inside the transaction block, Sequelize commits the transaction automatically

    res.json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Transaction failed:', error);
    res.status(500).json({ error: 'Transaction failed' });
  }
}

module.exports = { getUnpaidJobs, payForJob }