const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload.js");
const cors = require("cors");

//creating an express app
const app = express();

//using CORS middleware to allow requests from frontend server

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

//webhook route - WE ARE KEEPING IT ABOVE  express.json() BECAUSE WEBHOOK NEEDS RAW BODY FRO SIGNATURE VERIFICATION.
const webhookRoute = require("./routes/webhook");
app.use("/api", webhookRoute);

//using cookie parser middleware
app.use(cookieParser());
app.use(express.json());

//subscription route
const subscriptionRoute = require("./routes/subscription");
app.use("/api",subscriptionRoute);

//using auth router middleware
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/upload", uploadRouter);

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
