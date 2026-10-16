import express from "express";
import cors from "cors";

// require("dotenv").config();

const app = express();


app.use(cors({
    origin: "http://localhost:5173"
}));

// app.use(express.urlencoded({ extended: false }));
// console.log(process.env.PORT);


app.use(express.json()); //This line automatically parses incoming request and makes it available as a parsed object through req.body


app.use("/users",(req, res, next) => {  //sets middleware only for route /users.
  // console.log(req.method, req.url);  //Common Middleware
  req.body["discount"]=10;
  next();
});

app.use((err, req, res, next) => {   //error handling middleware
  console.error(err.message);

  res.status(500).json({
    message: "Something went wrong"
  });
});  



function checkLogin(req, res, next) {  //middleware function
  console.log(req.url);
  next();
}

app.get("/", checkLogin, (req,res)=>{
  console.log(req.body);
    res.status(200).json({greeting:"Hi there"});
});


app.listen(3000);

//req.body,req.query,req.params

app.post("/post",(req,res)=>{
    console.log("req.body",req.body);

    res.set({     //Sets headers
  "X-App-Name": "MyExpressApp",
  "X-API-Version": "1.0"
});

// const userAgent = req.get("User-Agent"); Reading request headers

    res.status(201).json({name:"Manogna"});
})
//If the request body comes in chunks, express automatically combines it and parses it
//ans makes it avaiable at req.body


//app.get("/user/:id/:name",(req,res)=>{}) here req.params={id:id,name:name}


//If you are using express and axios, you don't need to strigify data before communcation.
//



//Error handling
app.get("/test", (req, res, next) => {
  next(new Error("Test failed"));    //Here,next passes the error to the error handling middleware

});

app.use((err, req, res, next) => {    //If use has 4 parameters it makes it an error handler
  res.status(500).send("Error handled");
});//





// //Multiple middleware functions
// function checkLogin(req, res, next) {
//   console.log("Checking login...");
//   next();
// }

// function validateProfile(req, res, next) {
//   console.log("Validating profile...");
//   next();
// }

// app.patch(
//   "/profile",
//   checkLogin,
//   validateProfile,
//   (req, res) => {
//     res.send("Profile updated");
//   }
// );
//



//
app.use("/static", express.static("public"));  
//This makes all files present in public folder avaialble at https:localhost/3000/static.
//The front end can also send a get request to this url and access it
//<img src="http://localhost:3000/static/images/cat.png" alt="Cat">//
//





//Routes
// const express = require("express");
// const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("All users");
// });

// router.get("/:id", (req, res) => {
//   res.send(`User ID: ${req.params.id}`);
// });

// router.post("/", (req, res) => {
//   res.send("User created");
// });

// module.exports = router;




// const express = require("express");
// const app2 = express();

// const userRoutes = require("./userRoutes");

// app2.use("/users", userRoutes);
