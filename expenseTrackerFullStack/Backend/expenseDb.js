import mysql from "mysql2";
// const Sequelize = require("sequelize");
import { Sequelize,DataTypes } from "sequelize";

const sequelize = new Sequelize('test_db','root','Redblack$1$',{
    host:'localhost',
    dialect:'mysql',
    port:3306
});

const testSequelizeConnection = async ()=>{
    try{  await sequelize.authenticate(); //This function returns a resolved promise with udefined on successful authentication or a rejected promise if authentication fails.
    }catch(err){
        console.log("Database authentication error:",err);
    }
}

testSequelizeConnection();

const Expense = sequelize.define("Expense",{
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

sequelize.sync();

export default {Expense}
