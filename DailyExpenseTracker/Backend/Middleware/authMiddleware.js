import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

;

const JWTkey = process.env.JWT_KEY;

const authMiddleware = (req,res,next) =>{
    try{
        console.log("headers",req.headers);
        const authToken = req.headers.authorization;
        if(!authToken){
            return res.status(401).json({message:"Access denied. No token provided"});
        }else{
                const decoded = jwt.verify(authToken,JWTkey);
                    req.UserId = decoded.UserId;
                    next();
        
        }
    }catch(err){
        res.status(401).json({message:"Invalid or expired token"});
    }
}

export default authMiddleware;


//The flow moves to catch block if there is any error THROWN in the try block
//If the token is invalid or expired, jwt.verify() throws an error.