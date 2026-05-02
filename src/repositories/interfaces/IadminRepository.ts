import { IBanner } from "../../models/bannerModel";
import { IBooking } from "../../models/bookingModel";
import { Doctor } from "../../models/doctorModel";

export interface IadminRepository {
    createBanner(bannerData: Partial<IBanner>): Promise<IBanner | null>
    fetchBanner(id: string): Promise<IBanner | null>
    fetchBanners(): Promise<IBanner[] | null>
    bookings(): Promise<IBooking[] | null>
    fetchDoctors(): Promise<Doctor[] | null>
    fetchDoctor(): Promise<Doctor[]| null>
    bookingList(page: string, date: string): Promise<{ bookings: IBooking[]; totalBookings: number; totalPages: number; } | null>
}

