"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const verificationController_1 = __importDefault(require("../controllers/verificationController"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const router = (0, express_1.Router)();
const verificationController = new verificationController_1.default();
const AdminController = new adminController_1.default();
const authAdmin_1 = __importStar(require("../middleware/authAdmin"));
router.post('/admin-login', verificationController.adminLogin.bind(verificationController));
router.get('/fetchUserList', authAdmin_1.default, AdminController.fetchUserList.bind(AdminController));
router.patch('/patient/:userId/blockUnblock', authAdmin_1.default, AdminController.blockUnblockPatient.bind(AdminController));
router.patch('/doctor/:userId/blockUnblock', authAdmin_1.default, AdminController.blockUnblockDoctor.bind(AdminController));
router.get('/fetchDoctorList', authAdmin_1.default, AdminController.fetchDoctorList.bind(AdminController));
router.get('/fetchDoctors', authAdmin_1.default, AdminController.fetchDoctors.bind(AdminController));
router.patch('/doctor/:doctorId/verify', authAdmin_1.default, AdminController.verifyDocuments.bind(AdminController));
router.post('/createBanner', authAdmin_1.default, AdminController.createBanner.bind(AdminController));
router.patch('/banner/:bannerId/blockUnblockBanner', authAdmin_1.default, AdminController.blockUnblockBanner.bind(AdminController));
router.get('/fetchBanner', authAdmin_1.default, AdminController.fetchBanner.bind(AdminController));
router.get('/bookings', authAdmin_1.default, AdminController.bookings.bind(AdminController));
router.get('/bookingList', authAdmin_1.default, AdminController.bookingList.bind(AdminController));
router.post('/refresh-token', authAdmin_1.refreshAdminAccessToken);
exports.adminRoutes = router;
