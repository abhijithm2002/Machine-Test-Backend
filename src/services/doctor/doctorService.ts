import { Doctor } from "../../models/doctorModel";
import { IdoctorService } from "./interfaces/IdoctorService";
import doctorRepository from "../../repositories/doctorRepository";
import Slots, { ISlot } from "../../models/slotModel";
import { IBooking } from "../../models/bookingModel";
import { INotifications } from "../../models/notificationModel";
import { Patient } from "../../models/userModel";

export default class doctorService implements IdoctorService {
    private _doctorRepository: doctorRepository;
    constructor() {
        this._doctorRepository = new doctorRepository()
    }

    async signupDoctor(userData: Partial<Doctor>): Promise<Doctor | null> {
        try {
            return await this._doctorRepository.signupDoctor(userData)
        } catch (error) {
            throw error
        }
    }

    async editDoctor(doctorData: Partial<Doctor>): Promise<Doctor | null> {
        try {
            const updatedDoctor = await this._doctorRepository.editSingleDoctor(doctorData);
            return updatedDoctor || null;
        } catch (error) {
            console.error('Error in editDoctor service:', error);
            throw error;
        }
    }
    
    


    async uploadDocuments(doctorData: Partial<Doctor>): Promise<Doctor | null> {
        console.log('Entered upload Document service');
        try {
            const doctor = await this._doctorRepository.editSingleDoctor(doctorData);

            if (doctor) {
                doctor.documents = doctorData.documents || [];

                doctor.documents_verified = false;
                await doctor.save();
                return doctor;
            } else {
                throw new Error('Doctor not found');
            }
        } catch (error) {
            console.error('Error uploading documents:', error);
            throw error;
        }
    }

    async fetchDocuments(email: string): Promise<Doctor | null> {
        console.log('entered fetchDocuments service')
        try {
            return await this._doctorRepository.fetchDocuments(email)

        } catch (error) {
            throw error
        }
    }


    async updateSlots(slotsData: any): Promise<ISlot[] | null> {
        console.log('entered updateSlots service');
        try {
            const { doctorId, startDate, endDate, startTime, endTime, duration, breakTime } = slotsData;
            console.log('slotsData', slotsData);

            const start = new Date(startDate);
            const end = new Date(endDate);
            let currentDate = new Date(start);
            let allSlots: ISlot[] = [];

            const startTimeDate = new Date(startTime);
            const endTimeDate = new Date(endTime);

            while (currentDate <= end) {
                const daySlots: string[] = [];
                let shiftStart = new Date(currentDate);
                shiftStart.setHours(startTimeDate.getHours(), startTimeDate.getMinutes(), 0, 0);
                const shiftEnd = new Date(currentDate);
                shiftEnd.setHours(endTimeDate.getHours(), endTimeDate.getMinutes(), 0, 0);

                while (shiftStart < shiftEnd) {
                    let shiftEndTime = new Date(shiftStart.getTime() + duration * 60000);
                    if (shiftEndTime > shiftEnd) break;

                    const shiftStartFormatted = shiftStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    const shiftEndFormatted = shiftEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                    daySlots.push(`${shiftStartFormatted} - ${shiftEndFormatted}`);
                    shiftStart = new Date(shiftEndTime.getTime() + breakTime * 60000);
                }

                // Check if slot exists for the current date
                let slot = await Slots.findOne({
                    doctorId,
                    date: new Date(currentDate)
                });

                if (slot) {
                    // Update existing slot
                    slot.shifts = daySlots;
                    slot.createdAt = new Date(); // Optionally update createdAt
                    await slot.save();
                } else {
                    // Create new slot
                    slot = new Slots({
                        doctorId,
                        date: new Date(currentDate),
                        shifts: daySlots,
                        createdAt: new Date(),
                    });
                    allSlots.push(slot);
                }

                currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
            }

            // Save new slots
            if (allSlots.length > 0) {
                const savedSlots = await this._doctorRepository.insertSlots(allSlots);
                console.log('saved slots ////', savedSlots);
                return savedSlots;
            }

            return allSlots; // Return the updated slots

        } catch (error) {
            console.error('Error in updateSlots service:', error);
            throw error;
        }
    }



    async fetchSlots(id: string, date: string): Promise<ISlot[] | null> {
        console.log('entered fetch slots service')
        try {
            return await this._doctorRepository.fetchSlots(id, date);
        } catch (error) {
            throw error
        }
    }


    async deleteSlots(slotId: string, selectedShifts: string[]): Promise<ISlot | null> {
        console.log('entered delete slots service')
        try {
            return await this._doctorRepository.deleteSlots(slotId, selectedShifts)
        } catch (error) {
            throw error
        }
    }

    async fetchAppointments(doctorId: string): Promise<IBooking[] | null> {
        console.log('fetch appointment service')
        try {
            return await this._doctorRepository.fetchAppointments(doctorId)
        } catch (error) {
            throw error
        }
    }

    async getWalletHistory(doctorId: string): Promise<Doctor | null> {
        console.log('fetch wallt history service')
        try {
            return await this._doctorRepository.getWalletHistory(doctorId)
        } catch (error) {
            throw error
        }

    }

    async updateBooking(bookingId: string): Promise<IBooking | null> {
        try {
            const appointmentData = await this._doctorRepository.updateBooking(bookingId);
            console.log("appointmentData", appointmentData)
            if (appointmentData) {
                appointmentData.status = "Completed";
                await appointmentData?.save();
                return appointmentData;
            } else {
                return null;
            }
        } catch (error) {
            throw error
        }
    }

    async postPrescription(id: string, prescriptions: string[]): Promise<IBooking | null> {
        try {
            const prescriptionData = await this._doctorRepository.updateBooking(id);

            if (prescriptionData) {
                if (!Array.isArray(prescriptionData.prescription)) {
                    prescriptionData.prescription = [];
                }

                prescriptionData.prescription.push(...prescriptions);
                await prescriptionData.save();
            }

            return prescriptionData;
        } catch (error) {
            throw error;
        }
    }

    async appointments(date: string, doctorId: string): Promise<IBooking[] | null> {
        console.log('entered appointments service')
        try {
            return await this._doctorRepository.appointments(date, doctorId);
        } catch (error) {
            throw error;
        }
    }

    async getNotification(doctorId: string): Promise<INotifications[] | null> {
        try {
            return await this._doctorRepository.getNotification(doctorId);
        } catch (error) {
            throw error
        }
    }

    async markAsRead(notificationId: string): Promise<INotifications | null> {
        try {
            return await this._doctorRepository.markAsRead(notificationId)
        } catch (error) {
            throw error
        }
    }

    async fetchAdmin(): Promise<Patient | null> {
        try {
            return await this._doctorRepository.fetchAdmin();
        } catch (error) {
            throw error
        }
    }
}


