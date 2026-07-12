const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    text: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000,
    },
    attachments: [
        {
            url: String,
            publicId: String,
            mimeType: String, //standardized label used to identify the format of a file or data being transmitted over the internet
            size: Number,
        },
    ],
    deliveredTo: [ //tracks who has received the message
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    readBy: [ //useful for read receipts
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            readAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    clientMessageId: { //helps prevent duplicate messages when client retries
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});
//compound indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index(
  { conversationId: 1, senderId: 1, clientMessageId: 1 },
  { unique: true }
);

module.exports=mongoose.model("Message", messageSchema);