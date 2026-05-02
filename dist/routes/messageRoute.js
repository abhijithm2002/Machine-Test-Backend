"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const express_1 = require("express");
const messageController_1 = __importDefault(require("../controllers/messageController"));
const multer_1 = __importDefault(require("multer"));
const multerConfig_1 = __importDefault(require("../utils/multerConfig"));
const upload = (0, multer_1.default)({ storage: multerConfig_1.default });
const router = (0, express_1.Router)();
const MessageController = new messageController_1.default();
router.post('/send/:id/:senderId', upload.fields([
    { name: 'voiceMessage', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]), MessageController.sendMessage.bind(MessageController));
router.get('/conversations', MessageController.getConversations.bind(MessageController));
router.post('/:id/:senderId', MessageController.getMessages.bind(MessageController));
exports.messageRoutes = router;
