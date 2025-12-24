const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");

const USER_SAFE_DATA =  "firstName lastName photoUrl age gender bio skills";

//api to get pending connection requests for logged in user
userRouter.get("/user/request/received", userAuth, async(req,res)=>{ 
    try{
        const loggedInUser= req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA); //populate to get user details of fromUserId
        res.json({
            message: "Received connection requests fetched successfully",
            data: connectionRequests
        });
    }catch(err){
        res.status(400).send("Error fetching pending requests "+err.message);
    }
})

userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser =req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                //agar Kalpit ne rudra ko request bheji or kalpit ko kanak ne request or accept kiya h to dono ko connection milega
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);   //populate to get user details of fromUserId and toUserId

        //agar fromUserId loggedInUser ke barabar h to toUserId return kar do warna fromUserId return kar do
        //kyoki hume loggeInUser ki information nhi chahiye
        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        } );
        res.json({data});

    }catch(err){
        res.status(400).send("Error fetching connections "+err.message);
    }
})
module.exports = userRouter;