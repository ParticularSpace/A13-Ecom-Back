const Sequelize = require('sequelize');

// Connect to database
const sequelize = new Sequelize('ecommerce_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;
