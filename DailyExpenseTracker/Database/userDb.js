import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
    
    
});

// const PremiumUser = sequelize.define("PremiumUser",{
    
// })

export {User};