const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database.js");
const User = require("./model/user.js");
const { validateSignupData } = require("./utils/validate.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
app.post("/login", async(req,res)=>{
  try{
    const {email, password} = req.body;
    
    const user = await User.findOne({email})
    if(!user){
      throw new Error("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      
      throw new Error("Invalid password");                                        
    }

    //JWT token generation --- we are hiding user id in the token and secret key is only known to the server
    const token = await jwt.sign({_id: user._id}, "RudraSecretKey");
    
    //COOKIE set 
    res.cookie("token", token);
    
    res.send("User logging in successfully!");
  }catch (err) {
    res.status(400).send("Error logging in user." + err.message);
  }
})

//GET USER BY EMAIL
//get cookies
app.get("/profile", async(req,res)=>{
  const cookies = req.cookies;
  console.log(cookies);

  //validating jwt token from cookies
  const {token} = cookies;
  const decodedMessage = await jwt.verify(token, "RudraSecretKey");

  const {_id} = decodedMessage;

  console.log("Logged in user id is: "+ _id);


  res.send("Reading cookies!!!");
});

//USER api- GET /user - get user by email from the database
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Error retrieving user. " + err.message);
  }
});

//FEED api- GET /feed - get all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error retrieving users. " + err.message);
  }
});

//DELETE user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const deleteUser = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(500).send("Error deleting user. " + err.message);
  }
});

//Update data of user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const allowedUpdates = ["userId", "gender", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after", //this will return value of updated document
      runValidators: true, //this will run the validators defined in the schema
    });
    // console.log(user);
    res.send("User updated successfully!");
  } catch (err) {
    res.status(500).send("Error updating user. " + err.message);
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
