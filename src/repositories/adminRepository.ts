import Banner, { IBanner } from "../models/bannerModel";
import Booking, { IBooking } from "../models/bookingModel";
import Doctors, { Doctor } from "../models/doctorModel";
import { IadminRepository } from "./interfaces/IadminRepository";


export default class adminRepository implements IadminRepository {
    async createBanner(bannerData: Partial<IBanner>): Promise<IBanner | null> {
        try {
            return await Banner.create(bannerData)
        } catch (error) {
            throw error
        }
    }

    async fetchBanner(id: string): Promise<IBanner | null> {
        try {
            return await Banner.findOne({ _id: id })
        } catch (error) {
            throw error
        }
    }

    async fetchBanners(): Promise<IBanner[] | null> {
        try {
            return await Banner.find().select('-password').sort({ createdAt: -1 })
        } catch (error) {
            throw error
        }
    }

    async bookings(): Promise<IBooking[] | null> {
        try {
            return await Booking.find().populate({ path: 'doctorId' }).populate({ path: "patientId" })
        } catch (error) {
            throw error
        }
    }

    async fetchDoctors(): Promise<Doctor[] | null> {
        try {
            return await Doctors.find({ documents_verified: true }).select('-password')
        } catch (error) {
            throw error
        }
    }

    async fetchDoctor(): Promise<Doctor[] | null> {
        try {
            const doctors = await Doctors.find().sort({ createdAt: -1 }).select('-password');
            return doctors;

        } catch (error) {
            throw error
        }
    }



    async bookingList(page: string, date: string): Promise<{ bookings: IBooking[]; totalBookings: number; totalPages: number; } | null> {
        try {
            const formatDate = (today: string) => {
                const date = new Date(today);
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                const day = String(date.getUTCDate()).padStart(2, "0");
                return `${year}-${month}-${day}T00:00:00.000+00:00`;
            };
            const formattedDate = formatDate(date);
            const bookings = await Booking.find({ date: formattedDate })
                .populate({ path: "doctorId" })
                .populate({ path: "patientId" });
            const totalBookings = await Booking.find({
                date: formattedDate,
            }).countDocuments();
            const totalPages = Math.ceil(totalBookings / 10);
            return { bookings, totalBookings, totalPages };
        } catch (error) {
            throw error;
        }
    }

}