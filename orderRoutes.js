import express from "express";

const router = express.Router();

router.get("/",(req,res)=>{
    res.type("text").status(200).send("Here is the list of orders");
})

router.post("/",(req,res)=>{
    res.type("text").status(201).send("A new order has been created");
})

export {router};