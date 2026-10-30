import cashFreeService from "../Services/cashFreeService.js";



const createPaymentOrder = async (req,res)=>{
    if(req.UserId){
        try{
            console.log("3. Entered try block");

        const request = cashFreeService.request;

        request["customer_details"]["customer_id"] = String(req.UserId);

        console.log("4. Request prepared");

        const orderInfo = await cashFreeService.cashfree.PGCreateOrder(request);

        // console.log("5. Cashfree response:", orderInfo);

        res.status(201).json({message:"Payment order created",
            paymentSessionId: orderInfo.data.payment_session_id,
    orderId: orderInfo.data.order_id
        });
        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message})
        }
        
    }else{
        res.status(400).json({message:"bad request"});
    }
}

const verifyPayment = async (req,res)=>{
    if(!req.UserId || !req.body.order_id){
        return res.status(400).json({message:"User ID or order ID missing"})
    }
    try{
        const orderInfo = await cashFreeService.cashfree.PGFetchOrder(req.body.order_id);
        // console.log("Payment verification Info", orderInfo);
        if(orderInfo.status==200){
             res.status(200).json({message:"payment successful"});
        }else{
            res.staus(500).json({message:"payment failed"});
        }
       
    }catch(err){
        console.log(err);
        res.status(500).json({error:err.message});
    }
}

export default {createPaymentOrder, verifyPayment};