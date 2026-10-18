import path from "node:path";
import { fileURLToPath } from "node:url";


const getProducts = (req,res)=>{
    const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    let filePath = path.join(__dirname, "..","View","products.html")
    res.status(200).sendFile(filePath);
};


const addProduct = (req,res)=>{
    res.type("text").status(201).send("Adding a new product");
};

const getProduct = (req,res)=>{
    res.type("text").status(200).send(`Fetching product with ID: ${req.params.id}`);
};

export {getProducts,addProduct,getProduct};