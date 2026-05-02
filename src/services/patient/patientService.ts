import { Patient } from "../../models/userModel";
import { IpatientService } from "./interfaces/IpatientService";
import PatientRepository from "../../repositories/patientRepository";
import { Doctor } from "../../models/doctorModel";
import doctorRepository from "../../repositories/doctorRepository";
import { IBooking } from "../../models/bookingModel";
import { IBanner } from "../../models/bannerModel";
import mongoose from "mongoose";
import { INotifications } from "../../models/notificationModel";
import { IContact } from "../../models/contactModel";



export default class patientService implements IpatientService {
    private _patientRepository: PatientRepository
    private _doctorRespository: doctorRepository
    constructor() {
        this._patientRepository = new PatientRepository()
        this._doctorRespository = new doctorRepository()
    }

    async signupPatient(userData: Partial<Patient>): Promise<Patient | null> {
        try {
            return await this._patientRepository.signupPatient(userData)
        } catch (error) {
            throw error
        }
    }

    async editPatient(userData: Partial<Patient>): Promise<Patient | null> {
        console.log('coming to edit patient service');

        try {
            const data = await this._patientRepository.editSinglePatient(userData)
            console.log("updated", data)
            if (data) {
                data.name = userData.name ?? data.name
                data.email = userData.email ?? data.email
                data.mobile = userData.mobile ?? data.mobile
                data.photo = userData.photo ?? data.photo
                data.gender = userData.gender ?? data.gender
                console.log('updated', data);

                await data.save();
                return data;
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async fetchDoctorDetails(id: string): Promise<Doctor | null> {
        console.log('entered fetchDoctor details')
        try {
            return await this._doctorRespository.fetchDoctor(id)
        } catch (error) {
            throw error
        }
    }

    async postBooking(userData: Partial<IBooking>): Promise<IBooking | null> {
        console.log("entered postbooking service")
        try {
            return await this._patientRepository.postBooking(userData)

        } catch (error) {
            throw error
        }
    }

    async fetchBookings(id: string, date: string): Promise<IBooking[] | null> {
        console.log('entered fetch slots service')
        try {
            return await this._patientRepository.fetchBookings(id, date);
        } catch (error) {
            throw error
        }
    }

    async myBookings(patientId: string): Promise<IBooking[] | null> {
        console.log('entered my booking service')
        try {
            return await this._patientRepository.myBookings(patientId)
        } catch (error) {
            throw error
        }
    }

    // async myBookings(patientId: string, page: number, limit: number): Promise<{ data: IBooking[]; totalCount: number }> {
    //     console.log('Entered my bookings service');
    //     try {
    //         return await this._patientRepository.myBookings(patientId, page, limit);
    //     } catch (error) {
    //         throw error;
    //     }
    // }


    async cancelBooking(bookingId: string): Promise<IBooking | null> {
        try {
            return await this._patientRepository.cancelBooking(bookingId)
        } catch (error) {
            throw error
        }
    }

    async getWalletHistory(patientId: string): Promise<Patient | null> {
        try {
            return await this._patientRepository.getWalletHistory(patientId)
        } catch (error) {
            throw error
        }
    }

    async getBanner(): Promise<IBanner[] | null> {
        try {
            return await this._patientRepository.getBanner();

        } catch (error) {
            throw error
        }
    }

    async addFavouriteDoctor(patientId: string, doctorId: string): Promise<string> {
        try {
            const message = await this._patientRepository.addFavouriteDoctor(patientId, doctorId);
            return message;
        } catch (error) {
            throw error;
        }
    }

    async getFavouriteDoctors(patientId: string): Promise<mongoose.Types.ObjectId[] | null> {
        try {
            return await this._patientRepository.getFavouriteDoctors(patientId);
        } catch (error) {
            throw error
        }
    }

    // async fetchDoctorList(): Promise<Doctor[] | null> {
    //     try {
    //         return await this._doctorRespository.doctorFetch()
    //     } catch (error) {
    //         throw error
    //     }
    // }

    async fetchDoctorList({
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
            return await this._doctorRespository.doctorFetch({
                page,
                limit,
                search,
                specialization,
                minPrice,
                maxPrice,
                state,
                experienceYears
            });
        } catch (error) {
            throw error;
        }
    }




    async postRating(patientId: string, doctorId: string, rating: number): Promise<Doctor | null> {
        try {
            const doctor = await this._doctorRespository.fetchDoctor(doctorId)
            if (doctor) {
                if (!doctor?.review) {
                    doctor.review = []
                }
                const patientObjectId = new mongoose.Types.ObjectId(patientId);

                const existingReviewIndex = doctor?.review.findIndex((review) => review.patientId.toString() === patientObjectId.toString())

                if (existingReviewIndex > -1) {
                    doctor.review[existingReviewIndex].rating = rating;
                } else {
                    const newRating = {
                        patientId: patientObjectId,
                        rating
                    }
                    doctor?.review.push(newRating)
                }

                const totalRating = doctor?.review.reduce((acc, item) => acc + item.rating, 0);

                const averageRating = totalRating / doctor?.review.length;
                doctor.rating = averageRating;
                await doctor?.save();
                return doctor;
            } else {
                return null
            }

        } catch (error) {
            throw error
        }
    }

    async fetchAdmin(): Promise<Patient | null> {
        try {
            return await this._patientRepository.fetchAdmin();
        } catch (error) {
            throw error
        }
    }

    async getNotification(patientId: string): Promise<INotifications[] | null> {
        try {
            return await this._patientRepository.getNotification(patientId);
        } catch (error) {
            throw error
        }
    }

    async markAsRead(notificationId: string): Promise<INotifications | null> {
        try {
            return await this._patientRepository.markAsRead(notificationId)
        } catch (error) {
            throw error
        }
    }

    async postContact(formData: Partial<IContact>): Promise<IContact | null> {
        try {
          return  await this._patientRepository.postContact(formData)
        } catch (error) {
            throw error
        }
    }

}