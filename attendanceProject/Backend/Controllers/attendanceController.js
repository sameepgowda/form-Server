import dbObj from "../Database/db.js";


const getAttendanceStatus = async (req,res)=>{
    if(req.body.date){
 try{
           const attendaceStatus = await dbObj.AttendanceStatus.findAll({
            where:{
                date:req.body.date
            },
            raw:true
           });
           if(attendaceStatus[0].attenanceMarked){
            const attendanceData = await dbObj.AttendanceData.findAll({
                where:{
                    date:req.body.date
                }
            })
            res.status(200).json({attendaceStatus:true,
                attendanceData
            })
           }else{
            res.status(200).json({attendaceStatus:false})
           }
           
       }catch(err){
           res.status(500).json({Error:err.message});
       }
    }else{
        res.status(400).json({error:'Bad request'});
    }
  
}

const markAttendance = async (req,res)=>{
    if(req.body.date && req.body.attendanceData){
        try{
         
            await dbObj.attendaceStatus.create({date:req.body.date,attenanceMarked:true});
            for(let obj of req.body.attendanceData){
                   const { student_id,student_name,date,attendance}= obj;
                await dbObj.attendanceData.create({student_id,student_name,date,attendance});
            }
            res.status(200).json({message:"Attendance marked"});
        }catch(err){
            res.status(500).json({error:err.message});
        }
        
    }else{
        res.status(400).json({message:"Bad request"});
    }
}


const getAttendanceReport = async (req,res)=>{

    try{
 const attendaceStatus = await dbObj.AttendanceStatus.findAll({raw:true});
 const totalDays = attendaceStatus.length;

const attendanceReport = await Booking.findAll({
    attributes: [
        "student_id",
        "student_name",
        [fn("COUNT", col("id")), "numberOfDaysAttended"]
    ],
    where: {
        atendance: true
    },
    group: ["student_id"],
    raw: true
});
res.status(200).json({totaldays, attendanceReport})
    }catch(err){
        res.status(500).json({error:err.message})
    }
    
}

export default {getAttendanceReport,getAttendanceStatus,markAttendance};