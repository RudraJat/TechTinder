const express = require("express");
const authRouter= express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/userSchema.js");
const { validateSignupData } = require("../utils/validate.js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
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
    
    //JWT token generation after signup
    const token = await user.getJWT();

    //COOKIE set
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    
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

//LINKEDIN SSO
//STEP-1: REDIRECT USER TO LINKEDIN LOGIN PAGE
authRouter.get("/linkedin",(req,res)=>{
  const redirectUri = encodeURIComponent( //it makes the uri encoded so it can be sent inside a URL- converts unsafe characters into a safe encoded format
    "http://localhost:1111/linkedin/callback"
  );
  console.log("Redirect URI:", redirectUri);
  const linkedInURL =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    "&scope=r_liteprofile%20r_emailaddress";
  
  res.redirect(linkedInURL);
});

//STEP-2: Linkedin Callback
authRouter.get("/linkedin/callback", async(req,res)=>{
  try{
    const {code}=req.query;

    //Exchange CODE for ACCESS TOKEN
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params:{
          grant_type: "authorization_code",
          code,
          redirect_uri: "http://localhost:1111/linkedin/callback",
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    //GET  Linkedin Profile
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/me",
      {
        headers:{
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    //GET Email Address
    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers:{
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const email = emailResponse.data.elements[0]["handle~"].emailAddress;

    const name = profileResponse.data.localizedFirstName + 
    " "+
    profileResponse.data.localizedLastName;

    const linkedin= profileResponse.data.id;

    //Find or Create User
    let user = await User.findOne({email});

    if(!user) {
      user = await User.create({
        name,
        email,
        linkedinId,
      });
    }

    //Generate JWT
    const jwtToken = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    //Redirect to Frontend with JWT
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${jwtToken}`
    );
  }catch(err){
    console.error("LinkedIn auth error: ",err);
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=linkedin`
    );
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
    