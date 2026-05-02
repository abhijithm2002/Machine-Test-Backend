
import { Request, Response, NextFunction } from "express";

export interface IverificationController {
    otpverify(req: Request, res: Response, next: NextFunction):void;
    generateOtp(req: Request, res: Response, next: NextFunction): void
    resendOtp(req: Request, res: Response, next: NextFunction): void
    patientLogin(req: Request, res: Response, next: NextFunction) : void
    doctorLogin(req: Request, res: Response, next: NextFunction) : void
    googleLogin(req: Request, res: Response, next: NextFunction): void
    doctorGoogleLogin(req: Request, res: Response, next: NextFunction): void
    adminLogin(req: Request, res: Response, next: NextFunction): void
}