import dbObj from "../utils/db.js";

const bookBus = async (req,res)=>{
    try{
        const user = await dbObj.User.findByPk(req.body.id);
        const booking = await user.createBooking();
        const bus = await dbObj.Bus.findByPk(req.body.bus_id);
        await booking.setBus(bus);

        res.status(201).json({message:"Booking made"});

    }catch(err){
        res.status(500).json({error:err.message});
    }
}

const getBookings = async (req,res)=>{
    try{
         const user = await dbObj.User.findByPk(req.params.id);
         const bookings = await dbObj.Booking.findAll({include:dbObj.User});
         res.status(200).json({bookings})
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

export default {bookBus,getBookings};