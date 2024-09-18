const { Contract } = require('../models');
const { Op } = require('sequelize');

/**
 * FIX ME!
 * @returns contract by id
 */
const getContractById = async (req, res) => {
  const {id} = req.params
  const contract = await Contract.findOne({where: {id}})
  if(!contract) return res.status(404).end()
  res.json(contract)
};

module.exports = { getContractById };