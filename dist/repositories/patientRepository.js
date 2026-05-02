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
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const doctorModel_1 = __importDefault(require("../models/doctorModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const bannerModel_1 = __importDefault(require("../models/bannerModel"));
const index_1 = require("../index");
const socket_1 = require("../Socket/socket");
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const contactModel_1 = __importDefault(require("../models/contactModel"));
class PatientRepository {
    signupPatient(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userData.photo) {
                    const data = yield userModel_1.default.findOne({ email: userData.email });
                    if (data) {
                        return data;
                    }
                    else {
                        return yield userModel_1.default.create(userData);
                    }
                }
                const data = yield userModel_1.default.findOne({ email: userData.email });
                if (data) {
                    return null;
                }
                console.log(userData);
                return yield userModel_1.default.create(userData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    patientFetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.find().select('-password');
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchPatient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findOne({ _id: id }).select('-password');
            }
            catch (error) {
                throw error;
            }
        });
    }
    editSinglePatient(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userModel_1.default.findOne({ email: userData.email }).exec();
                console.log('response', response);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    postBooking(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAvailable = yield bookingModel_1.default.find();
                const doctor = yield doctorModel_1.default.findById(userData.doctorId);
                if (!doctor)
                    throw new Error(`Doctor not found with ID: ${userData.doctorId}`);
                const patient = yield userModel_1.default.findById(userData.patientId);
                if (!patient)
                    throw new Error("Patient not found.");
                if (userData.fee === undefined)
                    throw new Error("Booking fee not defined.");
                doctor.Wallet = doctor.Wallet || 0;
                patient.Wallet = patient.Wallet || 0;
                doctor.WalletHistory = doctor.WalletHistory || [];
                patient.WalletHistory = patient.WalletHistory || [];
                doctor.Wallet += userData.fee;
                doctor.WalletHistory.push({
                    date: new Date(),
                    amount: userData.fee,
                    message: `Booking fee received from ${patient.name}`,
                });
                const fee = userData.fee;
                if (patient.Wallet >= fee) {
                    patient.Wallet -= fee;
                    patient.WalletHistory.push({
                        date: new Date(),
                        amount: -fee,
                        message: "Booking fee deducted",
                    });
                }
                else {
                    patient.WalletHistory.push({
                        date: new Date(),
                        amount: -patient.Wallet,
                        message: "Booking fee deducted",
                    });
                    patient.Wallet = 0;
                }
                yield doctor.save();
                yield patient.save();
                const booking = yield bookingModel_1.default.create(userData);
                // Create notifications
                const doctorNotificationMessage = `New booking from ${patient.name} on ${userData.date}.`;
                const patientNotificationMessage = `Reminder: Your appointment with Dr. ${doctor.name} is scheduled on ${userData.date} at ${userData.shift}.`;
                const doctorNotification = new notificationModel_1.default({
                    doctorId: userData.doctorId,
                    patientId: userData.patientId,
                    message: doctorNotificationMessage,
                    recipientType: 'doctor'
                });
                yield doctorNotification.save();
                const patientNotification = new notificationModel_1.default({
                    doctorId: userData.doctorId,
                    patientId: userData.patientId,
                    message: patientNotificationMessage,
                    recipientType: 'patient'
                });
                yield patientNotification.save();
                const doctorSocketId = (0, socket_1.getReceiverSocketId)(doctor._id);
                const patientSocketId = (0, socket_1.getReceiverSocketId)(patient._id);
                if (booking) {
                    index_1.io.to(doctorSocketId).emit("newBooking", {
                        message: doctorNotificationMessage,
                        bookingDetails: booking,
                    });
                    index_1.io.to(patientSocketId).emit("appointmentReminder", {
                        message: patientNotificationMessage,
                        bookingDetails: booking,
                    });
                }
                return booking;
            }
            catch (err) {
                throw err;
            }
        });
    }
    fetchBookings(id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bookingModel_1.default.find({ doctorId: id, date: date }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    myBookings(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return bookingModel_1.default.find({ patientId: patientId })
                    .populate({
                    path: 'doctorId', populate: {
                        path: 'expertise'
                    },
                })
                    .sort({ updatedAt: -1 });
            }
            catch (error) {
                throw error;
            }
        });
    }
    cancelBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const booking = yield bookingModel_1.default.findOne({ _id: bookingId });
                if (!booking) {
                    throw new Error('booking not found');
                }
                const fee = booking.fee;
                const doctor = yield doctorModel_1.default.findById(booking.doctorId);
                const patient = yield userModel_1.default.findById(booking.patientId);
                if (doctor && fee !== undefined) {
                    doctor.Wallet = doctor.Wallet || 0;
                    doctor.Wallet -= fee;
                    (_a = doctor.WalletHistory) === null || _a === void 0 ? void 0 : _a.push({
                        date: new Date(),
                        amount: fee,
                        message: `Booking cancelled of patient ${patient.name}`
                    });
                    yield doctor.save();
                }
                if (patient && fee !== undefined) {
                    patient.Wallet = patient.Wallet || 0;
                    patient.Wallet += fee;
                    patient.WalletHistory.push({
                        date: new Date(),
                        amount: fee,
                        message: `Refund for booking cancelled from ${doctor.name}`
                    });
                    yield patient.save();
                }
                booking.status = 'Canceled';
                yield booking.save();
                console.log(booking);
                return booking;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getWalletHistory(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletData = yield userModel_1.default.findById(patientId).select('Wallet WalletHistory').sort({ "WalletHistory.date": -1 });
                return walletData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBanner() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerData = yield bannerModel_1.default.find({ status: true }).sort({ createdAt: -1 });
                return bannerData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addFavouriteDoctor(patientId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const patient = yield userModel_1.default.findById(patientId);
                if (!patient) {
                    throw new Error('patient not found');
                }
                patient.favourite_doctors = patient.favourite_doctors || [];
                const doctorObjectId = new mongoose_1.default.Types.ObjectId(doctorId);
                const isFavourite = (_a = patient.favourite_doctors) === null || _a === void 0 ? void 0 : _a.some((doctor) => doctor.equals(doctorObjectId));
                if (isFavourite) {
                    patient.favourite_doctors = patient.favourite_doctors.filter((favDoctorId) => !favDoctorId.equals(doctorObjectId));
                    yield patient.save();
                    return 'doctor removed from favourites';
                }
                else {
                    patient.favourite_doctors.push(doctorObjectId);
                    yield patient.save();
                    return 'doctor added to favourites';
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFavouriteDoctors(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield userModel_1.default.findById(patientId).populate('favourite_doctors');
                if (!patient) {
                    throw new Error('patient not found');
                }
                return patient.favourite_doctors || null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findOne({ is_admin: true });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getNotification(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationData = yield notificationModel_1.default.find({
                    patientId,
                    recipientType: "patient"
                }).sort({ createdAt: -1 }).exec();
                return notificationData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedNotification = yield notificationModel_1.default.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
                console.log(updatedNotification);
                return updatedNotification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    postContact(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(formData);
                return yield contactModel_1.default.create(formData);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PatientRepository;
