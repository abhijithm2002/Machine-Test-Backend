"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    title2: { type: String, trim: true, default: '' },
    title3: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    imgUrl: { type: String, required: true },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)('Banner', bannerSchema);
