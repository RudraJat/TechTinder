const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

//get cookies
//yha userAuth middleware phle call hoga or agar authentication ho gyi to hi aage profile wala code chalega
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    //fetching user from database
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error readin cookies. " + err.message);
  }
});

module.exports = profileRouter;