import { Patient } from "../../../models/userModel";
import { Doctor } from "../../../models/doctorModel";
import { IBooking } from "../../../models/bookingModel";
import { IBanner } from "../../../models/bannerModel";
import mongoose from "mongoose";
import { INotifications } from "../../../models/notificationModel";
import { IContact } from "../../../models/contactModel";

export interface IpatientService {
    signupPatient(userData: Partial<Patient>): Promise<Patient | null>
    editPatient(userData: Partial<Patient>): Promise<Patient | null>
    fetchDoctorDetails(id: string): Promise<Doctor | null>
    postBooking(userData: Partial<IBooking>): Promise<IBooking | null>
    fetchBookings(id: string, date: string): Promise<IBooking[] | null>
    myBookings(patientId: string): Promise<IBooking[] | null>
    // myBookings(patientId: string, page: number, limit: number): Promise<{ data: IBooking[]; totalCount: number }>
    cancelBooking(bookingId: string): Promise<IBooking | null>
    getWalletHistory(patientId: string): Promise<Patient | null>
    getBanner(): Promise<IBanner[] | null>
    addFavouriteDoctor(patientId: string, doctorId: string): Promise<string>
    getFavouriteDoctors(patientId: string): Promise<mongoose.Types.ObjectId[] | null>;
    // fetchDoctorList():Promise<Doctor[] | null> 
    fetchDoctorList({ page, limit, search, specialization, minPrice, maxPrice, state, experienceYears }: { page: number; limit: number; search: string; specialization: string, minPrice: number, maxPrice: number, state: string, experienceYears: number }): Promise<{ doctors: Doctor[]; total: number }>
    postRating(patientId: string, doctorId: string, rating: number): Promise<Doctor | null>
    fetchAdmin(): Promise<Patient | null>
    getNotification(patientId: string): Promise<INotifications[] | null>
    markAsRead(notificationId: string): Promise<INotifications | null>
    postContact(formData: Partial<IContact>): Promise<IContact | null>
}