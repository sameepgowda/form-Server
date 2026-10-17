import express from "express";
import {courses} from "./data.js";

const router = express.Router();

router.get("/",(req,res)=>{
    let response = "Courses: ";
    for(let i=0;i<courses.length;i++){
        response += `${courses[i]["name"]}, `
    }
    res.status(200).type("text").send(response);
})

router.get("/:id",(req,res)=>{
    const response = courses.find((val)=>val.id==req.params.id);
    res.status(200).json(response);
})

export {router};