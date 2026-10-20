import connection from "../utils/db.js";

const insertUser =  (req,res)=>{
    
    if(req.body.name && req.body.email){
        
        const insertUserQuery = "insert into userList (name,email) values(?,?)"
        connection.execute(insertUserQuery,[req.body.name,req.body.email],(err,result)=>{
            if(err){
                res.status(500).json({error:"Database Error"});
                console.log("insert error",err);
            }else{
                console.log("insert result",result);
                res.status(201).json({message:"user created",
                    userInfo:{
                        id:result.insertId,
                        name:req.body.name,
                        email:req.body.email
                    }
                });
            }
        })
    }else{
        res.status(400).json({error:'Bad request'});
    }
}

const updateUser =  (req,res)=>{
    
    if(req.body.name && req.body.email && req.body.id){
        console.log(req.body);
        const insertUserQuery = `update userList set name=(?),email=(?) where id=${req.body.id}`
        connection.execute(insertUserQuery,[req.body.name,req.body.email],(err,result)=>{
            if(err){
                console.log("update Error",err);
                res.status(500).json({error:"Database error"});
            }else{
                console.log("update result",result);
                res.status(201).json({message:"user updated",
                    userInfo:{
                        id:req.body.id,
                        name:req.body.name,
                        email:req.body.email
                    }
                });
            }
        })
    }else{
        res.status(400).json({error:'Bad request'});
    }
}


const deleteUser = (req,res)=>{
    if(req.params.id){
        const id = parseInt(req.params.id);
        const deleteQuery = `delete from userList where id = (?)`;
        connection.execute(deleteQuery,[id],(err,result)=>{
            if(err){
                res.status(500).json({error:"Database error"});
            }else{
                console.log("delete result",result);
                res.status(204).end();
            }
        })

    }else{
        res.status(400).jason({error:"Bad request"});
    }
}

export default {insertUser,updateUser,deleteUser};


//Remember the difference between parseInt() and Number();