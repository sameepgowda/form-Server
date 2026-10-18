import errorRes from "../utils/errorResponse.js"

const getUsers = (req,res)=>{
    
    res.type("text").status(200).send("Fetching all users");
}


const addUser = (req,res)=>{
   
    res.type("text").status(201).send("Adding a new user");
}

const getUser = (req,res)=>{
    if(req.params.id>10){
            errorRes.errorResponse(res,{status:404,message:"User not found"});
    }else{res.type("text").status(200).send(`Fetching user with ID: ${req.params.id}`)};
}

export{getUser,getUsers,addUser};