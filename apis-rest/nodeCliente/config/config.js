require('dotenv').config();

const config = {
  port: process.env.port || 3000,
  dbUrl: process.env.DATABASE_URL
}

module.exports = { config};
