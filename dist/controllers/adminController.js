"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verificationService_1 = __importDefault(require("../services/patient/verificationService"));
const adminService_1 = __importDefault(require("../services/admin/adminService"));
class adminController {
    constructor() {
        this._adminService = new adminService_1.default();
        this._verificationService = new verificationService_1.default();
    }
    fetchUserList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetchuserlist admin controller');
            try {
                const data = yield this._adminService.fetchUserList();
                return res.status(200).json({ data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUnblockPatient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.body;
                console.log(status);
                const { userId } = req.params;
                console.log(userId);
                const data = yield this._adminService.blockUnblockPatient(userId, status);
                if (data) {
                    return res.status(200).json({ message: `Patient ${status ? 'blocked' : 'unblocked'} successfully`, data });
                }
                else {
                    return res.status(500).json({ message: 'Internal server error' });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUnblockDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.body;
                console.log(status);
                const { userId } = req.params;
                console.log(userId);
                const data = yield this._adminService.blockUnblockDoctor(userId, status);
                if (data) {
                    return res.status(200).json({ message: `Patient ${status ? 'blocked' : 'unblocked'} successfully`, data });
                }
                else {
                    return res.status(500).json({ message: 'Internal server error' });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchDoctorList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorData = yield this._adminService.fetchDoctorList();
                return res.status(200).json({ doctorData });
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorData = yield this._adminService.fetchDoctors();
                return res.status(200).json({ doctorData });
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyDocuments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered verifyDocuments controller');
            try {
                const { doctorId } = req.params;
                const doctorData = yield this._adminService.verifyDocuments(doctorId);
                if (doctorData) {
                    return res.status(200).json({ message: 'documents verified successfully', doctorData });
                }
                else {
                    return res.status(400).json({ message: 'documents verification unsuccessfull' });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    createBanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('banner controller');
            try {
                const { title, title2, title3, description, imgUrl } = req.body;
                console.log(req.body);
                const bannerData = { title, title2, title3, description, imgUrl };
                const data = yield this._adminService.createBanner(bannerData);
                if (data) {
                    return res.status(200).json({ message: 'banner created successfully' });
                }
                else {
                    return res.status(400).json({ message: 'banner creation Unsucessfull' });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUnblockBanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('controller');
            try {
                const { bannerId } = req.params;
                const { status } = req.body;
                console.log(bannerId, status);
                const data = yield this._adminService.blockUnblockBanner(bannerId, status);
                if (data) {
                    return res.status(200).json({ message: `Banner ${status ? 'blocked' : 'unblocked'} successfully`, data });
                }
                else {
                    return res.status(500).json({ message: 'Internal server error' });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchBanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerData = yield this._adminService.fetchBanner();
                if (bannerData) {
                    return res.status(200).json({ message: 'fetched banner successfully', data: bannerData });
                }
                else {
                    return res.status(400).json({ message: 'fetching banner unsuccessfull' });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    bookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = yield this._adminService.bookings();
                if (bookingData) {
                    res.status(200).json({ message: 'fetched bookings successfull', bookings: bookingData });
                }
                else {
                    res.status(400).json({ message: 'fetching bookings unsuccessfull' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'internal server error' });
            }
        });
    }
    bookingList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, date } = req.query;
                const bookingData = yield this._adminService.bookingList(page, date);
                if (bookingData) {
                    res.status(200).json({
                        message: 'fetching booking list successfull',
                        bookings: bookingData.bookings,
                        totalPages: bookingData.totalPages,
                        totalBookings: bookingData.totalBookings
                    });
                }
                else {
                    res.status(400).json({ message: 'fetching booking list unsuccessfull' });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal Error" });
            }
        });
    }
}
exports.default = adminController;
