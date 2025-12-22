const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");

//api to get pending connection requests for logged in user
userRouter.get("/user/request", userAuth, async(req,res)=>{ 
    try{

    }catch(err){
        res.status(400).send("Error fetching pending requests "+err.message);
    }
})

module.exports = userRouter;