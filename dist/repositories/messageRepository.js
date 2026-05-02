"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageModel_1 = __importDefault(require("../models/messageModel"));
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const doctorModel_1 = __importDefault(require("../models/doctorModel"));
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const socket_1 = require("../Socket/socket");
const index_1 = require("../index");
class MessageRepository {
    sendMessage(id, senderId, message, messageType, senderName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receiverId = id;
                const newMessage = new messageModel_1.default({
                    senderId,
                    recieverId: receiverId,
                    messageType,
                    message,
                    senderName
                });
                let conversation = yield conversationModel_1.default.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                if (!conversation) {
                    conversation = yield conversationModel_1.default.create({
                        participants: [senderId, receiverId],
                        lastMessage: newMessage._id
                    });
                }
                else {
                    conversation.lastMessage = newMessage._id;
                }
                conversation.messages.push(newMessage._id);
                yield Promise.all([conversation.save(), newMessage.save()]);
                const receiverSocketId = (0, socket_1.getReceiverSocketId)(newMessage.recieverId.toString());
                index_1.io.to(receiverSocketId).emit("newMessage", {
                    recieverId: newMessage.recieverId,
                    senderId: newMessage.senderId,
                    unreadCount: 0,
                    message: newMessage.message,
                    createdAt: newMessage.createdAt,
                    senderName: newMessage.senderName
                });
                return newMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    conversationDoctors(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingModel_1.default.find({
                    doctorId: id,
                    status: { $ne: "Canceled" },
                });
                console.log('bookings', bookings);
                const patientIds = bookings.map((booking) => booking.patientId);
                const patients = yield userModel_1.default.find({ _id: { $in: patientIds } }).sort({
                    _id: -1,
                });
                return patients;
            }
            catch (error) {
                throw error;
            }
        });
    }
    conversationPatients(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingModel_1.default.find({
                    patientId: id,
                    status: { $ne: "Canceled" },
                });
                const doctorIds = bookings.map((booking) => booking.doctorId);
                const doctors = yield doctorModel_1.default.find({ _id: { $in: doctorIds } });
                return doctors;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMessages(id, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield conversationModel_1.default.findOne({
                    participants: { $all: [senderId, id] },
                }).populate("messages");
                return conversation;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MessageRepository;
