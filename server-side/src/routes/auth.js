const express = require("express");
const authRouter= express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/userSchema.js");
const { validateSignupData } = require("../utils/validate.js");
const jwt = require("jsonwebtoken");
const {OAuth2Client}= require("google-auth-library");


//SIGNUP api- POST /signup - create a new user
authRouter.post("/signup", async (req, res) => {
  //validating signup data
  try {
    validateSignupData(req);

    // Encrypt the password before saving to database
    const { firstName, lastName, email, password, skills, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt rounds- the higher the rounds, the more secure but slower
   
    //Creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      skills,
      role,
    });


    await user.save();
    res.json({data: user, "message": "User signed up successfully!"});
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    res.json({data:user,"message": "User logging in successfully!"});
  } catch (err) {
    res.status(400).json({"error": "Error logging in user." + err.message});
  }
});

//GOOGLE LOGIN api- POST /google-login - login/signup a user with Google
authRouter.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      throw new Error("Google credential is required");
    }

    // Initialize OAuth2Client with your Google Client ID
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name, picture } = payload;

    // Check if user already exists with this Google ID or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firstName: given_name || "User",
        lastName: family_name || "",
        email,
        googleId,
        photoUrl: picture || undefined,
      });
      await user.save();
    } else if (!user.googleId) {
      // Update existing user with Google ID if they signed up with email/password
      user.googleId = googleId;
      if (picture && !user.photoUrl) {
        user.photoUrl = picture;
      }
      await user.save();
    }

    // Generate JWT token
    const token = await user.getJWT();

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    res.json({ data: user, message: "User logged in successfully with Google!" });
  } catch (err) {
    res.status(400).json({ error: "Error with Google login: " + err.message });
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
    