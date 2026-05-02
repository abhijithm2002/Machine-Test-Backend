import mongoose,{Document, model, Schema} from "mongoose";
import { WalletTransaction } from "./userModel";



export interface Appointment {
    id: string
}

export interface Notification {
    id: string
}

export interface Address {
    address : string;
    pincode : number;
    district: string;
    state : string;
    country : string;
}

export interface Doctor extends Document {
    email: string;
    name: string;
    password: string,
    expertise: string;
    education: string;
    experienceYears: number;
    medicalLicenseNo: string;
    workingHospitalContact: string;
    dateOfBirth: string;
    languageKnown: string;
    mobile : string;
    gender: string;
    is_verified: boolean;
    is_blocked: boolean;
    is_admin: boolean;
    documents_verified: boolean;
    appointments ?: Appointment[];
    notifications ?: Notification[];
    documents ?: string[];
    currentWorkingHospital: string;
    workingDays: string;
    photo ?: string
    address ?: Address;
    role: string;
    bio: string;
    bookingfees: number;
    Wallet?: number;
    WalletHistory?: WalletTransaction[]
    review?: {
        patientId: mongoose.Types.ObjectId,
        rating: number
    }[],
    rating?:number
}


const doctorSchema = new Schema<Doctor>({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, default:'' },
    expertise: { type: String, default: '' },
    education: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    languageKnown: { type: String, default: '' },
    mobile: { type: String, default: '' },
    gender: { type: String, default: '' },
    role: {type: String},
    bio:{type: String},
    bookingfees: {type: Number},
    currentWorkingHospital: { type: String, default: '' },
    is_verified:{ type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    is_admin : {type : Boolean, default: false},
    documents_verified:{type:Boolean,default:false},
    workingHospitalContact:{type:String,default:''},
    experienceYears:{type:Number,default:0},
    medicalLicenseNo:{type:String,default:''},
    documents:[{type: String}],
    workingDays: { type: String, default: '' },
    appointments: [{
        id: { type: String }
    }],
    notifications: [{
        id: { type: String }
    }],
    address : {
        address: {type: String},
        pincode: {type: Number},
        state: {type: String},
        country: {type: String},
        district: {type: String}
    },
    
    photo: { type: String,default:'' },

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
    review : [{
        patientId: {type : mongoose.Types.ObjectId, ref: 'Patients'},
        rating: {type: Number, required: true}
    }],
    rating: {type: Number, default: 0}
}, { timestamps: true })


export interface DoctoryQuery {
    is_verified: boolean;
    is_blocked : boolean;
    documents_verified: boolean;
    experienceYears?: number;
    gender?: string;
    name?: { $regex: string, $options: string };

}

export default model<Doctor>('Doctors', doctorSchema)