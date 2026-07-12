const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env"), quiet: true });
const express = require("express");
const http = require("http");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const chatRouter = require("./routes/chat");
const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload.js");

//creating an express app
const app = express();
const server = http.createServer(app);

//using CORS middleware to allow requests from frontend server
const allowedOrigin = "http://localhost:5173";

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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
app.use("/api", authRouter);
app.use("/", authRouter);
app.use("/api", profileRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", chatRouter);
app.use("/", userRouter);
app.use("/upload", uploadRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    const initSocket = require("./config/socket");
    initSocket(server);
    server.listen(1111, () => {
      console.log("Server is listening on port 1111");
    });
  })
  .catch((err) => {
    console.log("Database connection failed!", err);
  });
