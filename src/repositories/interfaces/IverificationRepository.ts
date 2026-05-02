import { Patient } from "../../models/userModel";
import { Doctor } from "../../models/doctorModel";

export interface IverificationRepository {
    // otpverify(email:string): Promise <Patient| null>
    storeOtp(email: string, otp: string): Promise<void>
    verifyOtp(email: string, enteredOtp: string): Promise<boolean>
    patientLogin(email: string): Promise<Patient | null>
    // doctorOtpVerify(email: string, enteredOtp: string): Promise<boolean>
    existingDoctor(email: string): Promise<Doctor | null>
    adminLogin(email: string): Promise<Patient | null>
}