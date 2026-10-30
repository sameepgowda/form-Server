import express from "express";
import cors from "cors";
import userRouter from "../Routes/userRoute.js";
import expenseRouter from "../Routes/expenseRoute.js";
import {sequelize} from "../../Database/db.js";
// import cors from "cors";
import errorHandler from "../Controllers/errorHandler.js";

await sequelize.authenticate();

await sequelize.sync();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));


app.use(express.json());

app.use("/expenseTracker/user",userRouter);
app.use("/expenseTracker/expense",expenseRouter);

app.use("/expenseTracker",errorHandler);

app.use((req,res,next)=>{
    res.status(404).json({message:"Page not found"});
});

app.listen(3000);

