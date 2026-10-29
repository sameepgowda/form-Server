import {User} from "../../Database/index.js";


const createUser = async (req,res)=>{

    if(req.body.username && req.body.email && req.body.password){
        try{
            const {username,email,password} = req.body;
        const createId = await User.create({username,email,password});
        const responseData = {
            userId:createId.dataValues.id,
            username,
            email,
            password
        }
        return res.status(201).json({message:"User created",
            userInfo:responseData
        })
        }catch(err){
            res.status(500).json({error:err.message});
            throw err;
        }
        
    }else{
        return res.status(400).json({message:"Bad request"})
    }

}


export default {createUser};