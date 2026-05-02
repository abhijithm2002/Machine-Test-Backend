import { IConversation } from "../../../models/conversationModel";
import { Doctor } from "../../../models/doctorModel";
import { Patient } from "../../../models/userModel";
import { IMessage } from "../../../models/messageModel";
export interface ImessageService {
    sendMessage(id: string, senderId: string, message: string, messageType:string, senderName: string): Promise<IMessage | null>
    conversationPatients(id: string): Promise<Doctor[] | null>
    conversationDoctors(id: string): Promise<Patient[] | null>
    getMessages( id: string, senderId: string): Promise<IConversation | null>
}