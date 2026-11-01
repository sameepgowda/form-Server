import { Sequelize } from "sequelize";

const sequelize = new Sequelize('daily_expense_tracker','root','***REMOVED***',{
    host:'localhost',
    dialect:'mysql',
    port:3306,
//     pool: {
//     max: 10,        // ← Maximum number of connections in the pool
//     min: 0,         // Minimum number of connections
//     acquire: 30000, // Maximum time (ms) to try getting a connection before throwing error
//     idle: 10000     // Maximum time (ms) a connection can be idle before being released
//   }
});


export {sequelize};
