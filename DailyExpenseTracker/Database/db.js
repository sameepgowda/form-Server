import { Sequelize } from "sequelize";

import dotenv from "dotenv";

dotenv.config();

const password = String(process.env.DB_PASSWORD);

const sequelize = new Sequelize('daily_expense_tracker', 'root', password, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false   // set to console.log to see the generated SQL
});


export {sequelize};