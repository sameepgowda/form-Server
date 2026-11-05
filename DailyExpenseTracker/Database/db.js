import { Sequelize } from "sequelize";

import dotenv from "dotenv";

dotenv.config();

const password = String(process.env.DB_PASSWORD);

const sequelize = new Sequelize(process.env.SCHEMA_NAME, process.env.DB_USER, password, {
    host: process.env.RDS_ENDPOINT,
    dialect: 'mysql',
    logging: false   // set to console.log to see the generated SQL
});


export {sequelize};