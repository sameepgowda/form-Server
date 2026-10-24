import dbObj from "./expenseDb.js";

const addExpense = async (req,res)=>{
    if(req.body.amount && req.body.description && req.body.category){
            try{
                        const createdId = await dbObj.Expense.create({
                amount:req.body.amount,
                description:req.body.description,
                category:req.body.category
            })
            console.log("CreatedID with Sequelize:",createdId);
            res.status(201).json({message:'Expense added',
                expenseInfo:{
                    id:createdId.dataValues.id,
                    amount:req.body.amount,
                description:req.body.description,
                category:req.body.category
                }
            })
        }catch(err){
            res.status(500).json({Error:err.message});
        }
         
        }else{
            res.status(400).json({error:'Bad request'});
        }
}

const getExpenses = async (req,res)=>{
    try{
        const expenses = await dbObj.Expense.findAll();
        res.status(200).json({expenses})
    }catch(err){
        res.status(500).json({Error:err.message})
    }
}

const deleteExpense = async (req,res)=>{
    try{
        await dbObj.Expense.destroy({where:{
            id:req.params.id
        }})
        res.status(200).json({message:"Expense successfully deleted"});
    }catch(err){
        res.status(500).json({Error:err.message})
    }
}

export default {addExpense,getExpenses, deleteExpense}