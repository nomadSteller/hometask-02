const { Profile, Job, Contract, sequelize } = require('../models');
const { Op } = require('sequelize');

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

      // Fetch job details within the transaction and lock the row
      const job = await Job.findOne({
        where: { id: job_id },
        include: Contract,
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      if (!job) throw new Error('Job not found');
      if (profileId != job.Contract.ClientId) throw new Error('Job does not belong to client');
      if (job.paid) throw new Error ('Job is already paid');

      // Fetch client profiles within the transaction and lock the rows
      const client = await Profile.findOne({
        where: { id: job.Contract.ClientId },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      // Fetch contractor profiles within the transaction and lock the rows
      const contractor = await Profile.findOne({
        where: { id: job.Contract.ContractorId },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!client || !contractor) throw new Error('Client or Contractor not found');

      console.log( "client.balance =>", client.balance)
      console.log( "job.price =>", job.price)

      if (client.balance < job.price) throw new Error('Insufficient balance');

      // Update balances
      client.balance -= job.price;
      contractor.balance += job.price;
      job.paid = true;
      job.paymentDate = new Date();

      // Save updated entities within the transaction
      await client.save({ transaction });
      await contractor.save({ transaction });
      await job.save({ transaction });
    });
    // If no errors were thrown inside the transaction block, Sequelize commits the transaction automatically

    res.json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Transaction failed:', error);
    res.status(500).json({ error: 'Transaction failed', message: error.message });
  }
}

module.exports = { getUnpaidJobs, payForJob }