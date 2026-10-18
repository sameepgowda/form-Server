const getUsers = (req,res)=>{
    
    res.type("text").status(200).send("Fetching all users");
}


const addUser = (req,res)=>{
   
    res.type("text").status(201).send("Adding a new user");
}

const getUser = (req,res)=>{
    res.type("text").status(200).send(`Fetching user with ID: ${req.params.id}`);
}

export{getUser,getUsers,addUser};