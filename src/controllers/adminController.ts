import { Request, Response, NextFunction } from "express";
import VerificationService from "../services/patient/verificationService";
import { IadminController } from "./interfaces/IadminController";
import adminService from "../services/admin/adminService";
import { stat } from "fs";


export default class adminController implements IadminController {
    private _adminService: adminService
    private _verificationService: VerificationService
    constructor() {
        this._adminService = new adminService()
        this._verificationService = new VerificationService()
    }

    async fetchUserList(req: Request, res: Response, next: NextFunction) {
        console.log('entered fetchuserlist admin controller')
        try {
            const data = await this._adminService.fetchUserList()
            return res.status(200).json({ data })
        } catch (error) {
            throw error
        }
    }

    async blockUnblockPatient(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.body
            console.log(status)
            const { userId } = req.params
            console.log(userId)
            const data = await this._adminService.blockUnblockPatient(userId, status)
            if (data) {
                return res.status(200).json({ message: `Patient ${status ? 'blocked' : 'unblocked'} successfully`, data })
            } else {
                return res.status(500).json({ message: 'Internal server error' })
            }
        } catch (error) {
            throw error
        }
    }

    async blockUnblockDoctor(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.body
            console.log(status)
            const { userId } = req.params
            console.log(userId)
            const data = await this._adminService.blockUnblockDoctor(userId, status)
            if (data) {
                return res.status(200).json({ message: `Patient ${status ? 'blocked' : 'unblocked'} successfully`, data })
            } else {
                return res.status(500).json({ message: 'Internal server error' })
            }
        } catch (error) {
            throw error
        }
    }

    async fetchDoctorList(req: Request, res: Response, next: NextFunction) {
        try {
            const doctorData = await this._adminService.fetchDoctorList()
            return res.status(200).json({ doctorData })
        } catch (error) {
            throw error
        }
    }
    async fetchDoctors(req: Request, res: Response, next: NextFunction) {
        try {
            const doctorData = await this._adminService.fetchDoctors()
            return res.status(200).json({ doctorData })
        } catch (error) {
            throw error
        }
    }

    async verifyDocuments(req: Request, res: Response, next: NextFunction) {
        console.log('entered verifyDocuments controller')
        try {
            const { doctorId } = req.params;
            const doctorData = await this._adminService.verifyDocuments(doctorId)
            if (doctorData) {
                return res.status(200).json({ message: 'documents verified successfully', doctorData })
            } else {
                return res.status(400).json({ message: 'documents verification unsuccessfull' })

            }
        } catch (error) {
            throw error
        }
    }

    async createBanner(req: Request, res: Response, next: NextFunction) {
        console.log('banner controller')
        try {
            const { title, title2, title3, description, imgUrl } = req.body;
            console.log(req.body)
            const bannerData = { title, title2, title3, description, imgUrl }
            const data = await this._adminService.createBanner(bannerData);
            if (data) {
                return res.status(200).json({ message: 'banner created successfully' })
            } else {
                return res.status(400).json({ message: 'banner creation Unsucessfull' })
            }
        } catch (error) {
            throw error
        }
    }

    async blockUnblockBanner(req: Request, res: Response, next: NextFunction) {
        console.log('controller')
        try {
            const { bannerId } = req.params;
            const { status } = req.body
            console.log(bannerId, status)
            const data = await this._adminService.blockUnblockBanner(bannerId, status);
            if (data) {
                return res.status(200).json({ message: `Banner ${status ? 'blocked' : 'unblocked'} successfully`, data })
            } else {
                return res.status(500).json({ message: 'Internal server error' })
            }
        } catch (error) {
            throw error
        }
    }

    async fetchBanner(req: Request, res: Response, next: NextFunction) {
        try {
            const bannerData = await this._adminService.fetchBanner();
            if (bannerData) {
                return res.status(200).json({ message: 'fetched banner successfully', data: bannerData })
            } else {
                return res.status(400).json({ message: 'fetching banner unsuccessfull' })

            }
        } catch (error) {
            throw error
        }
    }

    async bookings(req: Request, res: Response, next: NextFunction) {
        try {
            const bookingData = await this._adminService.bookings();
            if (bookingData) {
                res.status(200).json({ message: 'fetched bookings successfull', bookings: bookingData })
            } else {
                res.status(400).json({ message: 'fetching bookings unsuccessfull' })
            }
        } catch (error) {
            res.status(500).json({ message: 'internal server error' })
        }
    }

    async bookingList(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, date } = req.query;
            const bookingData = await this._adminService.bookingList(page as string, date as string)
            if (bookingData) {
                res.status(200).json({
                    message: 'fetching booking list successfull',
                    bookings: bookingData.bookings,
                    totalPages: bookingData.totalPages,
                    totalBookings: bookingData.totalBookings
                })
            } else {
                res.status(400).json({ message: 'fetching booking list unsuccessfull' })
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal Error" });
        }
    }
}