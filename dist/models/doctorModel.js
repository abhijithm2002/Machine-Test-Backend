"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const doctorSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, default: '' },
    expertise: { type: String, default: '' },
    education: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    languageKnown: { type: String, default: '' },
    mobile: { type: String, default: '' },
    gender: { type: String, default: '' },
    role: { type: String },
    bio: { type: String },
    bookingfees: { type: Number },
    currentWorkingHospital: { type: String, default: '' },
    is_verified: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    documents_verified: { type: Boolean, default: false },
    workingHospitalContact: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    medicalLicenseNo: { type: String, default: '' },
    documents: [{ type: String }],
    workingDays: { type: String, default: '' },
    appointments: [{
            id: { type: String }
        }],
    notifications: [{
            id: { type: String }
        }],
    address: {
        address: { type: String },
        pincode: { type: Number },
        state: { type: String },
        country: { type: String },
        district: { type: String }
    },
    photo: { type: String, default: '' },
    Wallet: { type: Number, default: 0 },
    WalletHistory: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            amount: {
                type: Number,
                default: 0
            },
            message: {
                type: String,
                default: 'Initial Entry'
            }
        }
    ],
    review: [{
            patientId: { type: mongoose_1.default.Types.ObjectId, ref: 'Patients' },
            rating: { type: Number, required: true }
        }],
    rating: { type: Number, default: 0 }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Doctors', doctorSchema);
