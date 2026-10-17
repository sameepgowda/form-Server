import express from "express";

const router = express.Router();

router.get("/",(req,res)=>{
    res.type("text").status(200).send("Here is the list of users");
})

router.post("/",(req,res)=>{
    res.type("text").status(201).send("A new user has been added");
})

export {router};