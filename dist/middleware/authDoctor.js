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
exports.refreshAccessTokenDoctor = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const doctorModel_1 = __importDefault(require("../models/doctorModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
dotenv_1.default.config({ path: (0, path_1.join)('./src', '.env') });
// declare global {
//   namespace Express {
//     interface Request {
//       user?: Doctor ;
//     }
//   }
// }
// @desc    To get user from decoded token
// @route   < Middleware - Helper >
// @access  Private
const verifyUser = (decodedToken) => {
    return new Promise((resolve, reject) => {
        doctorModel_1.default.findOne({ _id: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId })
            .select("-password")
            .then((user) => {
            resolve(user);
        })
            .catch((err) => reject(err));
    });
};
// @desc    To renew the access token
// @route   < Middleware - Helper >
// @access  Private
const renewAccessToken = (userId) => {
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
// @desc    User authentication
// @route   < Middleware >
// @access  Private
const protectdoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // WHEN WE HAVE AN ACCESS TOKEN
    if (req.headers.authorization) {
        try {
            let accessToken = (_a = req.header('authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            accessToken = accessToken === null || accessToken === void 0 ? void 0 : accessToken.replace('"', ' ');
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_KEY_SECRET);
            verifyUser(decoded)
                .then((user) => {
                if (user) {
                    if (!user.is_blocked) {
                        req.user = user;
                        next();
                    }
                    else {
                        // User has been blocked
                        res.status(401).json({
                            message: "User has been blocked",
                            status: 403,
                            error_code: "FORBIDDEN",
                        });
                    }
                }
                else {
                    // User not found
                    res.status(404).json({
                        message: "User not found",
                        status: 404,
                        error_code: "NOT_FOUND",
                    });
                }
            })
                .catch((error) => {
                // Handle database errors
                console.log(error);
                res.status(500).json({
                    message: "Internal Server Error",
                    status: 500,
                    error_code: "INTERNAL_SERVER_ERROR",
                    error,
                });
            });
        }
        catch (e) {
            console.log(e);
            // Token verification failed
            res.status(401).json({
                message: "User not authorized",
                status: 401,
                error_code: "AUTHENTICATION_FAILED",
            });
        }
        // WHEN WE HAVE NO ACCESS BUT REFRESH TOKEN
    }
    else {
        // No token provided
        res.status(401).json({
            status: 401,
            message: "No token provided",
            error_code: "NO_TOKEN",
            noRefresh: true,
        });
    }
});
exports.default = protectdoctor;
// @desc    To refresh access token
// @route   < POST /refresh-token >
// @access  Public
const refreshAccessTokenDoctor = (req, res) => {
    try {
        if (req.headers.authorization) {
            const refreshToken = req.headers.authorization;
            const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // decoding the refresh token
            verifyUser(decodedRefreshToken)
                .then((user) => __awaiter(void 0, void 0, void 0, function* () {
                if (user && !(user === null || user === void 0 ? void 0 : user.is_blocked)) {
                    const newAccessToken = yield renewAccessToken(decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.userId);
                    res.status(200).send({ newToken: newAccessToken });
                }
                else {
                    // User not found or is blocked
                    res.status(401).json({
                        message: "User not authorized",
                        status: 401,
                        error_code: "AUTHENTICATION_FAILED",
                    });
                }
            }))
                .catch((error) => {
                res.status(401).json({
                    message: "User not authorized",
                    status: 401,
                    error_code: "AUTHENTICATION_FAILED",
                    error,
                });
            });
        }
        else {
            // No token provided
            res.status(401).json({
                status: 401,
                message: "No token provided",
                error_code: "NO_TOKEN",
            });
        }
    }
    catch (error) {
        res.status(401).json({
            message: "User not authorized",
            status: 401,
            error_code: "AUTHENTICATION_FAILED",
            error,
        });
    }
};
exports.refreshAccessTokenDoctor = refreshAccessTokenDoctor;
