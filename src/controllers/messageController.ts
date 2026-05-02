import { ImessageController } from "./interfaces/ImessageController";
import { Request, Response, NextFunction } from "express";
import messageService from "../services/message/messageService";
import path from "path";
import { uploadImageToCloudinary, uploadVoiceMessageToCloudinary } from "../utils/cloudinary";

export default class messageController implements ImessageController {
    private _messageService: messageService;
    constructor() {
        this._messageService = new messageService();

    }

    async sendMessage(req: Request, res: Response, next: NextFunction) {
        console.log('entered sendmessage')
        try {
            const { message, senderName } = req.body;
            console.log('sendername .....', senderName)
            const { id, senderId } = req.params;
            console.log("message", message)
            console.log("id", id)
            console.log("senderid", senderId)
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let messageType: 'text' | 'image' | 'voice' = 'text';
            let messageContent: string = message;
            if (files.voiceMessage && files.voiceMessage[0]) {
                const voicePath = path.join(
                    __dirname,
                    "../public/voicemessages",
                    files.voiceMessage[0].filename
                );
                messageContent = await uploadVoiceMessageToCloudinary(voicePath);
            } else if (files.image && files.image[0]) {
                messageType = "image";
                const imagePath = path.join(
                    __dirname,
                    "../public/images",
                    files.image[0].filename
                );
                messageContent = await uploadImageToCloudinary(imagePath);
            }

            const data = await this._messageService.sendMessage(id, senderId, messageContent, messageType, senderName);
            return res.status(200).json({ newMessage: data })

        } catch (error) {
            return res.status(500).json({ message: "Internal Error" });
        }
    }

    async getConversations(req: Request, res: Response, next: NextFunction) {
        console.log('entered get conversation controller');

        try {
            const { id, action } = req.query;
            console.log('id', id, action)
            let conversation;
            if (action === "fetchDoctorForUsers") {
                conversation = await this._messageService.conversationPatients(id as string)
                console.log('conversaiton',conversation)
                return res.json({ conversation });
            } else if (action === "fetchUsersForDoctors") {
                conversation = await this._messageService.conversationDoctors(id as string);
                console.log('conversation',conversation)
                return res.json({ conversation });
            }
        } catch (error) {
            res.status(500).json({ message: 'internal Error' })
        }
    }

    

    async getMessages(req: Request, res: Response, next: NextFunction) {
        
        try {
            const {id , senderId} = req.params;
            console.log('chatid', id)
            console.log('senderid', senderId)
             
            const conversation = await this._messageService.getMessages(id as string, senderId as string);
            if(conversation?.messages) {
                return res.status(200).json({message: conversation.messages, lastMessage: conversation.lastMessage})
            } else {
                return res.status(200).json([])
            }

        } catch (error) {
            return res.status(500).json({message: 'Internal Error'})
        }
    }
}