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
const bcrypt_1 = __importDefault(require("bcrypt"));
const doctorService_1 = __importDefault(require("../services/doctor/doctorService"));
class doctorController {
    constructor() {
        this._doctorService = new doctorService_1.default();
        this._verificationService = new verificationService_1.default;
    }
    signupDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('came to signupdoctor controller');
            try {
                const { name, email, mobile, address, gender, password, photo, is_verified, expertise, workingDays, currentWorkingHospital, dateOfBirth, languageKnown, education } = req.body;
                console.log('details body: ', req.body);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const data = { name, email, address, mobile, gender, password: hashedPassword, photo, expertise, workingDays, currentWorkingHospital, dateOfBirth, languageKnown, education };
                const userData = yield this._doctorService.signupDoctor(data);
                return res.status(201).json({
                    message: "User data collected, proceed with OTP verification",
                    email,
                    data
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    editDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, mobile, bio, gender, expertise, bookingfees, currentWorkingHospital, experienceYears, medicalLicenseNo, photo, documents, address, // Use the nested address object directly
                 } = req.body;
                const doctorData = {
                    name,
                    email,
                    mobile,
                    bio,
                    gender,
                    expertise,
                    bookingfees,
                    currentWorkingHospital,
                    experienceYears,
                    medicalLicenseNo,
                    photo,
                    documents,
                    address, // Keep it as an object
                };
                const updatedDoctor = yield this._doctorService.editDoctor(doctorData);
                if (updatedDoctor) {
                    return res.status(200).json({ message: 'Doctor Profile Updated', data: updatedDoctor });
                }
                else {
                    return res.status(404).json({ message: 'Doctor not found' });
                }
            }
            catch (error) {
                console.error('Error in editDoctor controller:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    uploadDocuments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered uploadDocuments controller');
            try {
                const { documents, email } = req.body;
                console.log('email', email);
                console.log('documents', documents);
                const doctorData = { documents, email };
                const data = yield this._doctorService.uploadDocuments(doctorData);
                if (data) {
                    return res.status(200).json({ message: "upload documents successfull", data });
                }
                else {
                    return res.status(400).json({ message: "documents failed to upload" });
                }
            }
            catch (error) {
                console.log('error in uploadDocuments', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    fetchDocuments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetchDocument controller');
            try {
                const email = req.query.email;
                console.log('email', email);
                const data = yield this._doctorService.fetchDocuments(email);
                if (data) {
                    return res.status(200).json({ message: 'fetched documents successfull', data });
                }
                else {
                    return res.status(400).json({ message: 'fetching documents Unsuccessfull', data });
                }
            }
            catch (error) {
                console.log('error in fetchingDocuments', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    updateSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered update slots controller');
            try {
                const slotsArray = req.body;
                console.log('//////////////////////////////////');
                console.log('body data', req.body);
                const updatedSlots = yield Promise.all(slotsArray.map((slotData) => __awaiter(this, void 0, void 0, function* () {
                    const { doctorId, day, startTime, endTime, duration, breakTime } = slotData;
                    console.log('slot data in controller', slotData);
                    const slotsData = {
                        doctorId,
                        startDate: day,
                        endDate: day,
                        startTime,
                        endTime,
                        duration,
                        breakTime
                    };
                    return yield this._doctorService.updateSlots(slotsData);
                })));
                return res.status(201).json({ message: 'slots update successful', data: updatedSlots });
            }
            catch (error) {
                console.log('error in updateslots', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    fetchSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetchSlots controller');
            try {
                const { id, date } = req.query;
                console.log('id', id);
                console.log('date...', date);
                const slots = yield this._doctorService.fetchSlots(id, date);
                if (slots) {
                    return res.status(200).json({ message: 'slot fetched successfully', slots });
                }
                else {
                    return res.status(400).json({ message: 'slot fetched unsuccessfull' });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered delete slots controller');
            try {
                const { slotId, selectedShifts } = req.body;
                const updatedSlots = yield this._doctorService.deleteSlots(slotId, selectedShifts);
                if (updatedSlots) {
                    return res.status(200).json({ message: 'slot deleted successfully', slot: updatedSlots });
                }
                else {
                    return res.status(400).json({ message: 'slot deletion unsuccessfull' });
                }
            }
            catch (error) {
                console.log('error in delete slots', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    fetchAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetchAppointments controller');
            try {
                const doctorId = req.params.doctorId;
                console.log(doctorId);
                const AppointmentData = yield this._doctorService.fetchAppointments(doctorId);
                if (AppointmentData) {
                    return res.status(200).json({ message: 'fetched Appointments successfully', data: AppointmentData });
                }
                else {
                    return res.status(400).json({ message: 'fetching Appointments unsuccessfull' });
                }
            }
            catch (error) {
                console.log('error in fetching Appointments', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    getWalletHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered wallet history controller');
            try {
                const doctorId = req.params.doctorId;
                console.log(doctorId);
                const data = yield this._doctorService.getWalletHistory(doctorId);
                if (data) {
                    return res.status(200).json({ message: 'fetched wallet history successfully', data });
                }
                else {
                    return res.status(400).json({ message: 'fetching wallet history unsuccessfull' });
                }
            }
            catch (error) {
                console.log('error in fetching wallet history', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    updateBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered update booking');
            try {
                const { bookingId } = req.body;
                console.log('booking id', bookingId);
                const data = yield this._doctorService.updateBooking(bookingId);
                if (data) {
                    return res.status(200).json({ message: 'updated booking successfully' });
                }
                else {
                    return res.status(400).json({ message: 'updating booking is unsuccessfull' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'internal server error' });
            }
        });
    }
    postPrescriptions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, prescriptions } = req.body;
                console.log('id', id);
                console.log('prescription', prescriptions);
                const prescriptionData = yield this._doctorService.postPrescription(id, prescriptions);
                if (prescriptionData) {
                    res.status(200).json({ message: 'prescription added successfully', prescriptionData });
                }
                else {
                    res.status(400).json({ message: 'prescription adding unsuccessfull' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    drAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { date, doctorId } = req.query;
                console.log('dr app', date, doctorId);
                const appointmentData = yield this._doctorService.appointments(date, doctorId);
                if (appointmentData) {
                    res.status(200).json({ message: 'fetched dr appointments successfull', appointments: appointmentData });
                }
                else {
                    res.status(400).json({ message: 'fetching dr appointments unsuccessfull' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'internal server error' });
            }
        });
    }
    getNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorId = req.params.doctorId;
                if (doctorId) {
                    const notificationData = yield this._doctorService.getNotification(doctorId);
                    if (notificationData) {
                        res.status(200).json({ message: 'fetched notification successfully', data: notificationData });
                    }
                    else {
                        res.status(400).json({ message: 'fetching notification unsuccessfull' });
                    }
                }
            }
            catch (error) {
                res.status(500).json({ message: 'internal server error' });
            }
        });
    }
    markAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationId } = req.params;
                console.log('notification id', notificationId);
                const updatedNotification = yield this._doctorService.markAsRead(notificationId);
                if (updatedNotification) {
                    return res.status(200).json({
                        success: true,
                        message: "Notification marked as read",
                        data: updatedNotification,
                    });
                }
                else {
                    return res.status(404).json({
                        success: false,
                        message: "Notification not found",
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update notification",
                    error: error
                });
            }
        });
    }
    fetchAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield this._doctorService.fetchAdmin();
                if (adminData) {
                    res.status(200).json({ message: 'fetched Admin details', data: adminData });
                }
                else {
                    res.status(400).json({ message: 'fetch admin details unsuccessfull' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = doctorController;
