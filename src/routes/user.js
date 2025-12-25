const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const { connection } = require("mongoose");
const User = require("../model/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender bio skills";

//api to get pending connection requests for logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); //populate to get user details of fromUserId
    res.json({
      message: "Received connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error fetching pending requests " + err.message);
  }
});

//api to get all connections of logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        //agar Kalpit ne rudra ko request bheji or kalpit ko kanak ne request or accept kiya h to dono ko connection milega
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA); //populate to get user details of fromUserId and toUserId

    //agar fromUserId loggedInUser ke barabar h to toUserId return kar do warna fromUserId return kar do
    //kyoki hume loggeInUser ki information nhi chahiye
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error fetching connections " + err.message);
  }
});

//api to get the feed for logged in user
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //param - /:status - esse dete he
    //query - ?page=1 - esse dete he
    const page = parseInt(req.query.page) || 1; //agar page query parameter nhi h to default 1 le lo
    let limit = parseInt(req.query.limit) || 10; //agar limit query parameter nhi h to default 10 le lo
    limit = limit > 50 ? 50 : limit; //max limit 50 rakh dete he
    const skip = (page - 1)*limit; //calculate skip value for pagination

    //User should see all the cards except:
    //1. Himself/herself
    //2. his/her existing connections
    //3. users to whom he/she has sent connection requests
    //4. users who have sent connection requests to him/her
    //5. users whom he/she has ignored

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const excludedUserIds = new Set(); //Set is data structure that stores unique values only
    connectionRequests.forEach((req) => {//Iterate over each connection request to add both fromUserId and toUserId to the excluded set
      excludedUserIds.add(req.fromUserId.toString());//By this we ensure that both fromUserId and toUserId are excluded
      excludedUserIds.add(req.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(excludedUserIds) } }, //nin means not in- to exclude connected users and request sent/received users
        { _id: { $ne: loggedInUser._id } }, //$ne means not equal- to exclude logged in user
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit); //pagination using skip and limit; 

    res.send(feedUsers);
  } catch (err) {
    res.status(400).send("Error fetching feed " + err.message);
  }
});

module.exports = userRouter;
