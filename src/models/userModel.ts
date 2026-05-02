import mongoose ,{Document, model, Schema} from "mongoose";



export interface Appointment {
    id: string;
}

export interface Notification {
    id: string;
}


export interface Address {
    address : string;
    pincode : number;
    state : string;
    country : string;
}

export interface WalletTransaction {
    date: Date;
    amount: number;
    message: string;
}

export interface Patient extends Document {
    name?: string,
    email?: string,
    password?: string,
    mobile?: number,
    gender?: string,
    photo ?: string,
    _id : string,
    is_doctor?: boolean,
    is_admin?: boolean;
    is_blocked ?: boolean;
    is_verified ?: boolean;
    favourite_doctors?: mongoose.Types.ObjectId[];
    appointments ?: Appointment[];
    notifications ?: Notification[];
    address ?: Address;
    role: String;
    Wallet: number;
    WalletHistory: WalletTransaction[]

}

const userSchema = new Schema<Patient> ({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: {type: String,required: true },
    mobile: {type: Number},
    photo: { type : String, default: ''},
    is_admin: {type: Boolean, default: false},
    is_doctor: { type: Boolean, default: false},
    is_blocked: { type: Boolean, default: false},
    gender: {type: String },
    role: {type: String},
    is_verified : {type : Boolean, default : false},
    favourite_doctors: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Doctors' }
    ],
    appointments : [{
        id: {type: String}
    }],
    notifications : [{
        id: {type: String}
    }],

    address : {
        address: {type: String},
        pincode: {type: Number},
        state: {type: String},
        country: {type: String}
    },
    Wallet : { type: Number, default: 0},
    WalletHistory: [
        {
            date: {
                type : Date,
                default: Date.now
            },
            amount : {
                type: Number,
                default: 0
            },
            message : {
                type: String,
                default: 'Initial Entry'
            }
        }
    ],


},{timestamps : true})

export default model<Patient>("Patients", userSchema)