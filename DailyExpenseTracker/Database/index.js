import {ExpenseData} from "./expenseDb.js";
import {User, ForgotPasswordRequest} from "./userDb.js";

User.hasMany(ExpenseData,{
    foreignKey:"UserId"
})
ExpenseData.belongsTo(User,{
    foreignKey:"UserId"
})

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);



export {User,ExpenseData , ForgotPasswordRequest
};