const express=require("express");
const requestRouter= express.Router();
const { userAuth } = require("./middlewares/auth.js");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Connection request is sent");
    res.send(user.firstName + ", sent the connection request");
  } catch (err) {
    res.status(400).send("Error sending connection request. " + err.message);
  }
});

module.exports = requestRouter;