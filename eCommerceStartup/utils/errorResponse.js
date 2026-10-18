const errorResponse = (res,err)=>{
    res.status(err.status).send(err.message);
}

export default {errorResponse};