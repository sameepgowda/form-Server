import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Redblack$1$",
    database: "test_db"
});

connection.connect((err)=>{
    console.log(err);
})

const createTableQuery = `
create table userList(
id int auto_increment primary key,
name varchar(100) not null,
email varchar(100) not null
)
`

// connection.execute(createTableQuery,(err,result)=>{
//     if(err){
//         console.log("Create table error:",err)
//     }else{
//         console.log("create table result",result);
//     }
// })

export default connection;