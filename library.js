import express from "express";
import {router as booksRouter} from "./booksRouter.js";


const app = express();

app.use(express.json())

app.use("/books",booksRouter);


app.listen(3000);