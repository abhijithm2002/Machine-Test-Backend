import mongoose, { Schema, model, Document } from "mongoose";

export interface ISlot extends Document {
    doctorId: Schema.Types.ObjectId;
    date: Date;
    shifts: string[];  
    createdAt: Date;
}

const slotSchema = new Schema<ISlot>({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    shifts: [
        {
            type: String,
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default model<ISlot>("Slots", slotSchema)
