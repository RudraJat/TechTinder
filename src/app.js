const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database.js");
const User = require("./model/user.js");
const { validateSignupData } = require("./utils/validate.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

//creating an express app
const app = express();

//using cookie parser middleware
app.use(cookieParser());
//creating api for metadata
// app.post("/signup", async(req, res)=>{
//     const users = new User({
//         firstName: "Rudra",
//         lastName: "Pratap Singh",
//         email: "rudra@example.com",
//         password: "password123",
//     });

//     try{
//         await users.save();
//         res.send("User signed up successfully!");
//     }catch(err){
//         res.status(201).send("Error signing up user."+err.message);
//     }
// });

//parsing json data from request bodY
app.use(express.json());

//SIGNUP api- POST /signup - create a new user
app.post("/signup", async (req, res) => {
  //validating signup data
  try {
    validateSignupData(req);

    // Encrypt the password before saving to database
    const { firstName, lastName, email, password, skills } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt rounds- the higher the rounds, the more secure but slower
    console.log("Hashed Password:", hashedPassword);
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
    res.status(400).send("Error signing up user." + err.message);
  }
});

//LOGIN api- POST /login - login a user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    //JWT token generation --- we are hiding user id in the token and secret key is only known to the server
    const token = await jwt.sign({ _id: user._id }, "RudraSecretKey", {
      expiresIn: "7d",
    });

    //COOKIE set
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });

    res.send("User logging in successfully!");
  } catch (err) {
    res.status(400).send("Error logging in user." + err.message);
  }
});

//get cookies
//yha userAuth middleware phle call hoga or agar authentication ho gyi to hi aage profile wala code chalega
app.get("/profile", userAuth, async (req, res) => {
  try {
    //fetching user from database
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error readin cookies. " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Connection request is sent");
    res.send(user.firstName + ", sent the connection request");
  } catch (err) {
    res.status(400).send("Error sending connection request. " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(1111, () => {
      console.log("Server is listening on port 1111");
    });
  })
  .catch((err) => {
    console.log("Database connection failed!", err);
  });
