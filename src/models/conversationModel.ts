import mongoose,{Document, model, Model, Schema, Types} from "mongoose";

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[],
    messages: mongoose.Types.ObjectId[],
    lastMessage: Types.ObjectId; 
}

const conversationSchema: Schema<IConversation> = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref:'Patients'
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', 
        required: false 
    },
},{timestamps: true})


const Conversation: Model<IConversation> = model<IConversation>('Conversation',conversationSchema);
export default Conversation;



