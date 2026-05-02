import { IBooking } from "../../models/bookingModel";
import { Doctor } from "../../models/doctorModel";
import Slots, { ISlot } from "../../models/slotModel";
import { INotifications } from "../../models/notificationModel";
import { Patient } from "../../models/userModel";

export interface IdoctorRepository {
    signupDoctor(userData: Partial<Doctor>): Promise<Doctor | null>
    // doctorFetch(): Promise<Doctor[] | null>
    doctorFetch({ page, limit, search, specialization,minPrice,maxPrice,state,experienceYears }: { page: number; limit: number; search: string; specialization: string,minPrice: number,maxPrice: number, state: string,experienceYears: number}): Promise<{ doctors: Doctor[]; total: number }>
    fetchDoctor(id: string): Promise<Doctor | null>
    editSingleDoctor(doctorData: Partial<Doctor>): Promise<Doctor | null>
    insertSlots(slotsData: ISlot[]): Promise<ISlot[] | null>
    fetchSlots(id: string, date: string): Promise<ISlot[] | null>
    deleteSlots(slotId: string, selectedShifts: string[]): Promise<ISlot | null>
    fetchDocuments(email: string): Promise<Doctor | null>;
    fetchAppointments(doctorId: string): Promise<IBooking[] | null >
    getWalletHistory(doctorId: string): Promise<Doctor | null >
    updateBooking(bookingId: string): Promise<IBooking | null>
    appointments(date:string,doctorId:string):Promise<IBooking[]|null>
    getNotification(doctorId:string):Promise<INotifications[]|null>
    markAsRead(notificationId:string):Promise<INotifications|null>
    fetchAdmin(): Promise<Patient | null>

}