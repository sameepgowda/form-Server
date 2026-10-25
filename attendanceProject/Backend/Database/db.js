import { Sequelize,DataTypes } from "sequelize";

const sequelize = new Sequelize('attendance_db','root','Redblack$1$',{
    host:'localhost',
    dialect:'mysql',
    port:3306
});

const testSequelizeConnection = async ()=>{
    try{  await sequelize.authenticate(); //This function returns a resolved promise with udefined on successful authentication or a rejected promise if authentication fails.
    }catch(err){
        console.log("Database authentication error:",err);
    }
}

testSequelizeConnection();

const AttendanceStatus = sequelize.define("AttendenceStatus",{
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        unique:true

    },
    attendanceMarked:{
        type:DataTypes.BOOLEAN,
        allowNull:false
},

},
{
    tableName:"AttendanceStatus"
}
    
) 

const Student = sequelize.define("Student",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
})


const AttendanceData = sequelize.define("AttendanceData",{
    student_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    student_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    attendance:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
},
{
    tableName:"AttendanceData"
})

// const AttendanceReport = sequelize.define("AttendanceReport",{
//     student_id:{
//         type:DataTypes.INTEGER,
//         allowNull:false

//     },
//     daysAttended:{
//         type:DataTypes.INTEGER,
//         allowNull:false
        
//     }

// },
// {tableName:"AttendanceReport"});


Student.hasMany(AttendanceData,{
    foreignKey:"student_id"
});
AttendanceData.belongsTo(Student);

await sequelize.sync();

export default {Student,AttendanceData,AttendanceStatus};

