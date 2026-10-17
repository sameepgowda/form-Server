import express from "express";

import {router as cartRouter} from "./cartRouter.js";
import {router as productRouter} from "./productRouter.js";
import {router as userRouter} from "./userRouter.js";

const app = express();

app.use("/users",userRouter);

app.use("/products",productRouter);

app.use("/cart",cartRouter);

app.use((req,res,next)=>{
    res.status(404).send("Page not found"); 
})

app.listen(3000);