import dbObj from "../utils/db.js";
import {Op} from "sequelize";
import { Sequelize } from "sequelize";

const addBus = async (req,res)=>{
    if(req.body.seatsAvailable){
        // const insertUserQuery = "insert into busList (seatsAvailable) values(?)"
        // connection.execute(insertUserQuery,[req.body.seatsAvailable],(err,result)=>{
        //     if(err){
        //         res.status(500).json({error:"Database error"});
        //         console.log("bus insert error",err);
        //     }else{
        //         console.log("bus insert result",result);
        //         res.status(201).json({message:"Bus added",
        //             busInfo:{
        //                 id:result.insertId,
        //                 seatsAvailable:req.body.seatsAvailable
                        
        //             }
        //         });
        //     }
        // })
        try{
            const insertId = await dbObj.Bus.create({
                seatsAvailable:req.body.seatsAvailable
            });
            res.status(201).json({message:"Bus inserted successfully",
                inserId: insertId.dataValues.id
            })
        }catch(err){
            res.status(500).json({error:err.message});
        }
    }else{
        res.status(400).json({error:"Bad request"});
    }
}

const getBuses = async (req,res)=>{
    try{
        const reqestedSeats = parseInt(req.params.seats);
    const availableBuses = await dbObj.Bus.findAll({where:{
        seatsAvailable:{
            [Op.gt]:reqestedSeats
        }
    }});
    let resBuses = [];
    for(let bus of availableBuses){
        resBuses.push(bus.dataValues);
    }
    res.status(200).json({
        availableBuses:resBuses
    })
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
    
}

export default {addBus,getBuses};