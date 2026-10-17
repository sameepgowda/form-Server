import express from "express";

const router = express.Router();

router.get("/:userId",(req,res)=>{
    res.type("text").status(200).send(`Fetching cart of user : ${req.params.userId}`);
});

router.post("/:userId",(req,res)=>{
   
    res.type("text").status(201).send(`Adding product to cart for user with ID: ${req.params.userId}`);
});


export {router};

