const { Profile, Job, Contract } = require('../models');

const depositBalance = async (req, res) => { 
  const { userId } = req.params;
  const { amount } = req.body;

  const client = await Profile.findOne({ where: { id: userId } });
  const unpaidJobs = await Job.findAll({
    include: {
      model: Contract,
      where: { clientId: userId, status: 'in_progress' }
    },
    where: { paid: false }
  });

  const totalToPay = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
  const maxDeposit = totalToPay * 0.25;

  if (amount > maxDeposit) return res.status(400).json({ error: `Maximum deposit allowed is ${maxDeposit}` });

  client.balance += amount;
  await client.save();

  res.json({ message: 'Deposit successful' });
}

module.exports = { depositBalance }