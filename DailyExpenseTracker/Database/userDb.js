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
        unique:true,
        allowNull:false
    }
    
    
});

export {User};