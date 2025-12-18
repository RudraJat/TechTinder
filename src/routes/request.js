const express=require("express");
const requestRouter= express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../model/connectionRequest.js");

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