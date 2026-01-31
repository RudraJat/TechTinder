require("dotenv").config({ path: "../../.env" });
const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

//creating an express app
const app = express();

//using CORS middleware to allow requests from frontend server
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

//using cookie parser middleware
app.use(cookieParser());
app.use(express.json());

//using auth router middleware
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//creating api for metadata
// app.post("/signup", async(req, res)=>{
//     const users = new User({
//         firstName: "Rudra",
//         lastName: "Pratap Singh",
//         email: "rudra@example.com",
//         password: "password123",
//     });

//     try{
//         await users.save();
//         res.send("User signed up successfully!");
//     }catch(err){
//         res.status(201).send("Error signing up user."+err.message);
//     }
// });

//parsing json data from request bodY

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(1111, () => {
      console.log("Server is listening on port 1111");
    });
  })
  .catch((err) => {
    console.log("Database connection failed!", err);
  });
