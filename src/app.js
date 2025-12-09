const express = require('express');
const connectDB = require('./config/database.js');
const User = require('./model/user.js');

const app = express();

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

app.post("/signup", async(req, res)=>{
    //Creating a new instance of User model
    const users = new User(req.body);

    try{
        await users.save();
        res.send("User signed up successfully!");
    }catch(err){
        res.status(201).send("Error signing up user."+err.message);
    }
});

//GET USER BY EMAIL
app.get("/user", async(req, res)=>{
    const userEmail = req.body.email;

    try{
        const user = await User.findOne({email: userEmail});
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(500).send("Error retrieving user. "+err.message);
    }
})

//FEED api- GET /feed - get all users from the database
app.get("/feed", async(req, res)=>{

    try{
        const users = await User.find({});
        if(!users){
            res.status(404).send("No users found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(500).send("Error retrieving users. "+err.message);
    }
})

//DELETE user by id
app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;

    try{
        const deleteUser = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully!");
    }catch(err){
        res.status(500).send("Error deleting user. "+err.message);
    }
})

connectDB()
    .then(()=>{
        console.log("Database connected successfully!");
        app.listen(1111, () => {
            console.log("Server is listening on port 1111");    
        });
    })
    .catch((err)=>{
        console.log("Database connection failed!", err);
    });



