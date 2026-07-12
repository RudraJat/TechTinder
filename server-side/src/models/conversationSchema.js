const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: { //exactly 2 users for 1-to-1 chat
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        required: true,
        validate: {
            validator: function(value){
                return value.length ===2;
            },
            message: "A conversation must have exactly 2 participants.",
        },
    },
    participantKey: { //unique string made from sorted user ids, like id1:id2
        type: String,
        required: true,
        unique: true,
    },
    lastMessageAt: {
        type: Date,
        index: true,
        default: null,
    },
    lastMessagePreview: { //short text shown in inbox
        type: String,
        default: "",
    },
    lastMessageSenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status: {
        type: String,
        enum: ["active", "archived", "blocked"],
        default: "active",
    },
},
{
    timestamps: true,
}
);
//Compound indexes
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

module.exports=mongoose.model("Conversation",conversationSchema);