import { Router } from 'express';
import patientController from '../controllers/patientController';
import { parseArgs } from 'util';
import VerificationController from '../controllers/verificationController';
import { refreshAccessToken } from '../middleware/authMiddleware';
import protect from '../middleware/authMiddleware'


const router = Router();
const PatientController = new patientController();
const verificationController = new VerificationController()

router.post('/user_register', PatientController.signupPatient.bind(PatientController));
router.post('/otp-generator', verificationController.generateOtp.bind(verificationController))
router.post('/otp-verify', verificationController.otpverify.bind(verificationController))
router.post('/resend-otp', verificationController.resendOtp.bind(verificationController))
router.post('/login', verificationController.patientLogin.bind(verificationController))
router.post('/google-login', verificationController.googleLogin.bind(verificationController));
router.post('/refresh-token', refreshAccessToken)
router.patch('/edit-profile',protect, PatientController.editPatient.bind(PatientController))
router.get('/fetchDoctorDetails', protect, PatientController.fetchDoctorDetails.bind(PatientController))
router.get('/fetchSlots', PatientController.fetchSlots.bind(PatientController))
router.post('/create-payment', protect, PatientController.createPayment.bind(PatientController));
router.post('/verify-payment', protect, PatientController.verifyPayment.bind(PatientController));
router.post('/confirmBooking', protect, PatientController.postBooking.bind(PatientController));
router.get('/fetchBookings', protect, PatientController.fetchBookings.bind(PatientController));
router.get('/myBookings', protect, PatientController.myBookings.bind(PatientController));
router.patch('/cancelBooking/:bookingId', protect, PatientController.cancelBooking.bind(PatientController))
router.get('/walletHistory/:patientId', protect, PatientController.getWalletHistory.bind(PatientController))
router.get('/getBanner', PatientController.getBanner.bind(PatientController))
router.patch('/addToFavourites', PatientController.addFavouriteDoctor.bind(PatientController))
router.get('/getFavouriteDoctors/:patientId', PatientController.getFavouriteDoctors.bind(PatientController))
router.get('/fetchDoctorList',protect, PatientController.fetchDoctorList.bind(PatientController))
router.post('/postRating',protect, PatientController.postRating.bind(PatientController))
router.get('/fetchAdmin', PatientController.fetchAdmin.bind(PatientController))
router.get('/getNotification/:patientId',protect, PatientController.getNotification.bind(PatientController))
router.patch('/markAsRead/:notificationId/read',protect, PatientController.markAsRead.bind(PatientController))
router.post('/postContactData', PatientController.postContact.bind(PatientController))



export const patientRoutes = router;
