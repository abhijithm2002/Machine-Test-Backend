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
const messageRepository_1 = __importDefault(require("../../repositories/messageRepository"));
class messageService {
    constructor() {
        this._messageRepository = new messageRepository_1.default();
    }
    sendMessage(id, senderId, message, messageType, senderName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._messageRepository.sendMessage(id, senderId, message, messageType, senderName);
            }
            catch (error) {
                throw error;
            }
        });
    }
    conversationDoctors(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('doctor conversion service');
            try {
                return yield this._messageRepository.conversationDoctors(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    conversationPatients(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('patient conversion service');
            try {
                return yield this._messageRepository.conversationPatients(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMessages(id, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._messageRepository.getMessages(id, senderId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = messageService;
