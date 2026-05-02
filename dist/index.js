"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const patientRoute_1 = require("./routes/patientRoute");
const doctorRoute_1 = require("./routes/doctorRoute");
const adminRoute_1 = require("./routes/adminRoute");
const messageRoute_1 = require("./routes/messageRoute");
const db_1 = __importDefault(require("./utils/db"));
const errorHandlingMiddleware_1 = __importDefault(require("./middleware/errorHandlingMiddleware"));
const socket_1 = require("./Socket/socket");
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app); // HTTP server setup
const corsOptions = {
    origin: ['https://doc-now-client.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
const PORT = process.env.PORT || 5000;
app.use('/api/patient', patientRoute_1.patientRoutes);
app.use('/api/doctor', doctorRoute_1.doctorRoutes);
app.use('/api/admin', adminRoute_1.adminRoutes);
app.use('/api/message', messageRoute_1.messageRoutes);
app.use(errorHandlingMiddleware_1.default);
// Initialize the Socket.io server
exports.io = (0, socket_1.initializeSocket)(server);
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
