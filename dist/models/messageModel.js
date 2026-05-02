"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctors',
        required: true
    },
    recieverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patients',
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'voice', 'image'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    }
}, { timestamps: true });
const Message = (0, mongoose_1.model)('Message', messageSchema);
exports.default = Message;
