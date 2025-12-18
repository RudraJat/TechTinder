const express=require("express");
const requestRouter= express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../model/connectionRequest.js");
const User = require("../model/user.js");

//iss api me status sirf intersted or ignored ho skta he
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    //from user to phle se hi logged in hoga
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //validating status
    const isAllowedStatus = ["interested", "ignored"];
    if(!isAllowedStatus.includes(status)){
      return res.status(400).json({message: "Invalid status type: "+status});
    }

    //preventing user from sending request to self
    if(fromUserId.toString() === toUserId){  //without toString() it'll compare this ObjectId("507f1f77bcf86cd799439011") === "507f1f77bcf86cd799439011"
      return res.status(400).json({message: "You can't send connection request to yourself."})
    }
    
    //checking if a request already exists between the two users
    const existingRequest = await ConnectionRequest.findOne({
      //$or operator is used for checking multiple conditions in mongoose
      //phle hum check kar he ki agar A ne B ko req bhji hai to vo firse nhi bhj skta
      //dusra hum check kar he ki agar B ne A ko req bhji hai to vo bhi firse nhi bhj skta
      $or:[
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId}
      ]
    });
    if(existingRequest){
      return res.status(400).json({message: "A connection request already exists between these users."});
    }

    //checking if the toUserId exists in database
    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(400).json({message: "The user you are trying to connect to does not exist."});
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    res.json({
      message: "Connection request sent successfully!!!",
      data
    })
  } catch (err) {
    res.status(400).send("Error sending connection request. " + err.message);
  }
});

module.exports = requestRouter;