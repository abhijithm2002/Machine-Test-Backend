import { ImessageService } from "./interfaces/ImessageService"
import MessageRepository from "../../repositories/messageRepository"
import { IMessage } from "../../models/messageModel";
import { IConversation } from "../../models/conversationModel";
import { Doctor } from "../../models/doctorModel";
import { Patient } from "../../models/userModel";

export default class messageService implements ImessageService {
    private _messageRepository: MessageRepository;
    constructor() {
        this._messageRepository = new MessageRepository();
    }    

    async sendMessage(id: string, senderId: string, message: string, messageType: string, senderName: string): Promise<IMessage | null> {
        try {
            return await this._messageRepository.sendMessage(id, senderId, message, messageType, senderName);
        } catch (error) {
            throw error
        }
    }

    async conversationDoctors(id: string): Promise<Patient[] | null> {
        console.log('doctor conversion service')
        try {
            return await this._messageRepository.conversationDoctors(id);
          } catch (error) {
            throw error;
          }
    }
      async conversationPatients(id: string): Promise<Doctor[] | null> {
        console.log('patient conversion service')
        try {
          return await this._messageRepository.conversationPatients(id);
        } catch (error) {
          throw error;
        }
      }



      async getMessages(id: string, senderId: string): Promise<IConversation | null> {
        try {
            return await this._messageRepository.getMessages(id, senderId);
          } catch (error) {
            throw error;
          }
      }
}