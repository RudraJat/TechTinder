const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validate");

//get cookies
//yha userAuth middleware phle call hoga or agar authentication ho gyi to hi aage profile wala code chalega
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //fetching user from database
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error readin cookies. " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    //saving updated user to database
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile is updated successfully!`,
      data: loggedInUser
  });
  } catch (err) {
    res.status(400).send("Error editing profile. " + err.message);
  }
});

module.exports = profileRouter;
