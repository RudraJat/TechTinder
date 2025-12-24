const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
//api to get pending connection requests for logged in user
userRouter.get("/user/request/received", userAuth, async(req,res)=>{ 
    try{
        const loggedInUser= req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender bio skills"); //populate to get user details of fromUserId
        res.json({
            message: "Received connection requests fetched successfully",
            data: connectionRequests
        });
    }catch(err){
        res.status(400).send("Error fetching pending requests "+err.message);
    }
})

module.exports = userRouter;