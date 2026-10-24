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


//sequelize.define() is one of the synchronous operation in sequelize
//The CRUD operations are asynchronous
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


const Bus = sequelize.define("Bus",{
    seatsAvailable:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
   
},
 {
        tableName:"busList",
        timestamps:false
        
    });


const Booking = sequelize.define("Booking",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    }

},

{
    tableName:"Bookings",
timestamps:false})

User.hasMany(Booking
);
Booking.belongsTo(User);
Bus.hasMany(Booking);
Booking.belongsTo(Bus);


await sequelize.sync();
//await sequelize.sync(); Synchronizes all models
export default {sequelize,User,Bus,Booking}

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


//Other synchronous operations of sequelize
// User.build() — creates an in-memory model instance without saving it to the database.

// User.getAttributes() — retrieves the model's attribute definitions.

// User.hasMany() — defines an association between models

// export default {connection,sequelize, User};

//console.log(result instanceof Promise); to check whether it returns a promise

//
// CREATE TABLE Students (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     teacher_id INT,
//     FOREIGN KEY (teacher_id) REFERENCES Teachers(id)
// );Here sql doesn't allow a student without a valid teacher id thats present as id in the teachers table

//Teacher.hasMany(Student, {
//     foreignKey: "teacher_id"
// }); Creates the foreign key teacher_id in student table



// const Teacher = sequelize.define("Teacher", {
//     name: DataTypes.STRING
// });

// const Student = sequelize.define("Student", {
//     name: DataTypes.STRING
// });

// Teacher.hasMany(Student);
//Creates a foreign key TeacherId in student table



// Person.hasOne(Passport, {
//     foreignKey: {
//         name: "person_id",
//         allowNull: false,
//         unique: true
//     }
// });


// const person = await Person.findByPk(1, {
//     include: Passport
// });                       //Left outer join
// 

// const person = await Person.findByPk(1, {
//     include: Passport,
//     required:true
// });                     //inner join

