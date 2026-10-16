const express = require("express");

const app = express();

app.get("/:username",(req,res)=>{
    console.log(req.query)
    res.json({username:req.params.username,role:req.query.role});
})

app.listen(3000);
