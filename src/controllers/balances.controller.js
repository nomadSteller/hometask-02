const { sequelize, Profile, Job, Contract } = require('../models');

const depositBalance = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Lock the profile row for update
    const client = await Profile.findOne({
      where: { id: userId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!client) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch unpaid jobs within the same transaction
    const unpaidJobs = await Job.findAll({
      include: {
        model: Contract,
        where: { clientId: userId, status: 'in_progress' }
      },
      where: { paid: false },
      transaction,
    });

    // Calculate the total amount to pay and maximum deposit
    const totalToPay = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
    const maxDeposit = totalToPay * 0.25;

    if (amount > maxDeposit) {
      await transaction.rollback();
      return res.status(400).json({ error: `Maximum deposit allowed is ${maxDeposit}` });
    }

    // Update the client's balance
    client.balance += amount;
    await client.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    res.json({ message: 'Deposit successful' });
  } catch (error) {
    // Rollback the transaction in case of any error
    await transaction.rollback();
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { depositBalance }