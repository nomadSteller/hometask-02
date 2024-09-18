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

const getBestClients = async (req, res) => {
  const { start, end, limit = 2 } = req.query;

  try {
    const clients = await Profile.findAll({
      where: { type: 'client' },
      attributes: [
        'id', 'firstName', 'lastName',
        [sequelize.fn('sum', sequelize.col('Client.Jobs.price')), 'totalPaid'] 
      ],
      include: [
        {
          model: Contract,
          as: 'Client',
          attributes: [], // Removed attributes to avoid including unnecessary fields
          include: [
            {
              model: Job,
              where: {
                paid: true,
                paymentDate: {
                  [Op.between]: [new Date(start), new Date(end)]
                }
              },
              attributes: [] // Removed attributes to avoid including unnecessary fields
            }
          ],
          required: true // Added to ensure only contracts with jobs within the date range are included
        }
      ],
      group: ['Profile.id'],  // Group by profile id to aggregate correctly
      order: [[sequelize.literal('totalPaid'), 'DESC']],  // Order by total paid descending
      limit: parseInt(limit, 10),
      subQuery: false
    });

    res.json(clients);
  } catch (error) {
    console.error('Error fetching best clients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getBestProfession, getBestClients }
