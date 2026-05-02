import { Doctor } from "../../../models/doctorModel";
import { ISlot } from '../../../models/slotModel';
import { IBooking } from "../../../models/bookingModel";
import { INotifications } from "../../../models/notificationModel";
import { Patient } from "../../../models/userModel";


export interface IdoctorService {
    signupDoctor(userData: Partial<Doctor>): Promise<Doctor | null>
    editDoctor(doctorData: Partial<Doctor>): Promise<Doctor | null>
    uploadDocuments(doctorData: Partial<Doctor>): Promise<Doctor | null>
    fetchDocuments(email: string): Promise<Doctor | null >
    updateSlots(slotsData: any): Promise<ISlot[] | null>
    fetchSlots(id: string, date: string): Promise<ISlot[] | null>
    deleteSlots(slotId: string, selectedShifts: string[]): Promise<ISlot | null>
    fetchAppointments(doctorId: string): Promise<IBooking[] | null >
    getWalletHistory(doctorId: string): Promise<Doctor | null >
    updateBooking(bookingId: string): Promise<IBooking | null>
    postPrescription(id: string, prescriptions: string[]): Promise<IBooking | null>
    appointments(date:string,doctorId:string):Promise<IBooking[]|null>
    getNotification(doctorId:string):Promise<INotifications[] |null>
    markAsRead(notificationId:string):Promise<INotifications |null>
    fetchAdmin():Promise<Patient | null> 


}