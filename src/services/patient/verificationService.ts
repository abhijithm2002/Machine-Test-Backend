
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
import { join } from 'path';
import verificationRepository from '../../repositories/verificationRepository';
import { IverficationService } from './interfaces/IverificationService';
import { Patient } from '../../models/userModel';
import { log } from 'util';
import { Doctor } from '../../models/doctorModel';

dotenv.config({ path: join(__dirname, '../../../.env') });

export default class VerificationService implements IverficationService {
    private _verificationRepository: verificationRepository;

    constructor() {
        this._verificationRepository = new verificationRepository();
    }

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASS,
        },
    });

    async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
        console.log('entered verificationservice verifyOtp');
        
        try {
            return await this._verificationRepository.verifyOtp(email, enteredOtp);
        } catch (error) {
            throw error;
        }
    }

    
    

    public async sendOtpEmail(to: string, subject: string, otp: string): Promise<void> {
        console.log('entered verificationservice sendOtpEmail');
        const mailOptions = {
            from: process.env.USER_MAIL!,
            to,
            subject,
            text: `Your OTP code is ${otp}`,
            html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
        };

        try {
            await this._verificationRepository.storeOtp(to, otp);
            await this.transporter.sendMail(mailOptions);
            console.log('OTP Email sent successfully', otp);
        } catch (error) {
            console.error('Error sending OTP Email', error);
            throw new Error('Failed to send OTP Email');
        }
    }


    async patientLogin(email: string): Promise<Patient | null> {
        console.log('entered verificationservice patientLogin');
        try {
            const userData = await this._verificationRepository.patientLogin(email)
            return userData
        } catch (error) {
            throw error
        }
    }

    async doctorLogin(email: string): Promise<Doctor | null> {
        console.log(' entered doctorLogin verificationService');
        try {
            const userData = await this._verificationRepository.existingDoctor(email)
            return userData;
        } catch (error) {
            throw error
        }
        
    }

    async adminLogin(email: string): Promise<Patient | null> {
        console.log('entered admin login verification service');
        try {
            const adminData = await this._verificationRepository.adminLogin(email);
            return adminData
        } catch (error) {
            throw error
        }
    }
    public generateOtp(): string {
        const otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log('Generated OTP:', otp);
        return otp;
    }

}
