import { Patient } from "../../../models/userModel";
import { Doctor } from "../../../models/doctorModel";
import { IBanner } from '../../../models/bannerModel'
import { IBooking } from "../../../models/bookingModel";

export interface IadminService {
    fetchUserList():Promise<Patient[] | null> 
    blockUnblockPatient(id: string, status: boolean): Promise<Patient | null>
    blockUnblockDoctor(id: string, status: boolean): Promise<Doctor | null>
    fetchDoctorList():Promise<Doctor[] | null> 
    fetchDoctors():Promise<Doctor[] | null> 
    verifyDocuments(id: string): Promise<Doctor | null>
    createBanner(bannerData: Partial<IBanner>): Promise<IBanner | null>
    blockUnblockBanner(id: string, status: boolean): Promise<IBanner | null>
    fetchBanner(): Promise<IBanner[] | null>
    bookings(): Promise<IBooking[] | null>
    bookingList(page : string, date: string): Promise<{ bookings: IBooking[];totalBookings: number; totalPages: number; } | null>
}

