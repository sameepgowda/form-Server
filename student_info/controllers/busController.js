import connection from "../utils/db.js";

const addBus = (req,res)=>{
    if(req.body.seatsAvailable){
        const insertUserQuery = "insert into busList (seatsAvailable) values(?)"
        connection.execute(insertUserQuery,[req.body.seatsAvailable],(err,result)=>{
            if(err){
                res.status(500).json({error:"Database error"});
                console.log("bus insert error",err);
            }else{
                console.log("bus insert result",result);
                res.status(201).json({message:"Bus added",
                    busInfo:{
                        id:result.insertId,
                        seatsAvailable:req.body.seatsAvailable
                        
                    }
                });
            }
        })
    }else{
        res.status(400).json({error:"Bad request"});
    }
}

export default {addBus};