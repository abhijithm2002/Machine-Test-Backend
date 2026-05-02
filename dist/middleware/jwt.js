"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
dotenv_1.default.config({ path: (0, path_1.join)('./src', './env') });
const generateRefreshToken = (payload) => {
    return new Promise((resolve, reject) => {
        // ✅ Use plain string, TypeScript now accepts it safely
        const options = { expiresIn: '1d' };
        jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, options, (err, refreshToken) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(refreshToken);
            }
        });
    });
};
const generateJwt = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const tokens = { accessToken: '', refreshToken: '' };
            const options = { expiresIn: '8h' }; // ✅ changed to valid format
            const payload = {};
            if (data._id) {
                payload.userId = data._id;
            }
            else if (data.email) {
                payload.email = data.email;
            }
            jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY_SECRET, options, (err, accessToken) => {
                if (err) {
                    reject(err);
                }
                else {
                    tokens.accessToken = accessToken;
                    generateRefreshToken(payload)
                        .then((refreshToken) => {
                        tokens.refreshToken = refreshToken;
                        resolve(tokens);
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }
            });
        }
        catch (error) {
            reject(error);
            console.log('Error generating JWT', error);
        }
    });
};
exports.default = generateJwt;
