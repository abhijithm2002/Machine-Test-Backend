import mongoose,{Document, model, Schema} from "mongoose";

export interface IContact extends Document  {
    name: string,
    email: string,
    message: string
}


const contactSchema :Schema =  new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true}
})

export default model<IContact>('Contact',contactSchema)