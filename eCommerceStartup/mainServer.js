import express from "express";

import {router as cartRouter} from "./cartRouter.js";
import {router as productRouter} from "./productRouter.js";
import {router as userRouter} from "./userRouter.js";
import path from "node:path";

import { fileURLToPath } from "node:url";

const app = express();
 const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "View")));

app.use(express.json());
// app.use(express.static("public"));

app.use("/users",userRouter);

app.use("/products",productRouter);

app.use("/cart",cartRouter);

app.use((req,res,next)=>{
    res.status(404).send("Page not found"); 
})

app.listen(3000);