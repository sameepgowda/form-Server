import express from "express";
import studentRoute from "../Routes/studentRoute.js";
import attendanceRoute from "../Routes/attendanceRoute.js";
import cors from "cors";

const app = express();


app.use(cors({
    origin: "http://192.168.0.104:5500"
}));


app.use(express.json());

app.use("/student",studentRoute);
app.use("/attendance",attendanceRoute);

app.use((req,res,next)=>{
    res.status(404).json({message:"Bad Request"});
});

app.listen(3000);