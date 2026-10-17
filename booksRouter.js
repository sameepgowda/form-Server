import express from "express";

const router = express.Router();

router.get("/",(req,res)=>{
    const msg = "Here is the list of books";
    console.log(msg);
    res.status(200).type("text").send(msg);
});

router.post("/",(req,res)=>{
    console.log(req.body);
    res.status(201).json({
        bookData:req.body,
        message:"Book has been added"
    })
})

export {router};