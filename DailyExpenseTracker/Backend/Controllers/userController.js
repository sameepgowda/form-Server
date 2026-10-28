import {User} from "../../Database/index.js";


const createUser = async (req,res)=>{

    if(req.body.username){
        try{
            const username = req.body.username;
        const createId = await User.create({username});
        const responseData = {
            userId:createId.dataValues.id,
            username
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