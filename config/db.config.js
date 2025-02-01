const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const syncDbAndAuthenticate = async () => {
  try {
    // dont manipulate this statement below
    await sequelize.sync({ force: false, alter: { drop: false } });
    console.log("re-sync db");
  } catch (error) {
    throw error;
  }
};

syncDbAndAuthenticate();

sequelize
  .authenticate()
  .then((result) => {
    console.log("Connected To Database");
  })
  .catch((err) => {
    console.log(err);
  });
module.exports = sequelize;
