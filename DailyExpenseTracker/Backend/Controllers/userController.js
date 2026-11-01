import {User} from "../../Database/index.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const JWTkey = "JPHJ9qZNUADGiQxVCyOrQmeRf9vmdmGJ4rHoU5rktgO";


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
            console.log(err);
        }
        
    }else{
        return res.status(400).json({message:"Bad request"})
    }

}

const userLogin = async (req,res)=>{
    if(req.body.email && req.body.password){
        try{
            const {email, password} = req.body;
        const userInfo = await User.findOne({where:{email},raw:true});
        console.log("userInfo",userInfo);
        if(userInfo.length==0){
            return res.status(404).json({message:"User not found",success:false});
        }else{
            const passwordsMatch = await bcrypt.compare(password,userInfo.password);
            if(passwordsMatch){
                const token = jwt.sign({UserId:userInfo.id},JWTkey,{expiresIn:"1h"})
                return res.status(200).json({message:"Login successful",success:true,token:token,isPremium:userInfo.isPremium})
            }else{
                return res.status(401).json({message:"User not authorized",success:false})
            }
        }
        }catch(err){
            res.status(500).json({error:err.message});
            console.log(err);
        }
        
    }else{
        res.status(400).json({message:"Bad request"})
    }
}


const getLeaderBoardData = async (req,res)=>{
    if(req.UserId){
        try{
        const leaderBoardData = await User.findAll({order:[["totalExpense","desc"]], raw:true});
        res.status(200).json({leaderBoardList:leaderBoardData});
    }catch(err){
        next(err);
    }
    }else{
        res.status(400).json({message:"Bad request"});
    }
    
}


export default {createUser, userLogin, getLeaderBoardData};




//401 is authentication and 403 is access


// Method	What happens?
// next()	Moves to the next regular middleware/handler
// next(err)	Skips regular middleware and moves to error-handling middleware
// next("route")	next("route") skips the rest of the current route, not every route in your application.