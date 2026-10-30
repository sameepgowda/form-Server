import {ExpenseData} from "./expenseDb.js";
import {User} from "./userDb.js";

User.hasMany(ExpenseData,{
    foreignKey:"UserId"
})
ExpenseData.belongsTo(User,{
    foreignKey:"UserId"
})



export {User,ExpenseData};