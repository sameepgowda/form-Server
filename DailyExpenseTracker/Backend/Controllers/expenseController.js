import { ExpenseData, DailyBalance } from "../../Database/index.js";
import {sequelize} from "../../Database/db.js";
import { Op, literal , fn, col, QueryTypes } from "sequelize";

const addExpense = async (req,res)=>{
        let {UserId, date, expenseName, expenseAmount, description} = req.body;
        expenseAmount=Number(expenseAmount);
        if(UserId && date && expenseAmount){
            const transaction = await sequelize.transaction();
            try{
                const expenseId = await ExpenseData.create({UserId, date, expenseName, expenseAmount, description},
                    {transaction}
                );

                const todaysBalanceData = await DailyBalance.findOne({where:{
                    UserId:UserId,date:date
                }, transaction});
                if(!todaysBalanceData){
                const prevBalanceData = await DailyBalance.findAll({where:{UserId:UserId,date:{
                        [Op.lt]:date
                    }},order:[["date","desc"]],raw:true,transaction})
                    console.log(prevBalanceData);
                if(prevBalanceData.length>0){
                       const balance =  Number(prevBalanceData[0].closingBalance)+expenseAmount;
                await DailyBalance.create({UserId,date,closingBalance:balance}, {transaction})
                    }else{
                        await DailyBalance.create({UserId,date,closingBalance:expenseAmount},{transaction})
                    }
                        
                }else{
                    await DailyBalance.update({closingBalance:literal(`closingBalance + ${expenseAmount}`)},
                {transaction,
                    where:{
                    UserId:UserId,
                    date:date
                }})
                }
            

               const balanceData = await DailyBalance.findAll({where:{date:{[Op.gt]:date},UserId:UserId}, raw:true,transaction});

                if(balanceData.length>0){
                    await DailyBalance.update(
                        {closingBalance:literal(`closingBalance + ${expenseAmount}`)},
                        {transaction,
                            where:{
                            UserId:UserId,
                            date:{
                                [Op.gt]:date
                            }
                        }}
                    )
                }

                await transaction.commit();
                res.status(201).json({message:"Expense added successfully",
                    expenseInfo:{
                        expenseId : expenseId.dataValues.id,
                        UserId,
                        date,
                        expenseName,
                        expenseAmount,
                        description
                    }
                })
            }catch(err){
                await transaction.rollback();
                res.status(500).json({error:err.message});
                console.log(err);
            }
        }else{
            return res.status(400).json({message:"Bad request"});
        }

}

const getDailyBalance = async (req,res)=>{
    if(req.body.UserId && req.body.date){
        try{
            const {UserId,date} = req.body;
            let openingBalance = 0;
            let totalIncome = 0;
            let totalExpense = 0;
        const [openingBalanceData] = await DailyBalance.findAll({where:{
            UserId:UserId,date:{[Op.lt]:date}
        },order:[["date","desc"]],raw:true});
        console.log(openingBalanceData);

        if(openingBalanceData){
            openingBalance = openingBalanceData.closingBalance;
        };

        const balanceData = await DailyBalance.findOne({where:{UserId:UserId,date:date}});
        if(balanceData){

        const incomeData = await ExpenseData.findAll({where:{
            UserId:UserId,date:date,expenseAmount:{[Op.gt]:0}
        },raw:true});
        if(incomeData.length>0){
            totalIncome = incomeData.reduce((accum,obj)=>{
                return accum + Number(obj.expenseAmount)
            },0);
        }
        
        const expenseData = await ExpenseData.findAll({where:{UserId:UserId,date:date,expenseAmount:{
            [Op.lt]:0
        }},raw:true});

        if(expenseData.length>0){
            totalExpense = expenseData.reduce((accum,obj)=>{
                return accum + Number(obj.expenseAmount)
            },0);
        }

        res.status(200).json({openingBalance,closingBalance:balanceData.closingBalance,totalIncome,
            totalExpense, incomeData,expenseData
            })
        }else{
             res.status(200).json({openingBalance,closingBalance:openingBalance,totalIncome,totalExpense,
                incomeData:null,expenseData:null
            })
        }
        }catch(err){
            res.status(500).json({error:err.message});
            console.log(err);
            
        }
    }else{
        return res.status(400).json({message:"Bad request"});
    }
}

