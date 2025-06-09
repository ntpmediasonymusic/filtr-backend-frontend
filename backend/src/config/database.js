const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DESMAN_DB_ENV_MYSQL_DATABASE,
  process.env.DESMAN_DB_ENV_MYSQL_USER,
  process.env.DESMAN_DB_ENV_MYSQL_PASSWORD,
  {
    host: process.env.DESMAN_DB_PORT_3306_TCP_ADDR,
    port: process.env.DESMAN_DB_PORT_3306_TCP_PORT,
    dialect: "mysql", // ahora MySQL
    logging: process.env.NODE_ENV === "development",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
