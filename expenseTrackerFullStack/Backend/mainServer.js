import express from "express";
import expenseRouter from "./expenseRoute.js";
import cors from "cors";

const app = express();


app.use(cors({
    origin: "http://192.168.0.104:5500"
}));


app.use(express.json());

app.use("/expense",expenseRouter);

app.use((req,res,next)=>{
    res.status(404).json({message:"Bad Request"});
});

app.listen(3000);