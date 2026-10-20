import express from "express";
import userRouter from "../routes/userRoute.js";

const app = express();

app.use(express.json());

console.log("ROUTER TYPE",typeof userRouter.router);

app.use("/",userRouter.router);

app.use((req,res)=>{
    res.status(404).type("text").send("Page not found");
})


app.listen(3000);


//
// app.get("/users", async (req, res, next) => {
//     try {
//         throw new Error("Database connection failed");
//     } catch (err) {
//         next(err);
//     }
// });

// app.use((err, req, res, next) => {
//     console.error(err.message);

//     res.status(500).json({
//         message: "Something went wrong"
//     });
// });
//

// next() moves to the next normal middleware, 
// while next(err) signals an error and moves to error-handling middleware.