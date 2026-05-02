import Doctors, { Doctor } from "../models/doctorModel";
import { IdoctorRepository } from "./interfaces/IdoctorRepository";
import Slots, { ISlot } from "../models/slotModel";
import Booking, { IBooking } from "../models/bookingModel";
import   Notification, { INotifications } from "../models/notificationModel";
import Patients, { Patient } from "../models/userModel";

export default class doctorRepository implements IdoctorRepository {
    async signupDoctor(userData: Partial<Doctor>): Promise<Doctor | null> {
        try {
            let user = await Doctors.findOne({ email: userData.email })
            if (user) {
                return null
            }
            return await Doctors.create(userData);
        } catch (err) {
            throw err
        }
    }

    
    async doctorFetch({
        page,
        limit,
        search,
        specialization,
        minPrice,
        maxPrice,
        state,
        experienceYears,
    }: {
        page: number;
        limit: number;
        search: string;
        specialization: string;
        minPrice: number;
        maxPrice: number;
        state: string;
        experienceYears: number;
    }): Promise<{ doctors: Doctor[]; total: number }> {
        try {
            const skip = (page - 1) * limit;
    
            const query: any = {
                documents_verified: true,
                is_blocked: false,
            };
    
            if (minPrice || maxPrice < Infinity) {
                query.bookingfees = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
            }
    
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { expertise: { $regex: search, $options: 'i' } },
                ];
            }
    
            if (specialization) query.expertise = specialization;
            if (state) query['address.state'] = { $regex: state, $options: 'i' };
            if (experienceYears) query.experienceYears = { $gte: experienceYears };
    
            // Fetch doctors and total count
            const [doctors, total] = await Promise.all([
                Doctors.find(query).select('-password').skip(skip).limit(limit),
                Doctors.countDocuments(query),
            ]);
    
            return { doctors, total };
        } catch (error) {
            throw error;
        }
    }
    
    
    
    

    async fetchDoctor(id: string): Promise<Doctor | null> {
        try {
            return await Doctors.findOne({ _id: id }).select('-password')
        } catch (error) {
            throw error
        }
    }

    async editSingleDoctor(doctorData: Partial<Doctor>): Promise<Doctor | null> {
        try {
            const updatedDoctor = await Doctors.findOneAndUpdate(
                { email: doctorData.email },
                { $set: doctorData }, 
                { new: true }
            ).exec();
    
            return updatedDoctor;
        } catch (error) {
            throw error;
        }
    }
    
    

    async insertSlots(slotsData: ISlot[]): Promise<ISlot[] | null> {
        try {

            const promises = slotsData.map(slot => {
                return Slots.findOneAndUpdate(
                    { doctorId: slot.doctorId, date: slot.date },
                    { shifts: slot.shifts, createdAt: slot.createdAt },
                    { upsert: true, new: true }
                );
            });

            const result = await Promise.all(promises);
            console.log('result in repo of updateing slots', result)
            return result;

        } catch (error) {
            throw error;
        }
    }



    async fetchSlots(id: string, date: string): Promise<ISlot[] | null> {
        try {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);

            const slots = await Slots.find({
                doctorId: id,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            }).exec();

            return slots;
        } catch (error) {
            throw new Error('Error fetching slots');
        }
    }


    async deleteSlots(slotId: string, selectedShifts: string[]): Promise<ISlot | null> {
        try {
            const slot = await Slots.findById(slotId);

            if (!slot) {
                return null;
            }
            slot.shifts = slot.shifts.filter(shift => !selectedShifts.includes(shift));
            const updatedSlot = await slot.save();

            return updatedSlot;
        } catch (error) {
            throw error;
        }
    }

    async fetchDocuments(email: string): Promise<Doctor | null> {
        try {
            const doctor = await Doctors.findOne({ email }).select('documents documents_verified')
            console.log(doctor)
            return doctor

        } catch (error) {
            return null
        }
    }

    async fetchAppointments(doctorId: string): Promise<IBooking[] | null> {
        try {
            const AppointmentData = await Booking.find({ doctorId }).populate('patientId').sort({ date: -1 })
            return AppointmentData
        } catch (error) {
            throw error
        }
    }

    async getWalletHistory(doctorId: string): Promise<Doctor | null> {
        try {
            const walletData = await Doctors.findById(doctorId).select('WalletHistory Wallet').sort({date: -1})
            console.log(walletData);
            return walletData
        } catch (error) {
            throw error
        }
    }

    async updateBooking(bookingId: string): Promise<IBooking | null> {
        try {
            return await Booking.findById(bookingId).exec()

        } catch (error) {
            throw error
        }
    }

    async appointments(date: string, doctorId: string): Promise<IBooking[] | null> {
        try {
            const inputDate = new Date(date);
            const isoDateString = inputDate.toISOString().split("T")[0];
            console.log("inputdate", inputDate)
            console.log("isodatestring", isoDateString)
            return await Booking.find({
              date: isoDateString,
              doctorId: doctorId,
            }).populate({ path: "patientId" });
          } catch (err) {
            throw err;
          }
    }

    async getNotification(doctorId: string): Promise<INotifications[] | null> {
        try {
            const notificationData = await Notification.find({ 
                doctorId, 
                recipientType: "doctor"
            }).sort({ createdAt: -1 }).exec();
            return notificationData;
        } catch (error) {
            throw error;
        }
    }
    

    async markAsRead(notificationId: string): Promise<INotifications | null> {
        try {
            const updatedNotification = await Notification.findByIdAndUpdate(notificationId, 
                {isRead: true},
                {new: true}
            )
            return updatedNotification
        } catch (error) {
            throw error
        }
    }


    
    async fetchAdmin(): Promise<Patient | null> {
        try {
            return await Patients.findOne({ is_admin: true })
        } catch (error) {
            throw error
        }
    }
}

