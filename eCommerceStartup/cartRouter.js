import express from "express";
import { fetchCart,addProduct } from "./controllers/cartController.js";

const router = express.Router();

router.get("/:userId",fetchCart);

router.post("/:userId",addProduct);


export {router};

