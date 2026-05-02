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
exports.refreshAdminAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
dotenv_1.default.config({ path: (0, path_1.join)('./src', '.env') });
// declare global {
//     namespace Express {
//       interface Request {
//         user?: User;
//       }
//     }
// }
// @desc    To get admin user from decoded token
// @route   < Middleware - Helper >
// @access  Private
const verifyAdmin = (decodedToken) => {
    return new Promise((resolve, reject) => {
        userModel_1.default.findOne({ _id: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId, is_admin: true })
            .select("-password")
            .then((user) => {
            resolve(user);
        })
            .catch((err) => reject(err));
    });
};
// @desc    To renew the access token for admin
// @route   < Middleware - Helper >
// @access  Private
const renewAdminAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWT_KEY_SECRET, { expiresIn: '8h' }, (err, token) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
// @desc    Admin authentication
// @route   < Middleware >
// @access  Private
const adminProtect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.headers.authorization) {
        try {
            let accessToken = (_a = req.header('authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            accessToken = accessToken === null || accessToken === void 0 ? void 0 : accessToken.replace('"', ' ');
            if (accessToken) {
                const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_KEY_SECRET);
                verifyAdmin(decoded)
                    .then((user) => {
                    if (user) {
                        if (!user.is_blocked) {
                            req.user = user;
                            next();
                        }
                        else {
                            res.status(403).json({
                                message: "Admin has been blocked",
                                status: 403,
                                error_code: "FORBIDDEN",
                            });
                        }
                    }
                    else {
                        res.status(404).json({
                            message: "Admin not found",
                            status: 404,
                            error_code: "NOT_FOUND",
                        });
                    }
                })
                    .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        message: "Internal Server Error",
                        status: 500,
                        error_code: "INTERNAL_SERVER_ERROR",
                        error,
                    });
                });
            }
        }
        catch (e) {
            console.log(e);
            res.status(401).json({
                message: "Admin not authorized",
                status: 401,
                error_code: "AUTHENTICATION_FAILED",
            });
        }
    }
    else {
        res.status(401).json({
            status: 401,
            message: "No token provided",
            error_code: "NO_TOKEN",
        });
    }
});
exports.default = adminProtect;
// @desc    To refresh access token for admin
// @route   < POST /admin/refresh-token >
// @access  Public
const refreshAdminAccessToken = (req, res) => {
    try {
        if (req.headers.authorization) {
            const refreshToken = req.headers.authorization;
            const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            verifyAdmin(decodedRefreshToken)
                .then((user) => __awaiter(void 0, void 0, void 0, function* () {
                if (user && !(user === null || user === void 0 ? void 0 : user.is_blocked)) {
                    const newAccessToken = yield renewAdminAccessToken(decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.userId);
                    res.status(200).send({ accessToken: newAccessToken });
                }
                else {
                    res.status(401).json({
                        message: "Admin not authorized",
                        status: 401,
                        error_code: "AUTHENTICATION_FAILED",
                    });
                }
            }))
                .catch((error) => {
                res.status(401).json({
                    message: "Admin not authorized",
                    status: 401,
                    error_code: "AUTHENTICATION_FAILED",
                    error,
                });
            });
        }
        else {
            res.status(401).json({
                status: 401,
                message: "No token provided",
                error_code: "NO_TOKEN",
            });
        }
    }
    catch (error) {
        res.status(401).json({
            message: "Admin not authorized",
            status: 401,
            error_code: "AUTHENTICATION_FAILED",
            error,
        });
    }
};
exports.refreshAdminAccessToken = refreshAdminAccessToken;
