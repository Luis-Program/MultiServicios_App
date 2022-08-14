const { Sequelize } = require('sequelize');
const setUpModels = require('../db/models/index');
const { config } = require('../config/config');

// const USER = encodeURIComponent(config.dbUser);
// const PASSWORD = encodeURIComponent(config.dbPassword);
// const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
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

// sequelize.sync();

module.exports = sequelize;
