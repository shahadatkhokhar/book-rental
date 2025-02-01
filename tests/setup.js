require("dotenv").config();
const sequelize = require("../config/db.config");

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});
