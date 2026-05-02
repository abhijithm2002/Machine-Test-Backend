import { Response, Request, NextFunction } from "express";

export interface IadminController {
    fetchUserList(req: Request, res: Response, next: NextFunction):void;
    blockUnblockPatient(req: Request, res: Response, next: NextFunction):void;
    blockUnblockDoctor(req: Request, res: Response, next: NextFunction):void;
    fetchDoctorList(req: Request, res: Response, next: NextFunction):void;
    fetchDoctors(req: Request, res: Response, next: NextFunction):void;
    verifyDocuments(req: Request, res: Response, next: NextFunction):void;
    createBanner(req: Request, res: Response, next: NextFunction):void;
    blockUnblockBanner(req: Request, res: Response, next: NextFunction):void;
    fetchBanner(req: Request, res: Response, next: NextFunction):void;
    bookings(req: Request, res: Response, next: NextFunction):void;
    bookingList(req: Request, res: Response, next: NextFunction):void;
}