const deleteExpense = async (req,res)=>{
    if(req.body.id && req.body.UserId && req.body.expenseAmount && req.body.date){
        let {id, UserId, expenseAmount, date, expenseName} = req.body;
        expenseAmount = Number(expenseAmount);
        const t3 = await sequelize.transaction();
        try{
            const deleteData = await ExpenseData.destroy({where:{id,UserId},
            transaction:t3});
            console.log("deleteData",deleteData);
            if(deleteData>0){
            await DailyBalance.update({closingBalance:literal(`closingBalance -${expenseAmount}`)},
        {where:{
            UserId,date:{[Op.gte]:date}}
        , transaction:t3});
            }

        await t3.commit();
        res.status(200).json({message:"Expense successfully deleted",
            expenseInfo:{UserId,expenseId:id,expenseName}
        })

        }catch(err){
            await t3.rollback();
            console.log(err);
            res.status(500).json({error:err.message});
        }
    }else{
        res.status(400).json({message:"Bad Request"});
    }
}

const bulkDeleteExpense = async (req, res)=>{
    if(req.body.UserId && req.body.date && req.body.totalCreditOfTheDay && req.body.totalDebitOfTheDay){
        let {UserId, date, totalCreditOfTheDay, totalDebitOfTheDay } = req.body;
        totalCreditOfTheDay =Number(totalCreditOfTheDay);
        totalDebitOfTheDay = Number(totalDebitOfTheDay);
        const t4 = await sequelize.transaction();
        try{
                const deleteData = await ExpenseData.destroy({where:{UserId,date},transaction:t4});
                if(deleteData>0){
                    await DailyBalance.update({closingBalance:literal(`closingbalance - ${totalCreditOfTheDay} - ${totalDebitOfTheDay}`)},
                {where:{UserId,date:{[Op.gte]:date}},transaction:t4})
                };
                await DailyBalance.destroy({where:{UserId,date},transaction:t4});
                await t4.commit();
                res.status(200).json({message:"Deletion successful"});
        }catch(err){
            await t4.rollback();
            res.status(500).json({error:err.message});
        }

    }else{
        res.status(400).json({message:"Bad Request"});
    }
}

const getMonthlyReport = async (req,res)=>{
    let {month,year,UserId} = req.body;
    if(month && year && UserId){
        try{
        // let t2 = sequelize.transaction();
        let dailyExpenses = [];
        let totalMonthlyBalance = 0;
        let totalMonthlyIncome = 0;
        let totalMonthlyExpense = 0;
        month = Number(month);
        year = Number(year);
        let startDate = "";
        let endDate = "";
        startDate = `${year}-${String(month).padStart(2,"0")}-01`;
        if(month<12){
            endDate = `${year}-${String(month+1).padStart(2,"0")}-01`
        }else{
            endDate = `${year+1}-01-01`
        }
        const monthlyExpenseData = await ExpenseData.findAll({where:{
            UserId,
            date:{
                [Op.gte]:startDate,
                [Op.lt]:endDate
            }
        },
    order:[["date","desc"],["id","asc"]],raw:true});

    if(monthlyExpenseData.length>0){
            totalMonthlyIncome = monthlyExpenseData.reduce((accum,obj)=>{
                if(obj.expenseAmount>0){
                    
                return accum + Number(obj.expenseAmount)
                }else{
                    return accum
                }
            },0);

            totalMonthlyExpense = monthlyExpenseData.reduce((accum,obj)=>{
                if(obj.expenseAmount<0){
                    
                return accum + Number(obj.expenseAmount)
                }else{
                    return accum
                }
            },0);

            const [monthlyBalanceData] = await DailyBalance.findAll({where:{
                UserId,
                date:{[Op.gte]:startDate,[Op.lt]:endDate}
            },order:[["date","desc"]],raw:true})

            totalMonthlyBalance = monthlyBalanceData.closingBalance;

            
            let currDate = startDate;
            while(currDate<endDate) {
                const filteredData = monthlyExpenseData.filter((obj)=>obj.date==currDate);
                // console.log("i",dailyExpenses);
                let totalCreditOfTheDay = 0;
                let totalDebitOfTheDay = 0;              
                let dailyExpensesObj = {};
                if(filteredData.length>0){
                
                totalCreditOfTheDay = filteredData.reduce((accum,obj)=>{
                if(obj.expenseAmount>0){
                    
                return accum + Number(obj.expenseAmount)
                }else{
                    return accum
                }
            },0);

            totalDebitOfTheDay = filteredData.reduce((accum,obj)=>{
                if(obj.expenseAmount<0){
                    
                return accum + Number(obj.expenseAmount)
                }else{
                    return accum
                }
            },0);

            
                {dailyExpensesObj[currDate] = {totalCreditOfTheDay,totalDebitOfTheDay,
                    ExpenseInfo:filteredData};
                    
                dailyExpenses.push(dailyExpensesObj);
                }
            }
                
                let dateObj = new Date(currDate);
                dateObj.setDate(dateObj.getDate() + 1);
                let dateStr = dateObj.toISOString().slice(0, 10);
                currDate = dateStr;
                // console.log(currDate);
            } 
            
            dailyExpenses.sort((a,b)=>{
                console.log(a)
                let dateA = Object.keys(a)[0];
                let dateB = Object.keys(b)[0];

                return new Date(dateB) - new Date(dateA);
            })
           
        
    }else{
        const balanceData = await DailyBalance.findAll({where:{
            UserId,
            date:{
                [Op.lt]:startDate
            }
        },raw:true,order:[["date","desc"]]});
        if(balanceData.length>0){

            totalMonthlyBalance = balanceData[0].closingBalance;
        }
    }

    const responseObj = {
        UserId,totalMonthlyIncome,totalMonthlyExpense,totalMonthlyBalance, dailyExpenses
       }
    res.status(200).json(responseObj);

      }catch(err){
        // await t2.rollback();
        res.status(500).json({"error":err.message});
        console.log(err);
    }

    }else{
        
        res.status(400).json({message:"bad request"});
    }
}

