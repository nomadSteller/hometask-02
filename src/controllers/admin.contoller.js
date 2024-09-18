const { setEndTime } = require('../helpers/genericFun');
const { sequelize, Job, Profile, Contract } = require('../models');
const { Op } = require('sequelize');

/* 
  Expected date format in YYYY/MM/DD
  Eg: '2024/06/14'
**/
const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  const jobs = await Job.findAll({
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [new Date(start), setEndTime(end)],
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

  let result = {total: null, profession: ''}
  if( jobs.length > 0 ) {
    result.total = jobs[0].dataValues.total,
    result.profession = jobs[0].Contract.Contractor.profession
  }

  res.json(result);
}

module.exports = { getBestProfession }
