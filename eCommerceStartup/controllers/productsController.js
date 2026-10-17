const getProducts = (req,res)=>{
    res.type("text").status(200).send("Fetching all products");
};


const addProduct = (req,res)=>{
    res.type("text").status(201).send("Adding a new product");
};

const getProduct = (req,res)=>{
    res.type("text").status(200).send(`Fetching product with ID: ${req.params.id}`);
};

export {getProducts,addProduct,getProduct};