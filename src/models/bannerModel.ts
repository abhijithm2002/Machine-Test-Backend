import mongoose, { Document, model, Schema } from "mongoose";


export interface IBanner extends Document {
    title: string,
    title2?: string,
    title3?: string,
    description: string,
    imgUrl: string,
    link: string,
    status: boolean,
    createdAt: Date
}

const bannerSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    title2: { type: String, trim: true, default: '' },
    title3: { type: String, trim: true, default: '' },
    description :{ type: String, trim: true, default: '' },
    imgUrl: { type: String, required: true },
    status: {type: Boolean, default: true},
    createdAt: { type: Date, default: Date.now },

})

export default model<IBanner>('Banner', bannerSchema)