import { Router } from 'express';
import VerificationController from '../controllers/verificationController';
import adminController from '../controllers/adminController';
const router = Router();
const verificationController = new VerificationController();
const AdminController = new adminController()
import adminProtect,{refreshAdminAccessToken} from '../middleware/authAdmin';

router.post('/admin-login', verificationController.adminLogin.bind(verificationController));
router.get('/fetchUserList',adminProtect, AdminController.fetchUserList.bind(AdminController))
router.patch('/patient/:userId/blockUnblock',adminProtect, AdminController.blockUnblockPatient.bind(AdminController))
router.patch('/doctor/:userId/blockUnblock',adminProtect, AdminController.blockUnblockDoctor.bind(AdminController))
router.get('/fetchDoctorList',adminProtect, AdminController.fetchDoctorList.bind(AdminController))
router.get('/fetchDoctors',adminProtect, AdminController.fetchDoctors.bind(AdminController))
router.patch('/doctor/:doctorId/verify',adminProtect, AdminController.verifyDocuments.bind(AdminController))
router.post('/createBanner',adminProtect,AdminController.createBanner.bind(AdminController))
router.patch('/banner/:bannerId/blockUnblockBanner',adminProtect, AdminController.blockUnblockBanner.bind(AdminController))
router.get('/fetchBanner',adminProtect, AdminController.fetchBanner.bind(AdminController))
router.get('/bookings',adminProtect, AdminController.bookings.bind(AdminController))
router.get('/bookingList',adminProtect, AdminController.bookingList.bind(AdminController))
router.post('/refresh-token', refreshAdminAccessToken)
export const adminRoutes = router;
