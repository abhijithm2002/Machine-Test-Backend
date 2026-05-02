import { Request, Response, NextFunction } from "express";
import { Patient } from "../../../models/userModel";
import { Doctor } from "../../../models/doctorModel";

export interface IverficationService {
    sendOtpEmail( to : string, subject: string, otp: string): Promise<void>;
    generateOtp() : string;
    // otpverify(email: string): Promise<Patient | null>
    verifyOtp(email: string, enteredOtp: string): Promise<boolean>
    patientLogin(email: string): Promise<Patient | null>
    // doctorOtpVerify(email: string, enteredOtp: string): Promise<boolean>
    doctorLogin(email: string): Promise<Doctor | null>
    adminLogin(email: string): Promise<Patient | null>
    
    
}