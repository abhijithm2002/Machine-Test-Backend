
import { Request, Response, NextFunction } from "express";
import VerificationService from "../services/patient/verificationService";
import { IverificationController } from "./interfaces/IverificationController";
import PatientRepository from "../repositories/patientRepository";
import { ParsedQs } from "qs";
import AppError from "../utils/AppError";
import bcrypt from 'bcrypt'
import generateJwt from "../middleware/jwt";
import { Payload } from "../middleware/jwt";
import crypto from 'crypto';
import patientService from "../services/patient/patientService";
import doctorService from "../services/doctor/doctorService";

export default class VerificationController implements IverificationController {
    private _verificationService: VerificationService;
    private _patientRepository: PatientRepository;
    private _patientService: patientService;
    private _doctorService: doctorService

    constructor() {
        this._verificationService = new VerificationService();
        this._patientRepository = new PatientRepository();
        this._patientService = new patientService();
        this._doctorService = new doctorService();
    }

    async generateOtp(req: Request, res: Response, next: NextFunction) {
        console.log('Entered generateOtp controller method');
        try {
            const { email } = req.body;
            const otp = this._verificationService.generateOtp();
            await this._verificationService.sendOtpEmail(email, 'Your OTP Code: ', otp);

            return res.status(200).json({ message: "OTP sent to email" });
        } catch (error) {
            console.error('Error in generateOtp:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async otpverify(req: Request, res: Response, next: NextFunction) {
        console.log('Entered otpverify controller method');
        try {
            const { email, otp } = req.body;
            console.log("OTP verification payload:", req.body);
            console.log('userdata: ')

            const isVerified = await this._verificationService.verifyOtp(email, otp);
            if (isVerified) {

                return res.status(200).json({ message: "User verified" });
            } else {
                return res.status(400).json({ message: "Verification failed" });
            }
        } catch (error) {
            console.error('Error in otpverify:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }


    async resendOtp(req: Request, res: Response, next: NextFunction) {
        console.log('Entered resendotp controller');
        try {
            const { email } = req.body;
            console.log('email', email)
            const otp = this._verificationService.generateOtp();
            await this._verificationService.sendOtpEmail(email, "Your OTP Code: ", otp)
            return res.status(200).json({ message: 'New OTP send to mail' })
        } catch (error) {
            console.log('Error in resend Otp', error);
            res.status(500).json({ message: 'Internal Server Error' });

        }
    }


    async patientLogin(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        try {
            const data = await this._verificationService.patientLogin(email);
            if (!data) {
                return res.status(400).json({ message: 'Email is incorrect', field: 'email' });
            }
    
            const password2 = data.password as string;
            const isMatch = await bcrypt.compare(password, password2);
            if (!isMatch) {
                return res.status(401).json({ message: "Password is incorrect", field: 'password' });
            }
    
            const { name, photo, is_blocked, _id } = data;
            if (is_blocked) {
                return res.status(403).json({ message: 'User is blocked', field: 'general' });
            }
    
            let { refreshToken, accessToken } = await generateJwt(data as Payload);
    
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            return res.status(200).json({ message: 'Patient Logged in', user: data, accessToken });
    
        } catch (error) {
            console.log('Error during patient Login', error);
            next(error);
        }
    }
    


    async doctorLogin(req: Request, res: Response, next: NextFunction) {
        const {email, password} = req.body;
        try {
            const data = await this._verificationService.doctorLogin(email);
            if (!data) {
                return res.status(400).json({ message: 'Email is incorrect', field: 'email' });
            }

            const password2 = data.password as string;
            const isMatch = await bcrypt.compare(password, password2)
            if (!isMatch) {
                return res.status(401).json({ message: "Password is incorrect", field: 'password' });
            }

            const {name, photo, is_blocked, _id} = data;
            if (is_blocked) {
                return res.status(403).json({ message: 'Doctor is blocked' });
            }
            let { refreshToken, accessToken } = await generateJwt(data as Payload);
    
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            })
            return res.status(200).json({ message: 'Doctor Logged in', doctor: data, accessToken });
        } catch (error) {
            console.log('Error during doctor Login', error);
            next(error);
        }
    }

    async adminLogin(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        try {
            const data = await this._verificationService.adminLogin(email);
            if (!data || !data.is_admin) {
                return res.status(400).json({ message: 'Email is incorrect', field: 'email' });
            }
    
            const password2 = data.password as string;
            const isMatch = await bcrypt.compare(password, password2);
            if (!isMatch) {
                return res.status(401).json({ message: 'Password is incorrect', field: 'password' });
            }
    
            const { is_admin, name, photo, is_blocked, _id } = data;
            if (is_blocked) {
                return res.status(403).json({ message: 'User is blocked' });
            }
    
            let tokens = await generateJwt(data as Payload);
            return res.status(200).json({ message: 'Admin Logged in', email, name, photo, _id, tokens });
        } catch (error) {
            console.log('Error during admin Login', error);
            next(error);
        }
    }
    

    async googleLogin(req: Request, res: Response, next: NextFunction) {
        console.log('coming to google login controller');
        
        const { email, name } = req.body;
        console.log(email)
        console.log(name)
        if (typeof email !== 'string') {
            throw new Error('Invalid email format');
        }
        try {
            let data = await this._verificationService.patientLogin(email);
            if (!data) {
              
                const randomPassword = crypto.randomBytes(8).toString('hex');
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                
                const newUser = {
                    email,
                    name,
                    password: hashedPassword,
                    
                };
                data = await this._patientService.signupPatient(newUser);
            }
            //@ts-ignore
            const { _id, photo, is_blocked } = data;
            if (is_blocked) {
                return res.status(403).json({ message: 'User is blocked' });
            }

            let {refreshToken, accessToken} = await generateJwt( data as Payload);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            return res.status(200).json({ message: 'Login successful', user: data, accessToken });
        } catch (error) {
            console.log('Error during Google Login', error);
            next(error);
        }
    }



    async doctorGoogleLogin(req: Request, res: Response, next: NextFunction) {
        console.log('coming to doctor google login controller');
        const {email, name} = req.body;
            console.log(email)
            console.log(name);

            if (typeof email !== 'string') {
                throw new Error('Invalid email format');
            }

        try {
            
            let doctor = await this._verificationService.doctorLogin(email)
            if(!doctor) {
                const randomPassword = crypto.randomBytes(8).toString('hex');
                const hashedPassword = await bcrypt.hash(randomPassword, 10)

                const newUser = {
                    email,
                    name,
                    password: hashedPassword,
                    
                };
                doctor = await this._doctorService.signupDoctor(newUser)
            }
            //@ts-ignore
            const { _id, photo, is_blocked } = doctor;
            if (is_blocked) {
                return res.status(403).json({ message: 'Doctor is blocked' });
            }

            let {refreshToken, accessToken} = await generateJwt( doctor as Payload);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            return res.status(200).json({ message: 'Login successful', doctor: doctor, accessToken });
        } catch (error) {
            console.log('Error during Google Login', error);
            next(error);
        }
        
    }
}
