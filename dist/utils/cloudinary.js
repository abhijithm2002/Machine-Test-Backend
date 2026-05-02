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
exports.uploadVoiceMessageToCloudinary = exports.uploadImageToCloudinary = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
dotenv_1.default.config();
const uploadImageToCloudinary = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    const cloud_name = process.env.CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    try {
        const formData = new form_data_1.default();
        formData.append("file", fs_1.default.createReadStream(imagePath));
        formData.append("upload_preset", process.env.UPLOAD_PRESET);
        // Axios request with proper headers for FormData
        const response = yield axios_1.default.post(url, formData, {
            headers: Object.assign(Object.assign({}, formData.getHeaders()), { "Content-Type": "multipart/form-data" }),
        });
        return response.data.secure_url;
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
const uploadVoiceMessageToCloudinary = (voicePath) => __awaiter(void 0, void 0, void 0, function* () {
    const cloud_name = process.env.CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;
    try {
        const formData = new form_data_1.default();
        formData.append("file", fs_1.default.createReadStream(voicePath));
        formData.append("upload_preset", process.env.UPLOAD_PRESET);
        // Axios request with proper headers for FormData
        const response = yield axios_1.default.post(url, formData, {
            headers: Object.assign(Object.assign({}, formData.getHeaders()), { "Content-Type": "multipart/form-data" }),
        });
        return response.data.secure_url;
    }
    catch (error) {
        console.error("Error uploading voice message to Cloudinary:", error);
        throw error;
    }
});
exports.uploadVoiceMessageToCloudinary = uploadVoiceMessageToCloudinary;
