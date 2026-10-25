import dbObj from "../Database/db.js";


const addStudent =  async (req,res)=>{
   
    
    if(req.body.name){
        try{
                const createdId = await dbObj.Student.create({
            name:req.body.name
        })
        res.status(201).json({message:'Student created',
            studentInfo:{
                id:createdId.dataValues.id,
                name:req.body.name
            }
        })
    }catch(err){
        res.status(500).json({Error:err.message});
    }

    }else{
        res.status(400).json({error:'Bad request'});
    }
};


const getStudents = async (req,res)=>{
    try{
        const students = await dbObj.Student.findAll();
        res.status(200).json({students});
    }catch(err){
        res.status(500).json({Error:err.message});
    }
}

export default {addStudent,getStudents};
