const express = require("express");
const authRouter= express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const { validateSignupData } = require("../utils/validate.js");

//SIGNUP api- POST /signup - create a new user
authRouter.post("/signup", async (req, res) => {
  //validating signup data
  try {
    validateSignupData(req);

    // Encrypt the password before saving to database
    const { firstName, lastName, email, password, skills } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt rounds- the higher the rounds, the more secure but slower
   
    //Creating a new instance of User model
    const users = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      skills,
    });

    await users.save();
    res.send("User signed up successfully!");
  } catch (err) {
    res.status(400).json({"error":"Error signing up user." + err.message});
  }
});


//LOGIN api- POST /login - login a user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    //JWT token generation --- we are hiding user id in the token and secret key is only known to the server
    const token = await user.getJWT();

    //COOKIE set
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });

    res.json({"message": "User logging in successfully!"});
  } catch (err) {
    res.status(400).json({"error": "Error logging in user." + err.message});
  }
});

//LOGOUT api- POST /logout - logout a user
authRouter.post("/logout", async(req, res)=>{
    //setting the token cookie to null or expired
    // res.cookie("token", null, {
    //     expires: new Date(Date.now())
    // });

    res.clearCookie("token");
    
    res.json({"message": "User logged out successfully!!!"});
});

module.exports = authRouter;
    