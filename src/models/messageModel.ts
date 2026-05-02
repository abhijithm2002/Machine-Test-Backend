import mongoose, {Document,Model, model, Schema} from "mongoose";

export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId,
    recieverId: mongoose.Types.ObjectId,
    messageType: 'text' | 'voice' | 'image',
    message: string,
    createdAt?: string
    senderName?: string
}

const messageSchema: Schema<IMessage> = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctors',
        required: true
    },
    recieverId: {
        type: Schema.Types.ObjectId,
        ref: 'Patients',
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'voice', 'image'],
        required: true
    },
    message : {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    }

},{timestamps: true})

const Message: Model<IMessage> = model<IMessage>('Message',messageSchema);
export default Message;

