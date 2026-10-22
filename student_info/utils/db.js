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

const User = sequelize.define("User",{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    }

},

{
    tableName:"userlist",
    timestamps:false
}


);


User.sync();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Redblack$1$",
    database: "test_db"
});

// connection.connect((err)=>{
//     console.log(err);
// })

// const createTableQuery = `
// create table userList(
// id int auto_increment primary key,
// name varchar(100) not null,
// email varchar(100) not null
// )
// `

// connection.execute(createTableQuery,(err,result)=>{
//     if(err){
//         console.log("Create table error:",err)
//     }else{
//         console.log("create table result",result);
//     }
// })

export default {connection,sequelize, User};