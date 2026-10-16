import express from "express";

const app = express();

app.get("/orders",(req,res)=>{
    res.type("text").status(200).send("Here is the list of orders");
})

app.post("/orders",(req,res)=>{
    res.type("text").status(201).send("A new order has been created");
})

app.get("/users",(req,res)=>{
    res.type("text").status(200).send("Here is the list of users");
})

app.post("/users",(req,res)=>{
    res.type("text").status(201).send("A new user has been added");
})

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})