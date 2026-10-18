const fetchCart = (req,res)=>{
    res.type("text").status(200).send(`Fetching cart of user : ${req.params.userId}`);
}

const addProduct = (req,res)=>{
   
    res.type("text").status(201).send(`Adding product to cart for user with ID: ${req.params.userId}`);
}

export {fetchCart,addProduct};