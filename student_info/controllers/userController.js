import connection from "../utils/db.js";
import dbObj from "../utils/db.js";


const getUsers = async (req,res)=>{
    try{

        const users = await dbObj.User.findAll();
        let userList = [];
        for(let obj of users){
            console.log("obj",obj.dataValues);
            userList = [...userList,obj.dataValues];
        }
         console.log("GET ALL USERS",users);
         res.status(200).json({message:"Fetching all users",
            userList:userList
         });
    }catch(err){
        console.log("err",err)
        res.status(500).send({message:"Database error",error:err.message});
    }
   
    
}

const insertUser =  async (req,res)=>{
    console.log("1",dbObj);
    console.log("2",dbObj.User)
    console.log("3",typeof dbObj.User.create)
    
    if(req.body.name && req.body.email){
        try{
                    const createdId = await dbObj.User.create({
            name:req.body.name,
            email:req.body.email
        })
        console.log("CreatedID with Sequelize:",createdId);
        res.status(201).json({message:'User created',
            userInfo:{
                id:createdId.dataValues.id,
                name:req.body.name,
                email:req.body.email
            }
        })
    }catch(err){
        console.log("Database error:",err);
        res.status(500).json({Error:"Database error"});
    }

        // const insertUserQuery = "insert into userList (name,email) values(?,?)"
        // connection.execute(insertUserQuery,[req.body.name,req.body.email],(err,result)=>{
        //     if(err){
        //         res.status(500).json({error:"Database Error"});
        //         console.log("insert error",err);
        //     }else{
        //         console.log("insert result",result);
        //         res.status(201).json({message:"user created",
        //             userInfo:{
        //                 id:result.insertId,
        //                 name:req.body.name,
        //                 email:req.body.email
        //             }
        //         });
        //     }
        // })
    }else{
        res.status(400).json({error:'Bad request'});
    }
}

const updateUser =  async (req,res)=>{
    
    if(req.body.name && req.body.email && req.body.id){
        // console.log(req.body);
        // const insertUserQuery = `update userList set name=(?),email=(?) where id=${req.body.id}`
        // connection.execute(insertUserQuery,[req.body.name,req.body.email],(err,result)=>{
        //     if(err){
        //         console.log("update Error",err);
        //         res.status(500).json({error:"Database error"});
        //     }else{
        //         console.log("update result",result);
        //         res.status(201).json({message:"user updated",
        //             userInfo:{
        //                 id:req.body.id,
        //                 name:req.body.name,
        //                 email:req.body.email
        //             }
        //         });
        //     }
        // })

        try{
            const updatedUserInfo =await dbObj.User.update(
    { name: req.body.name,
        email:req.body.email
     },
    { where: { id: req.body.id } }
   

) ;
 console.log("updatesUserInfo",updatedUserInfo);
 res.status(200).json({message:"User updated"});
}catch(err){
    console.log(err);
    res.status(500).json({error:"Database error"});
}

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

export default {insertUser,updateUser,deleteUser, getUsers};


//Remember the difference between parseInt() and Number();

//Remember that all CRUD operations using sequelize are async and they return a promise



//Updating using sequelize based on or condition
// await User.update(
//     { name: "Updated Name" },
//     {
//         where: {
//             [Op.or]: [
//                 { id: 1 },
//                 { email: "test@gmail.com" }
//             ]
//         }
//     }
// );
//For and condition, use Op.and


//const user = await User.findByPk(1);Finds by primary key 1


// const deletedRows = await User.destroy({
        //     where: { id: req.params.id }
        // }); deletetion

// const user = await User.findOne({
//     where: {
//         name: "Alice",
//         email: "alice1@example.com"
//     }
// }); Finds the first record where the condition matches.

// const users = await User.findAll({
//     where: {
//         email: "bob@example.com"
//     }
// }); finds all the rows where condition is matched.



//Bulk insert using sequelize
// const users = await User.bulkCreate([
//     {
//         name: "Alice",
//         email: "alice@gmail.com"
//     },
//     {
//         name: "Bob",
//         email: "bob@gmail.com"
//     },
//     {
//         name: "Charlie",
//         email: "charlie@gmail.com"
//     }
// ]);


//Person.hasOne(Passport, { foreignKey: "person_id" });

//Person.findByPk(1, { include: Passport })?
//returns the left outer join:Person left join Passport
//By default, Sequelize assumes that this foreign key references the primary key of the source model, which is normally Person.id.


// const users = await User.findAll({
//     raw: true
// });
//Returns raw objects