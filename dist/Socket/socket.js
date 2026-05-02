"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userSocketMap = {};
const unreadMessages = {};
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ['https://doc-now-client.vercel.app', 'http://localhost:5173'],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log('socket connected');
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        socket.on("disconnect", () => {
            if (userId) {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
        socket.on("typing", ({ userId, conversationId }) => {
            const receiverId = (0, exports.getReceiverSocketId)(conversationId);
            if (receiverId) {
                io.to(receiverId).emit("typing", { userId });
            }
        });
        socket.on("stopTyping", ({ userId, conversationId }) => {
            const receiverId = (0, exports.getReceiverSocketId)(conversationId);
            if (receiverId) {
                io.to(receiverId).emit("stopTyping", { userId });
            }
        });
        // Handle new message
        socket.on("sendnewMessage", ({ to, from, message, senderName }) => {
            if (!unreadMessages[to]) {
                unreadMessages[to] = {};
            }
            if (!unreadMessages[to][from]) {
                unreadMessages[to][from] = 0;
            }
            unreadMessages[to][from] += 1;
            const receiverSocketId = (0, exports.getReceiverSocketId)(to);
        });
        // Mark messages as read
        socket.on("markAsRead", ({ from, to }) => {
            if (unreadMessages[to] && unreadMessages[to][from]) {
                delete unreadMessages[to][from];
            }
        });
        socket.on("callingUser", ({ Caller, userId, personalLink, }) => {
            console.log('enterd calling', Caller);
            console.log('userId', userId);
            console.log('personalLink', personalLink);
            const receiverSocketId = (0, exports.getReceiverSocketId)(userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("incomingCall", {
                    Caller,
                    userId,
                    personalLink,
                });
            }
        });
        socket.on("onRejected", ({ Caller }) => {
            const receiverSocketId = (0, exports.getReceiverSocketId)(Caller._id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("callRejected");
            }
        });
        socket.on("newBooking", (data) => {
            const receiverSocketId = (0, exports.getReceiverSocketId)(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newBooking", {
                    message: `New booking from ${data.senderName}`,
                    bookingDetails: data.bookingDetails,
                });
            }
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
