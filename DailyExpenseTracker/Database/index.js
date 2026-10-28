import {ExpenseData,DailyBalance} from "./expenseDb.js";
import {User} from "./userDb.js";

User.hasMany(ExpenseData,{
    foreignKey:"UserId"
})
ExpenseData.belongsTo(User,{
    foreignKey:"UserId"
})

User.hasMany(DailyBalance,{
    foreignKey:"UserId"
})
DailyBalance.belongsTo(User,{
    foreignKey:"UserId"
})

export {User,ExpenseData,DailyBalance};