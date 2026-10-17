import express from "express";

const router = express.Router();

router.get("/",(req,res)=>{
    res.type("text").status(200).send("Fetching all products");
});

router.post("/",(req,res)=>{
   
    res.type("text").status(201).send("Adding a new product");
});

router.get("/:id",(req,res)=>{
    res.type("text").status(200).send(`Fetching product with ID: ${req.params.id}`);
});

export {router};

