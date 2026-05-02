import { IBooking } from "../../models/bookingModel";
import { Patient } from "../../models/userModel";
import { IBanner } from "../../models/bannerModel";
import { Doctor } from "../../models/doctorModel";
import mongoose from "mongoose";
import { INotifications } from "../../models/notificationModel";
import { IContact } from "../../models/contactModel";

export interface IpatientRepository {
    signupPatient(userData: Partial<Patient>): Promise<Patient | null >
    patientFetch():Promise<Patient[] | null >
    fetchPatient(id: string): Promise<Patient | null>
    editSinglePatient(userData: Partial<Patient>) : Promise< Patient| null >
    postBooking(userData: Partial<IBooking>) : Promise< IBooking| null >
    fetchBookings(id: string, date: string) : Promise< IBooking[] | null >
    myBookings(patientId: string) : Promise< IBooking[] | null >
    // myBookings(patientId: string, page: number, limit: number): Promise<{ data: IBooking[]; totalCount: number }>
    cancelBooking(bookingId: string) : Promise< IBooking | null >
    getWalletHistory(patientId: string) : Promise<Patient | null >
    getBanner() : Promise<IBanner[] | null >
    addFavouriteDoctor(patientId: string, doctorId: string): Promise<string>
    getFavouriteDoctors(patientId: string): Promise<mongoose.Types.ObjectId[] | null>
    fetchAdmin(): Promise<Patient | null>
    getNotification(patientId:string):Promise<INotifications[]|null>
    markAsRead(notificationId:string):Promise<INotifications|null>
    postContact(formData: Partial<IContact>): Promise<IContact | null>
}