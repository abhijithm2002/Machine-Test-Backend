import { Patient } from "../../models/userModel";
import { Doctor } from "../../models/doctorModel";
import { IadminService } from "./interface/IadminService";
import PatientRepository from "../../repositories/patientRepository";
import doctorRepository from "../../repositories/doctorRepository";
import { IBanner } from "../../models/bannerModel";
import adminRepository from "../../repositories/adminRepository";
import { IBooking } from "../../models/bookingModel";


export default class adminService implements IadminService {
   
    private _patientsRepository: PatientRepository
    private _doctorRepository: doctorRepository
    private _adminRepository: adminRepository
    constructor() {
       
        this._patientsRepository = new PatientRepository
        this._doctorRepository = new doctorRepository
        this._adminRepository = new adminRepository
    }
    async fetchUserList(): Promise<Patient[] | null> {
        try {
            return await this._patientsRepository.patientFetch();
        } catch (error) {
            throw error
        }
    }

    async blockUnblockPatient(id: string, status: boolean) {
        console.log('service block admin')
        try {
            const data = await this._patientsRepository.fetchPatient(id);
            if (data) {
                console.log('before', data)
                data.is_blocked = status;
                await data.save();
                console.log('after',data)
                return data;
            } else {
                console.log('elsee')
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    async blockUnblockDoctor(id: string, status: boolean): Promise<Doctor | null> {
        try {
            const doctorData = await this._doctorRepository.fetchDoctor(id);
            if (doctorData) {
                console.log('before', doctorData)
                doctorData.is_blocked = status;
                await doctorData.save();
                console.log('after',doctorData)
                return doctorData ;
            } else {
                console.log('elsee')
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    async fetchDoctorList(): Promise<Doctor[] | null> {
        try {
            return await this._adminRepository.fetchDoctor()
        } catch (error) {
            throw error
        }
    }

    async fetchDoctors(): Promise<Doctor[] | null> {
        try {
            return await this._adminRepository.fetchDoctors()
        } catch (error) {
            throw error
        }
    }
    async verifyDocuments(id: string): Promise<Doctor | null> {
        console.log('entered verifyDocuments service')
        try {
            const doctorData = await this._doctorRepository.fetchDoctor(id);
            if(doctorData) {
                doctorData.documents_verified = true;
                console.log('verify Doctumentss', doctorData.documents_verified)
                await doctorData.save();
                return doctorData
            } else {
                console.log('doctor data is not found')
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async createBanner(bannerData: Partial<IBanner>): Promise<IBanner | null> {
        try {
            return await this._adminRepository.createBanner(bannerData)
        } catch (error) {
            throw error
        }
    }

    async blockUnblockBanner(id: string, status: boolean): Promise<IBanner | null> {
        try {
            const bannerData =  await this._adminRepository.fetchBanner(id);
            if(bannerData) {
                bannerData.status = status;
                await bannerData.save();
                return bannerData
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async fetchBanner(): Promise<IBanner[] | null> {
        try {
            return await this._adminRepository.fetchBanners();

        } catch (error) {
            throw error
        }
    }

    async bookings(): Promise<IBooking[] | null> {
        try {
            return await this._adminRepository.bookings()
        } catch (error) {
            throw error
        }
    }

    async bookingList(page: string, date: string): Promise<{ bookings: IBooking[]; totalBookings: number; totalPages: number; } | null> {
        try {
            return await this._adminRepository.bookingList(page, date)
        } catch (error) {
            throw error
        }
    }
}