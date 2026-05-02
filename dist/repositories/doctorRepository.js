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
const doctorModel_1 = __importDefault(require("../models/doctorModel"));
const slotModel_1 = __importDefault(require("../models/slotModel"));
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class doctorRepository {
    signupDoctor(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield doctorModel_1.default.findOne({ email: userData.email });
                if (user) {
                    return null;
                }
                return yield doctorModel_1.default.create(userData);
            }
            catch (err) {
                throw err;
            }
        });
    }
    doctorFetch(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, search, specialization, minPrice, maxPrice, state, experienceYears, }) {
            try {
                const skip = (page - 1) * limit;
                const query = {
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
                if (specialization)
                    query.expertise = specialization;
                if (state)
                    query['address.state'] = { $regex: state, $options: 'i' };
                if (experienceYears)
                    query.experienceYears = { $gte: experienceYears };
                // Fetch doctors and total count
                const [doctors, total] = yield Promise.all([
                    doctorModel_1.default.find(query).select('-password').skip(skip).limit(limit),
                    doctorModel_1.default.countDocuments(query),
                ]);
                return { doctors, total };
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchDoctor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield doctorModel_1.default.findOne({ _id: id }).select('-password');
            }
            catch (error) {
                throw error;
            }
        });
    }
    editSingleDoctor(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDoctor = yield doctorModel_1.default.findOneAndUpdate({ email: doctorData.email }, { $set: doctorData }, { new: true }).exec();
                return updatedDoctor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    insertSlots(slotsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promises = slotsData.map(slot => {
                    return slotModel_1.default.findOneAndUpdate({ doctorId: slot.doctorId, date: slot.date }, { shifts: slot.shifts, createdAt: slot.createdAt }, { upsert: true, new: true });
                });
                const result = yield Promise.all(promises);
                console.log('result in repo of updateing slots', result);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchSlots(id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = new Date(date);
                const endDate = new Date(date);
                endDate.setDate(endDate.getDate() + 1);
                const slots = yield slotModel_1.default.find({
                    doctorId: id,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }).exec();
                return slots;
            }
            catch (error) {
                throw new Error('Error fetching slots');
            }
        });
    }
    deleteSlots(slotId, selectedShifts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield slotModel_1.default.findById(slotId);
                if (!slot) {
                    return null;
                }
                slot.shifts = slot.shifts.filter(shift => !selectedShifts.includes(shift));
                const updatedSlot = yield slot.save();
                return updatedSlot;
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchDocuments(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctorModel_1.default.findOne({ email }).select('documents documents_verified');
                console.log(doctor);
                return doctor;
            }
            catch (error) {
                return null;
            }
        });
    }
    fetchAppointments(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const AppointmentData = yield bookingModel_1.default.find({ doctorId }).populate('patientId').sort({ date: -1 });
                return AppointmentData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getWalletHistory(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletData = yield doctorModel_1.default.findById(doctorId).select('WalletHistory Wallet').sort({ date: -1 });
                console.log(walletData);
                return walletData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bookingModel_1.default.findById(bookingId).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    appointments(date, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inputDate = new Date(date);
                const isoDateString = inputDate.toISOString().split("T")[0];
                console.log("inputdate", inputDate);
                console.log("isodatestring", isoDateString);
                return yield bookingModel_1.default.find({
                    date: isoDateString,
                    doctorId: doctorId,
                }).populate({ path: "patientId" });
            }
            catch (err) {
                throw err;
            }
        });
    }
    getNotification(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationData = yield notificationModel_1.default.find({
                    doctorId,
                    recipientType: "doctor"
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
                return updatedNotification;
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
}
exports.default = doctorRepository;
