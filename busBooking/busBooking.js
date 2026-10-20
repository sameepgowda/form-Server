import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Redblack$1$",
    database: "bus"
});

connection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Connected to database");
    }
});

const query1 = `CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL
);`

const query2 = `CREATE TABLE Buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    busNumber VARCHAR(20) NOT NULL,
    totalSeats INT NOT NULL,
    availableSeats INT NOT NULL
);`

const query3 = `CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seatNumber INT NOT NULL
);`

const query4 =`CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amountPaid DECIMAL(10, 2) NOT NULL,
    paymentStatus VARCHAR(30) NOT NULL
)`


connection.query(query1,(err,result)=>{
    if(err){
        console.log(err);
    }else{
        console.log("result",result);
    }
});

connection.query(query2,(err,result)=>{
    if(err){
        console.log(err);
    }else{
        console.log("result",result);
    }
});

connection.query(query3,(err,result)=>{
    if(err){
        console.log(err);
    }else{
        console.log("result",result);
    }
})

connection.query(query4,(err,result)=>{
    if(err){
        console.log(err);
    }else{
        console.log("result",result);
    }
})
