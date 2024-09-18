const { Contract } = require('../models');
const { Op } = require('sequelize');

const getContractById = async (req, res) => {
  const { id } = req.params;
  const profileId = req.profile.id;

  const contract = await Contract.findOne({ 
    where: {
      id,
      [Op.or]: [
        { ClientId: profileId },
        { ContractorId: profileId }
      ]
    }
  });

  if (!contract) return res.status(404).end();

  res.json(contract);
};

module.exports = { getContractById };