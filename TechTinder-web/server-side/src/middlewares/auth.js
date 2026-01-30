const jwt = require("jsonwebtoken");
const User = require("../model/user.js");

//yeh authenticate karega ki user logged in hai ya nahi or fir hum isse har api me use kar sakte hain jaha authentication chahiye
const userAuth = async (req, res, next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("No token found in cookies");
        }
        const decodedMessage = await jwt.verify(token, "RudraSecretKey");
        const {_id}= decodedMessage;
        const user = await User.findById(_id);
        
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).json({"error": "Authentication failed. "+err.message});
    }
}

module.exports =  userAuth ;