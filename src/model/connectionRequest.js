const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:{
            values: ["ignored", "interested", "accecpted", "rejected"],
            message: "{VALUE} is incorrect status type."
        }
    }
},{
    timestamps: true
}
);

//Using pre method -  yeh save hone se pehle kuch operations karne ke liye hota hai
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
      //preventing user from sending request to self
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId){  //without toString() it'll compare this ObjectId("507f1f77bcf86cd799439011") === "507f1f77bcf86cd799439011"
      return res.status(400).json({message: "You can't send connection request to yourself."})
    }
    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;