import express from "express";
import {router as studentRouter} from "./studentRouter.js";
import {router as courseRouter} from "./courseRouter.js";

const app = express();

app.get("/",(req,res)=>{
    res.status(200).type("text").send("Welcome to the Student & Course Portal API!");
})

app.use("/students",studentRouter);
app.use("/courses",courseRouter);

app.use((req,res,next)=>{
    res.status(404).send("Page not found");
})              // Handles udefined routes

app.listen(3000);