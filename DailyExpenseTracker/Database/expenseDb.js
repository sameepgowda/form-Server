import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import {User} from "./userDb.js";


const ExpenseData = sequelize.define("ExpenseData",{
    UserId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:"id"
        }
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    expenseAmount:{
        type:DataTypes.DECIMAL(12,2),
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        defaultValue:null,
        allowNull:true
    }
},
{tableName:"ExpenseData"})

const DailyBalance = sequelize.define("DailyBalance",{
    UserId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:"id"
        }
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    closingBalance:{
        type:DataTypes.DECIMAL(12,2),
        allowNull:false,
        defaultValue:0
    }
},
{
    indexes:[
        {unique:true,fields:["date","UserId"]}
    ],
    tableName:"DailyBalance"
}
)



export {ExpenseData,DailyBalance};



// const today = new Date();

//date.setDate(today.getDate()-1)

// const dateString = date.toISOString().slice(0, 10);

// console.log(dateString);
// const dateObject = new Date(dateString);