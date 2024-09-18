const { sequelize, Job, Profile, Contract } = require('../models');
const { Op } = require('sequelize');

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  const jobs = await Job.findAll({
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [new Date(start), new Date(end)],
      },
    },
    include: [
      {
        model: Contract,
        include: [
          {
            model: Profile,
            as: 'Contractor',
            attributes: ['profession'],
          },
        ],
      },
    ],
    attributes: [
      'Contract.Contractor.profession',
      [sequelize.fn('sum', sequelize.col('price')), 'total'],
    ],
    group: ['Contract.Contractor.profession'],
    order: [[sequelize.literal('total'), 'DESC']],
    limit: 1,
  });

  res.json(jobs[0]);
}

module.exports = { getBestProfession }
