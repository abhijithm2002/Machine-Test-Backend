import { Router } from "express";
import messageController from "../controllers/messageController";
import multer from "multer";
import storage from "../utils/multerConfig";
const upload = multer({storage: storage})

const router = Router();
const MessageController = new messageController()

router.post('/send/:id/:senderId',
    upload.fields([
        { name: 'voiceMessage', maxCount: 1 },
        { name: 'image', maxCount: 1 },
    ]), MessageController.sendMessage.bind(MessageController));
router.get('/conversations', MessageController.getConversations.bind(MessageController))
router.post('/:id/:senderId', MessageController.getMessages.bind(MessageController))
export const messageRoutes = router