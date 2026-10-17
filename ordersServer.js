import express from "express";

const app = express();

import {router as orderRouter} from "./orderRoutes.js";
import {router as userRouter} from "./userRoutes.js";

app.use("/orders",orderRouter);

app.use("/user",userRouter);

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})