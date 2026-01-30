const express = require("express");
const userAuth = require("../middlewares/auth.js");
const {
  validateEditProfileData,
  validatePassword,
} = require("../utils/validate");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();
//get cookies
//yha userAuth middleware phle call hoga or agar authentication ho gyi to hi aage profile wala code chalega
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //fetching user from database
    const user = req.user;
    res.json({"data": user});
  } catch (err) {
    res.status(400).json({"error": "Error readin cookies. " + err.message});
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
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({"error": "Error editing profile. " + err.message});
  }
});

profileRouter.patch("/profile/passwordChange", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!validatePassword(req)) {
      throw new Error("Invalid password change request");
    }

    const { newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedNewPassword;

    await loggedInUser.save();

    res.json({
      message: "Password changed successfully!",
    });
  } catch (err) {
    res.status(400).json({"error": "Error changing password. " + err.message});
  }
});

module.exports = profileRouter;
