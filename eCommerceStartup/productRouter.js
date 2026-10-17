import express from "express";
import { getProducts,addProduct,getProduct } from "./controllers/productsController.js";

const router = express.Router();

router.get("/",getProducts);

router.post("/",addProduct);

router.get("/:id",getProduct);

export {router};