const getYearlyReport = async (req,res)=>{
    if(req.body.UserId && req.body.year){
        
        try{
            const {UserId,year} = req.body;
        const startDate = `${String(req.body.year)}-01-01`;
        const endDate = `${String(req.body.year)}-12-31`;
    

    const monthlyExpense = await ExpenseData.findAll({attributes:[[fn("MONTH",col("date")),"month"],[fn("SUM", col("expenseAmount") ),"totalExpense"]],
   
where:{UserId,date:{[Op.gte]:startDate,[Op.lt]:endDate},expenseAmount:{[Op.lt]:0}},group:[fn("MONTH",col("date"))],order:[[fn("MONTH",col("date")),"desc"]],raw:true});

  const monthlyCredit = await ExpenseData.findAll({attributes:[[fn("MONTH",col("date")),"month"],[fn("SUM", col("expenseAmount") ),"totalCredit"]],
   
where:{UserId,date:{[Op.gte]:startDate,[Op.lt]:endDate},expenseAmount:{[Op.gt]:0}},group:[fn("MONTH",col("date"))],order:[[fn("MONTH",col("date")),"desc"]],raw:true});
//   console.log(monthlyExpenses);
const monthlyBalances = await sequelize.query(`
    SELECT month, closingBalance
    FROM (
        SELECT
            MONTH(date) AS month,
            date,
            closingBalance,
            ROW_NUMBER() OVER (
                PARTITION BY YEAR(date), MONTH(date)
                ORDER BY date DESC
            ) AS rn
        FROM DailyBalance
        WHERE UserId = :UserId
          AND date >= :startDate
          AND date < :endDate
    ) AS monthly
    WHERE rn = 1
    ORDER BY month DESC
`, {
    replacements: { UserId, startDate, endDate },
    type: QueryTypes.SELECT
});

console.log("mothlyBalance",monthlyBalances);
let responseArr = [];
if(monthlyBalances.length>0){
    responseArr = monthlyBalances.map((obj)=>{
        const expense = monthlyExpense.find(x=>x.month==obj.month)||{totalExpense:0};
        const credit = monthlyCredit.find(x=>x.month==obj.month)||{totalCredit:0};
        return{...obj,totalExpense:expense.totalExpense,totalCredit:credit.totalCredit}
    })
}

res.status(200).json({monthlyReport:responseArr})



}catch(err){
    res.status(500).json({error:err.message});
    console.log(err);
  }

 }else{

 }


}

export default {addExpense,getDailyBalance, getMonthlyReport, deleteExpense, bulkDeleteExpense, getYearlyReport};