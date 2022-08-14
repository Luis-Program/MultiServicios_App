require('dotenv').config();

const config = {
  port: process.env.port || 5000,
  dbUrl: process.env.DATABASE_URL
}

module.exports = { config };
