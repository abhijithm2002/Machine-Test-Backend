import { Router } from "express";
import VerificationController from "../controllers/verificationController";
import doctorController from "../controllers/doctorController";
import protectdoctor, { refreshAccessTokenDoctor } from "../middleware/authDoctor";




const router = Router();
const DoctorController = new doctorController();
const verificationController = new VerificationController();

router.post('/doctor-register', DoctorController.signupDoctor.bind(DoctorController));
router.post('/otp-generator', verificationController.generateOtp.bind(verificationController));
router.post('/otp-verify', verificationController.otpverify.bind(verificationController));
router.post('/resend-otp', verificationController.resendOtp.bind(verificationController))
router.post('/doctor-login', verificationController.doctorLogin.bind(verificationController))
router.post('/google-login', verificationController.doctorGoogleLogin.bind(verificationController))
router.patch('/edit-profile', protectdoctor, DoctorController.editDoctor.bind(DoctorController));
router.patch('/uploadDocuments', protectdoctor, DoctorController.uploadDocuments.bind(DoctorController))
router.post('/updateSlots', protectdoctor, DoctorController.updateSlots.bind(DoctorController))
router.get('/fetchSlots', protectdoctor, DoctorController.fetchSlots.bind(DoctorController))
router.patch('/deleteSlots', protectdoctor, DoctorController.deleteSlots.bind(DoctorController))
router.get('/getDocuments',protectdoctor,DoctorController.fetchDocuments.bind(DoctorController))
router.get('/fetchAppointments/:doctorId',protectdoctor,DoctorController.fetchAppointments.bind(DoctorController))
router.get('/wallet-history/:doctorId', protectdoctor,DoctorController.getWalletHistory.bind(DoctorController))
router.patch('/updateBooking', protectdoctor,DoctorController.updateBooking.bind(DoctorController))
router.post('/postPrescription', protectdoctor,DoctorController.postPrescriptions.bind(DoctorController))
router.get('/drAppointments', protectdoctor,DoctorController.drAppointments.bind(DoctorController))
router.get('/getNotification/:doctorId', protectdoctor,DoctorController.getNotification.bind(DoctorController))
router.patch('/markAsRead/:notificationId/read', protectdoctor,DoctorController.markAsRead.bind(DoctorController))
router.get('/fetchAdmin',DoctorController.fetchAdmin.bind(DoctorController))
router.post('/refresh-token', refreshAccessTokenDoctor)

export const doctorRoutes = router;
