import express from "express";

const app = express();

app.use((req,res,next)=>{
    console.log(`${req.method} request made to ${req.url}`);
    next();
})

app.get("/products",(req,res)=>{
    res.type("text").status(200).send("Here is the list of products");
})

app.post("/products",(req,res)=>{
    res.type("text").status(201).send("A new product has been created");
})

app.get("/categories",(req,res)=>{
    res.type("text").status(200).send("Here is the list of categories");
})

app.post("/categories",(req,res)=>{
    res.type("text").status(201).send("A new categories has been added");
})


app.listen(4000);