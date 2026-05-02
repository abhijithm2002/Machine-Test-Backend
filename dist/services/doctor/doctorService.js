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
const doctorRepository_1 = __importDefault(require("../../repositories/doctorRepository"));
const slotModel_1 = __importDefault(require("../../models/slotModel"));
class doctorService {
    constructor() {
        this._doctorRepository = new doctorRepository_1.default();
    }
    signupDoctor(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._doctorRepository.signupDoctor(userData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    editDoctor(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDoctor = yield this._doctorRepository.editSingleDoctor(doctorData);
                return updatedDoctor || null;
            }
            catch (error) {
                console.error('Error in editDoctor service:', error);
                throw error;
            }
        });
    }
    uploadDocuments(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Entered upload Document service');
            try {
                const doctor = yield this._doctorRepository.editSingleDoctor(doctorData);
                if (doctor) {
                    doctor.documents = doctorData.documents || [];
                    doctor.documents_verified = false;
                    yield doctor.save();
                    return doctor;
                }
                else {
                    throw new Error('Doctor not found');
                }
            }
            catch (error) {
                console.error('Error uploading documents:', error);
                throw error;
            }
        });
    }
    fetchDocuments(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetchDocuments service');
            try {
                return yield this._doctorRepository.fetchDocuments(email);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateSlots(slotsData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered updateSlots service');
            try {
                const { doctorId, startDate, endDate, startTime, endTime, duration, breakTime } = slotsData;
                console.log('slotsData', slotsData);
                const start = new Date(startDate);
                const end = new Date(endDate);
                let currentDate = new Date(start);
                let allSlots = [];
                const startTimeDate = new Date(startTime);
                const endTimeDate = new Date(endTime);
                while (currentDate <= end) {
                    const daySlots = [];
                    let shiftStart = new Date(currentDate);
                    shiftStart.setHours(startTimeDate.getHours(), startTimeDate.getMinutes(), 0, 0);
                    const shiftEnd = new Date(currentDate);
                    shiftEnd.setHours(endTimeDate.getHours(), endTimeDate.getMinutes(), 0, 0);
                    while (shiftStart < shiftEnd) {
                        let shiftEndTime = new Date(shiftStart.getTime() + duration * 60000);
                        if (shiftEndTime > shiftEnd)
                            break;
                        const shiftStartFormatted = shiftStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                        const shiftEndFormatted = shiftEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                        daySlots.push(`${shiftStartFormatted} - ${shiftEndFormatted}`);
                        shiftStart = new Date(shiftEndTime.getTime() + breakTime * 60000);
                    }
                    // Check if slot exists for the current date
                    let slot = yield slotModel_1.default.findOne({
                        doctorId,
                        date: new Date(currentDate)
                    });
                    if (slot) {
                        // Update existing slot
                        slot.shifts = daySlots;
                        slot.createdAt = new Date(); // Optionally update createdAt
                        yield slot.save();
                    }
                    else {
                        // Create new slot
                        slot = new slotModel_1.default({
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
                    const savedSlots = yield this._doctorRepository.insertSlots(allSlots);
                    console.log('saved slots ////', savedSlots);
                    return savedSlots;
                }
                return allSlots; // Return the updated slots
            }
            catch (error) {
                console.error('Error in updateSlots service:', error);
                throw error;
            }
        });
    }
    fetchSlots(id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetch slots service');
            try {
                return yield this._doctorRepository.fetchSlots(id, date);
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteSlots(slotId, selectedShifts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered delete slots service');
            try {
                return yield this._doctorRepository.deleteSlots(slotId, selectedShifts);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchAppointments(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('fetch appointment service');
            try {
                return yield this._doctorRepository.fetchAppointments(doctorId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getWalletHistory(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('fetch wallt history service');
            try {
                return yield this._doctorRepository.getWalletHistory(doctorId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointmentData = yield this._doctorRepository.updateBooking(bookingId);
                console.log("appointmentData", appointmentData);
                if (appointmentData) {
                    appointmentData.status = "Completed";
                    yield (appointmentData === null || appointmentData === void 0 ? void 0 : appointmentData.save());
                    return appointmentData;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    postPrescription(id, prescriptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prescriptionData = yield this._doctorRepository.updateBooking(id);
                if (prescriptionData) {
                    if (!Array.isArray(prescriptionData.prescription)) {
                        prescriptionData.prescription = [];
                    }
                    prescriptionData.prescription.push(...prescriptions);
                    yield prescriptionData.save();
                }
                return prescriptionData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    appointments(date, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered appointments service');
            try {
                return yield this._doctorRepository.appointments(date, doctorId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getNotification(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._doctorRepository.getNotification(doctorId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._doctorRepository.markAsRead(notificationId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._doctorRepository.fetchAdmin();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = doctorService;
