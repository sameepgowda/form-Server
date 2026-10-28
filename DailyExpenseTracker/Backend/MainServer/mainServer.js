import express from "express";
import cors from "cors";
import userRouter from "../Routes/userRoute.js";
import expenseRouter from "../Routes/expenseRoute.js";
import {sequelize} from "../../Database/db.js";


// app.use(cors({
//     origin: "http://192.168.0.104:5500"
// }));


await sequelize.authenticate();

await sequelize.sync();

const app = express();


app.use(express.json());

app.use("/expenseTracker/user",userRouter);
app.use("/expenseTracker/expense",expenseRouter);

app.use((req,res,next)=>{
    res.status(404).json({message:"Page not found"});
});

app.listen(3000);

