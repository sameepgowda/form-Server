import express from "express";
import {students} from "./data.js";

const router = express.Router();

router.get("/",(req,res)=>{
    let response = "students: ";
    for(let i=0;i<students.length;i++){
        response += `${students[i]["name"]}, `
    }
    res.status(200).type("text").send(response);
})

router.get("/:id",(req,res)=>{
    const response = students.find((val)=>val.id==req.params.id);
    res.status(200).json(response);
})

export {router};