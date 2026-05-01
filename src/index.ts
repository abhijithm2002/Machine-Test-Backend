
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { patientRoutes } from './routes/patientRoute';
import { doctorRoutes } from './routes/doctorRoute';
import { adminRoutes } from './routes/adminRoute';
import { messageRoutes } from './routes/messageRoute';
import connectDB from './utils/db';
import errorHandlingMiddleware from './middleware/errorHandlingMiddleware';
import { initializeSocket } from './Socket/socket';


dotenv.config();
connectDB();

const app = express();
const server = createServer(app); // HTTP server setup

const corsOptions = {
  origin: ['https://doc-now-client.vercel.app','http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/message', messageRoutes);

app.use(errorHandlingMiddleware);

// Initialize the Socket.io server
export const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

