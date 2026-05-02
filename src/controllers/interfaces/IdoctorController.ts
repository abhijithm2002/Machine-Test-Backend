import { NextFunction, Request, Response } from "express";

export interface IdoctorController {
    signupDoctor(req: Request, res: Response, next: NextFunction): void;
    editDoctor(req: Request, res: Response, next: NextFunction): void;
    uploadDocuments(req: Request, res: Response, next: NextFunction): void;
    fetchDocuments(req: Request, res: Response, next: NextFunction): void;
    updateSlots(req: Request, res: Response, next: NextFunction): void;
    fetchSlots(req: Request, res: Response, next: NextFunction): void;
    deleteSlots(req: Request, res: Response, next: NextFunction): void;
    fetchAppointments(req: Request, res: Response, next: NextFunction): void;
    getWalletHistory(req: Request, res: Response, next: NextFunction): void;
    updateBooking(req: Request, res: Response, next: NextFunction): void;
    postPrescriptions(req: Request, res: Response, next: NextFunction): void;
    drAppointments(req: Request, res: Response, next: NextFunction): void;
    getNotification(req: Request, res: Response, next: NextFunction): void;
    markAsRead(req: Request, res: Response, next: NextFunction): void;
    fetchAdmin(req: Request, res: Response, next: NextFunction): void;  

}