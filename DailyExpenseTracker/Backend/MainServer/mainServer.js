import express from "express";
import cors from "cors";
import userRouter from "../Routes/userRoute.js";
import expenseRouter from "../Routes/expenseRoute.js";
import paymentRouter from "../Routes/paymentRoute.js";
import {sequelize} from "../../Database/db.js";
// import cors from "cors";
import errorHandler from "../Controllers/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();



await sequelize.authenticate();

await sequelize.sync();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN
}));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/expenseTracker/user",userRouter);
app.use("/api/expenseTracker/expense",expenseRouter);
app.use("/api/expenseTracker/payment", paymentRouter);

app.use("/api/expenseTracker",errorHandler);

app.use((req,res,next)=>{
    res.status(404).json({message:"Page not found"});
});

app.listen(Number(process.env.SERVER_PORT));











