import {User} from "../../Database/index.js";
import bcrypt from "bcrypt";


const createUser = async (req,res)=>{

    if(req.body.username && req.body.email && req.body.password){
        try{
            const {username,email,password} = req.body;
            const hashedPassword = await bcrypt.hash(password,10);
        const createId = await User.create({username,email,password:hashedPassword});
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
            const passwordsMatch = await bcrypt.compare(password,userInfo[0].password);
            if(passwordsMatch){
                return res.status(200).json({message:"Login successful",success:true})
            }else{
                return res.status(401).json({message:"User not authorized",success:false})
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




//401 is authentication and 403 is access