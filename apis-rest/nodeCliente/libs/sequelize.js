const { Sequelize } = require('sequelize');
const setUpModels = require('../db/models/index');
const { config } = require('../config/config');

const URI = config.dbUrl;

const sequelize = new Sequelize(URI, {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 35,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});

setUpModels(sequelize);

module.exports = sequelize;
