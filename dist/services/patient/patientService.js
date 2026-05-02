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
const patientRepository_1 = __importDefault(require("../../repositories/patientRepository"));
const doctorRepository_1 = __importDefault(require("../../repositories/doctorRepository"));
const mongoose_1 = __importDefault(require("mongoose"));
class patientService {
    constructor() {
        this._patientRepository = new patientRepository_1.default();
        this._doctorRespository = new doctorRepository_1.default();
    }
    signupPatient(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.signupPatient(userData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    editPatient(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            console.log('coming to edit patient service');
            try {
                const data = yield this._patientRepository.editSinglePatient(userData);
                console.log("updated", data);
                if (data) {
                    data.name = (_a = userData.name) !== null && _a !== void 0 ? _a : data.name;
                    data.email = (_b = userData.email) !== null && _b !== void 0 ? _b : data.email;
                    data.mobile = (_c = userData.mobile) !== null && _c !== void 0 ? _c : data.mobile;
                    data.photo = (_d = userData.photo) !== null && _d !== void 0 ? _d : data.photo;
                    data.gender = (_e = userData.gender) !== null && _e !== void 0 ? _e : data.gender;
                    console.log('updated', data);
                    yield data.save();
                    return data;
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
    fetchDoctorDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetchDoctor details');
            try {
                return yield this._doctorRespository.fetchDoctor(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    postBooking(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("entered postbooking service");
            try {
                return yield this._patientRepository.postBooking(userData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchBookings(id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered fetch slots service');
            try {
                return yield this._patientRepository.fetchBookings(id, date);
            }
            catch (error) {
                throw error;
            }
        });
    }
    myBookings(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered my booking service');
            try {
                return yield this._patientRepository.myBookings(patientId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async myBookings(patientId: string, page: number, limit: number): Promise<{ data: IBooking[]; totalCount: number }> {
    //     console.log('Entered my bookings service');
    //     try {
    //         return await this._patientRepository.myBookings(patientId, page, limit);
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    cancelBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.cancelBooking(bookingId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getWalletHistory(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.getWalletHistory(patientId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBanner() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.getBanner();
            }
            catch (error) {
                throw error;
            }
        });
    }
    addFavouriteDoctor(patientId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield this._patientRepository.addFavouriteDoctor(patientId, doctorId);
                return message;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFavouriteDoctors(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.getFavouriteDoctors(patientId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async fetchDoctorList(): Promise<Doctor[] | null> {
    //     try {
    //         return await this._doctorRespository.doctorFetch()
    //     } catch (error) {
    //         throw error
    //     }
    // }
    fetchDoctorList(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, search, specialization, minPrice, maxPrice, state, experienceYears, }) {
            try {
                return yield this._doctorRespository.doctorFetch({
                    page,
                    limit,
                    search,
                    specialization,
                    minPrice,
                    maxPrice,
                    state,
                    experienceYears
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    postRating(patientId, doctorId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield this._doctorRespository.fetchDoctor(doctorId);
                if (doctor) {
                    if (!(doctor === null || doctor === void 0 ? void 0 : doctor.review)) {
                        doctor.review = [];
                    }
                    const patientObjectId = new mongoose_1.default.Types.ObjectId(patientId);
                    const existingReviewIndex = doctor === null || doctor === void 0 ? void 0 : doctor.review.findIndex((review) => review.patientId.toString() === patientObjectId.toString());
                    if (existingReviewIndex > -1) {
                        doctor.review[existingReviewIndex].rating = rating;
                    }
                    else {
                        const newRating = {
                            patientId: patientObjectId,
                            rating
                        };
                        doctor === null || doctor === void 0 ? void 0 : doctor.review.push(newRating);
                    }
                    const totalRating = doctor === null || doctor === void 0 ? void 0 : doctor.review.reduce((acc, item) => acc + item.rating, 0);
                    const averageRating = totalRating / (doctor === null || doctor === void 0 ? void 0 : doctor.review.length);
                    doctor.rating = averageRating;
                    yield (doctor === null || doctor === void 0 ? void 0 : doctor.save());
                    return doctor;
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
    fetchAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.fetchAdmin();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getNotification(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.getNotification(patientId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.markAsRead(notificationId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    postContact(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientRepository.postContact(formData);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = patientService;
