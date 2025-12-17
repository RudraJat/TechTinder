const express=require("express");
const requestRouter= express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../model/connectionRequest.js");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    //from user to phle se hi logged in hoga
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

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