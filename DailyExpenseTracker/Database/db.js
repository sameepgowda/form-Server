import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize('daily_expense_tracker','root','Redblack$1$',{
    host:'localhost',
    dialect:'mysql',
    port:3306
});


export {sequelize};
