import express from "express";

const app = express();

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

app.use((req,res)=>{
    res.status(404).type("html").send(`<h1>404-page not found</h1>`)
})

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})