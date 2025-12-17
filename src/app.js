const express = require("express");

const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//creating an express app
const app = express();

//using cookie parser middleware
app.use(cookieParser());
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
app.use(express.json());


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
