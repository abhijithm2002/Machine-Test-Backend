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
const adminRepository_1 = __importDefault(require("../../repositories/adminRepository"));
class adminService {
    constructor() {
        this._patientsRepository = new patientRepository_1.default;
        this._doctorRepository = new doctorRepository_1.default;
        this._adminRepository = new adminRepository_1.default;
    }
    fetchUserList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._patientsRepository.patientFetch();
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUnblockPatient(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('service block admin');
            try {
                const data = yield this._patientsRepository.fetchPatient(id);
                if (data) {
                    console.log('before', data);
                    data.is_blocked = status;
                    yield data.save();
                    console.log('after', data);
                    return data;
                }
                else {
                    console.log('elsee');
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUnblockDoctor(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorData = yield this._doctorRepository.fetchDoctor(id);
                if (doctorData) {
                    console.log('before', doctorData);
                    doctorData.is_blocked = status;
                    yield doctorData.save();
                    console.log('after', doctorData);
                    return doctorData;
                }
                else {
                    console.log('elsee');
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchDoctorList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.fetchDoctor();
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.fetchDoctors();
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyDocuments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered verifyDocuments service');
            try {
                const doctorData = yield this._doctorRepository.fetchDoctor(id);
                if (doctorData) {
                    doctorData.documents_verified = true;
                    console.log('verify Doctumentss', doctorData.documents_verified);
                    yield doctorData.save();
                    return doctorData;
                }
                else {
                    console.log('doctor data is not found');
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    createBanner(bannerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.createBanner(bannerData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUnblockBanner(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerData = yield this._adminRepository.fetchBanner(id);
                if (bannerData) {
                    bannerData.status = status;
                    yield bannerData.save();
                    return bannerData;
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
    fetchBanner() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.fetchBanners();
            }
            catch (error) {
                throw error;
            }
        });
    }
    bookings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.bookings();
            }
            catch (error) {
                throw error;
            }
        });
    }
    bookingList(page, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._adminRepository.bookingList(page, date);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = adminService;
