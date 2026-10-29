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

const userLogin = async (req,res)=>{
    if(req.body.email && req.body.password){
        try{
            const {email, password} = req.body;
        const userInfo = await User.findAll({where:{email},raw:true});
        if(userInfo.length==0){
            return res.status(404).json({message:"User not found",success:false});
        }else{
            if(userInfo[0].password==password){
                return res.status(200).json({message:"Login successful",success:true})
            }else{
                return res.status(404).json({message:"Passwords do not match",success:false})
            }
        }
        }catch(err){
            res.status(500).json({error:err.message});
        }
        
    }else{
        res.status(400).json({message:"Bad request"})
    }
}


export default {createUser, userLogin};