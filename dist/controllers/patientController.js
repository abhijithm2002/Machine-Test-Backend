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
const patientService_1 = __importDefault(require("../services/patient/patientService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const doctorService_1 = __importDefault(require("../services/doctor/doctorService"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class patientController {
    constructor() {
        this._patientService = new patientService_1.default();
        this._doctorService = new doctorService_1.default();
        this._razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    signupPatient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, mobile, address, gender, password, photo, is_verified, role } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const data = { name, email, address, mobile, gender, password: hashedPassword, photo, role };
                const userData = yield this._patientService.signupPatient(data);
                return res.status(201).json({
                    message: "User data collected, proceed with OTP verification",
                    email,
                    data
                });
            }
            catch (error) {
                console.error('Error in signupPatient:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    editPatient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, photo, mobile, gender } = req.body;
                const userData = { name, email, photo, mobile, gender };
                const data = yield this._patientService.editPatient(userData);
                return res.status(200).json({ message: "Profile Updated", name, email, photo, mobile });
            }
            catch (error) {
                console.error('Error in editprofile:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    fetchDoctorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                console.log(id);
                const data = yield this._patientService.fetchDoctorDetails(id);
                if (data) {
                    return res.status(200).json({ message: "doctor details fetched successfull", data });
                }
                else {
                    return res.status(400).json({ message: 'fetching doctor details  Unsuccessfull' });
                }
            }
            catch (error) {
                console.error('Error in fetching doctor details :', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    fetchSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, date } = req.query;
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
    createPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, currency } = req.body;
            console.log('Amount:', amount);
            console.log('Currency:', currency);
            try {
                const options = {
                    amount: amount * 100,
                    currency,
                    receipt: `receipt_${Date.now()}`,
                    payment_capture: 1,
                };
                const order = yield this._razorpay.orders.create(options);
                console.log('Order Response:', order);
                if (!order || !order.id) {
                    return res.status(500).json({ message: 'Error creating order' });
                }
                res.status(200).json({ success: true, order });
            }
            catch (error) {
                console.error('Error in creating order:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    verifyPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { response } = req.body;
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
            console.log('razorpay signature', razorpay_signature);
            console.log('Received payment verification data:', req.body);
            try {
                const hmac = crypto_1.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
                hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
                const generatedSignature = hmac.digest('hex');
                if (generatedSignature === razorpay_signature) {
                    res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
                }
                else {
                    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
                }
            }
            catch (error) {
                console.error('Error in verifying payment:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    postBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { doctorId, userId, selectedShift, selectedDate, fee } = req.body;
                const userData = { doctorId, patientId: userId, shift: selectedShift, date: selectedDate, fee };
                console.log('body data', req.body);
                const data = yield this._patientService.postBooking(userData);
                if (data) {
                    return res.status(200).json({ message: 'slot booked successfull' });
                }
                else {
                    return res.status(400).json({ message: 'slot booking Unsuccessfull' });
                }
            }
            catch (error) {
                console.error('Error in booking slot:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    fetchBookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, date } = req.query;
                console.log('id', id);
                console.log('date...', date);
                const bookedSlots = yield this._patientService.fetchBookings(id, date);
                if (bookedSlots) {
                    return res.status(200).json({ message: 'slot fetched successfully', bookedSlots });
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
    myBookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId } = req.query;
                const data = yield this._patientService.myBookings(patientId);
                if (data) {
                    return res.status(200).json({ message: 'myBookings fetched successfully', data });
                }
                else {
                    return res.status(400).json({ message: 'myBookings fetched unsuccessfull' });
                }
            }
            catch (error) {
                console.error('Error in fetch my booking :', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    cancelBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.bookingId;
                console.log('booking id', bookingId);
                const data = yield this._patientService.cancelBooking(bookingId);
                if (data) {
                    return res.status(200).json({ message: 'cancelled  booking successfull' });
                }
                else {
                    return res.status(400).json({ message: 'cancel booking unsuccessfull' });
                }
            }
            catch (error) {
                console.error('Error in cancel booking :', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getWalletHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientId = req.params.patientId;
                const walletData = yield this._patientService.getWalletHistory(patientId);
                if (walletData) {
                    return res.status(200).json({ message: 'fetched user wallet history successfull', data: walletData });
                }
                else {
                    return res.status(400).json({ message: 'fetching user wallet history unsuccessfull' });
                }
            }
            catch (error) {
                console.error('Error in fetching wallet history :', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getBanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bannerData = yield this._patientService.getBanner();
                if (bannerData) {
                    return res.status(200).json({ message: 'fetched banner successfull', data: bannerData });
                }
                else {
                    return res.status(400).json({ message: 'fetching banner data unsuccessfull' });
                }
            }
            catch (error) {
                console.error('Error in fetching banner:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    addFavouriteDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId, doctorId } = req.body;
                console.log(patientId);
                console.log(doctorId);
                const message = yield this._patientService.addFavouriteDoctor(patientId, doctorId);
                return res.status(200).json({ message });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getFavouriteDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId } = req.params;
                const favouriteDoctors = yield this._patientService.getFavouriteDoctors(patientId);
                if (!favouriteDoctors) {
                    return res.status(404).json({ message: 'No favorite doctors found' });
                }
                console.log('favourite', favouriteDoctors);
                return res.status(200).json(favouriteDoctors);
            }
            catch (error) {
                console.error('Error fetching favourite doctors:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    fetchDoctorList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = '', specialization = '', minPrice, maxPrice, state, experienceYears, } = req.query;
                const { doctors, total } = yield this._patientService.fetchDoctorList({
                    page: Number(page),
                    limit: Number(limit),
                    search: String(search),
                    specialization: String(specialization),
                    minPrice: Number(minPrice),
                    maxPrice: Number(maxPrice),
                    state: String(state),
                    experienceYears: Number(experienceYears),
                });
                const totalPages = Math.ceil(total / Number(limit));
                return res.status(200).json({
                    doctorData: {
                        doctors,
                        total,
                        currentPage: Number(page),
                        totalPages,
                    },
                });
            }
            catch (error) {
                console.error('Error fetching doctor list:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    postRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId, doctorId, rating } = req.body;
                const ratingData = yield this._patientService.postRating(patientId, doctorId, rating);
                if (ratingData) {
                    res.status(200).json({ message: 'Rating sumbitted' });
                }
                else {
                    res.status(400).json({ message: 'Rating not sumbitted' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'internal server error' });
            }
        });
    }
    fetchAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield this._patientService.fetchAdmin();
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
    getNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientId = req.params.patientId;
                if (patientId) {
                    const notificationData = yield this._patientService.getNotification(patientId);
                    if (notificationData) {
                        res.status(200).json({ message: 'fetched user notification successfully', data: notificationData });
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
                const updatedNotification = yield this._patientService.markAsRead(notificationId);
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
    postContact(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, message } = req.body;
                const formData = { name, email, message };
                const contactData = yield this._patientService.postContact(formData);
                if (contactData) {
                    res.status(200).json({ message: 'contact data submitting successfull' });
                }
                else {
                    res.status(400).json({ message: 'submitting contact data unsuccessfull' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'internal server error' });
            }
        });
    }
}
exports.default = patientController;
