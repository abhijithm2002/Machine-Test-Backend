import { NextFunction, Request, Response } from "express";

export interface IpatientController{
    signupPatient(req: Request, res: Response, next: NextFunction): void
    editPatient(req: Request, res: Response, next: NextFunction): void
    fetchDoctorDetails(req: Request, res: Response, next: NextFunction): void
    fetchSlots(req: Request, res: Response, next: NextFunction): void;
    createPayment(req: Request, res: Response, next: NextFunction): void;
    verifyPayment(req: Request, res: Response, next: NextFunction): void;
    postBooking(req: Request, res: Response, next: NextFunction): void;
    fetchBookings(req: Request, res: Response, next: NextFunction): void;
    myBookings(req: Request, res: Response, next: NextFunction): void;
    cancelBooking(req: Request, res: Response, next: NextFunction): void;
    getWalletHistory(req: Request, res: Response, next: NextFunction): void;
    getBanner(req: Request, res: Response, next: NextFunction): void;
    addFavouriteDoctor(req: Request, res: Response, next: NextFunction): void;  
    getFavouriteDoctors(req: Request, res: Response, next: NextFunction): void;  
    fetchDoctorList(req: Request, res: Response, next: NextFunction): void;  
    postRating(req: Request, res: Response, next: NextFunction): void;  
    fetchAdmin(req: Request, res: Response, next: NextFunction): void;  
    getNotification(req: Request, res: Response, next: NextFunction): void;
    markAsRead(req: Request, res: Response, next: NextFunction): void;
    postContact(req: Request, res: Response, next: NextFunction): void;


}