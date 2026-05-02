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
const patientRepository_1 = __importDefault(require("../repositories/patientRepository"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("../middleware/jwt"));
const crypto_1 = __importDefault(require("crypto"));
const patientService_1 = __importDefault(require("../services/patient/patientService"));
const doctorService_1 = __importDefault(require("../services/doctor/doctorService"));
class VerificationController {
    constructor() {
        this._verificationService = new verificationService_1.default();
        this._patientRepository = new patientRepository_1.default();
        this._patientService = new patientService_1.default();
        this._doctorService = new doctorService_1.default();
    }
    generateOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Entered generateOtp controller method');
            try {
                const { email } = req.body;
                const otp = this._verificationService.generateOtp();
                yield this._verificationService.sendOtpEmail(email, 'Your OTP Code: ', otp);
                return res.status(200).json({ message: "OTP sent to email" });
            }
            catch (error) {
                console.error('Error in generateOtp:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    otpverify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Entered otpverify controller method');
            try {
                const { email, otp } = req.body;
                console.log("OTP verification payload:", req.body);
                console.log('userdata: ');
                const isVerified = yield this._verificationService.verifyOtp(email, otp);
                if (isVerified) {
                    return res.status(200).json({ message: "User verified" });
                }
                else {
                    return res.status(400).json({ message: "Verification failed" });
                }
            }
            catch (error) {
                console.error('Error in otpverify:', error);
                if (error instanceof AppError_1.default) {
                    return res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
            }
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Entered resendotp controller');
            try {
                const { email } = req.body;
                console.log('email', email);
                const otp = this._verificationService.generateOtp();
                yield this._verificationService.sendOtpEmail(email, "Your OTP Code: ", otp);
                return res.status(200).json({ message: 'New OTP send to mail' });
            }
            catch (error) {
                console.log('Error in resend Otp', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    patientLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const data = yield this._verificationService.patientLogin(email);
                if (!data) {
                    return res.status(400).json({ message: 'Email is incorrect', field: 'email' });
                }
                const password2 = data.password;
                const isMatch = yield bcrypt_1.default.compare(password, password2);
                if (!isMatch) {
                    return res.status(401).json({ message: "Password is incorrect", field: 'password' });
                }
                const { name, photo, is_blocked, _id } = data;
                if (is_blocked) {
                    return res.status(403).json({ message: 'User is blocked', field: 'general' });
                }
                let { refreshToken, accessToken } = yield (0, jwt_1.default)(data);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                return res.status(200).json({ message: 'Patient Logged in', user: data, accessToken });
            }
            catch (error) {
                console.log('Error during patient Login', error);
                next(error);
            }
        });
    }
    doctorLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const data = yield this._verificationService.doctorLogin(email);
                if (!data) {
                    return res.status(400).json({ message: 'Email is incorrect', field: 'email' });
                }
                const password2 = data.password;
                const isMatch = yield bcrypt_1.default.compare(password, password2);
                if (!isMatch) {
                    return res.status(401).json({ message: "Password is incorrect", field: 'password' });
                }
                const { name, photo, is_blocked, _id } = data;
                if (is_blocked) {
                    return res.status(403).json({ message: 'Doctor is blocked' });
                }
                let { refreshToken, accessToken } = yield (0, jwt_1.default)(data);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(200).json({ message: 'Doctor Logged in', doctor: data, accessToken });
            }
            catch (error) {
                console.log('Error during doctor Login', error);
                next(error);
            }
        });
    }
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const data = yield this._verificationService.adminLogin(email);
                if (!data || !data.is_admin) {
                    return res.status(400).json({ message: 'Email is incorrect', field: 'email' });
                }
                const password2 = data.password;
                const isMatch = yield bcrypt_1.default.compare(password, password2);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Password is incorrect', field: 'password' });
                }
                const { is_admin, name, photo, is_blocked, _id } = data;
                if (is_blocked) {
                    return res.status(403).json({ message: 'User is blocked' });
                }
                let tokens = yield (0, jwt_1.default)(data);
                return res.status(200).json({ message: 'Admin Logged in', email, name, photo, _id, tokens });
            }
            catch (error) {
                console.log('Error during admin Login', error);
                next(error);
            }
        });
    }
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('coming to google login controller');
            const { email, name } = req.body;
            console.log(email);
            console.log(name);
            if (typeof email !== 'string') {
                throw new Error('Invalid email format');
            }
            try {
                let data = yield this._verificationService.patientLogin(email);
                if (!data) {
                    const randomPassword = crypto_1.default.randomBytes(8).toString('hex');
                    const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
                    const newUser = {
                        email,
                        name,
                        password: hashedPassword,
                    };
                    data = yield this._patientService.signupPatient(newUser);
                }
                //@ts-ignore
                const { _id, photo, is_blocked } = data;
                if (is_blocked) {
                    return res.status(403).json({ message: 'User is blocked' });
                }
                let { refreshToken, accessToken } = yield (0, jwt_1.default)(data);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                return res.status(200).json({ message: 'Login successful', user: data, accessToken });
            }
            catch (error) {
                console.log('Error during Google Login', error);
                next(error);
            }
        });
    }
    doctorGoogleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('coming to doctor google login controller');
            const { email, name } = req.body;
            console.log(email);
            console.log(name);
            if (typeof email !== 'string') {
                throw new Error('Invalid email format');
            }
            try {
                let doctor = yield this._verificationService.doctorLogin(email);
                if (!doctor) {
                    const randomPassword = crypto_1.default.randomBytes(8).toString('hex');
                    const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
                    const newUser = {
                        email,
                        name,
                        password: hashedPassword,
                    };
                    doctor = yield this._doctorService.signupDoctor(newUser);
                }
                //@ts-ignore
                const { _id, photo, is_blocked } = doctor;
                if (is_blocked) {
                    return res.status(403).json({ message: 'Doctor is blocked' });
                }
                let { refreshToken, accessToken } = yield (0, jwt_1.default)(doctor);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                return res.status(200).json({ message: 'Login successful', doctor: doctor, accessToken });
            }
            catch (error) {
                console.log('Error during Google Login', error);
                next(error);
            }
        });
    }
}
exports.default = VerificationController;
