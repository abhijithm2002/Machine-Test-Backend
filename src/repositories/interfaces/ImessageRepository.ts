import { IConversation } from "../../models/conversationModel";
import { Doctor } from "../../models/doctorModel";
import { IMessage } from "../../models/messageModel";
import { Patient } from "../../models/userModel";

export  interface ImessageRepository {
    sendMessage(id:string, senderId: string, message: string, messageType: string ,senderName: string): Promise<IMessage | null>
    conversationPatients(id:string):Promise<Doctor[]|null>
    conversationDoctors(id:string):Promise<Patient[]|null>
    getMessages(id:string, senderId : string):Promise<IConversation|null>
}