# 🩺 Doctor Appointment System - Backend

## 📌 Overview

This is the backend API for the Doctor Appointment System built using Node.js, Express, and MongoDB.

It handles:
- Authentication (User, Doctor, Admin)
- Appointment booking system
- Payment integration (Razorpay)
- Real-time chat (Socket.IO)
- Notifications
- Admin management system

---

## 🚀 Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt.js
- Socket.IO
- Multer (file uploads)
- Cloudinary (image storage)
- Razorpay (payments)

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <your-backend-repo-url>
cd backend
2. Install Dependencies
npm install
3. Create Environment Variables

Create .env file:

PORT=5000

MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=your_secret_key

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
4. Build Project (TypeScript)
npm run build
5. Run Server
npm start

Server runs on:

http://localhost:5000
📁 Project Structure
src/
├── config/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── middleware/
├── socket/
├── utils/
├── types/
├── server.ts


🔐 Authentication
JWT-based authentication
Role-based access:
Patient
Doctor
Admin

📡 API Endpoints


👤 Patient APIs
🔐 Authentication
POST /api/patient/user_register
POST /api/patient/otp-generator
POST /api/patient/otp-verify
POST /api/patient/resend-otp
POST /api/patient/login
POST /api/patient/google-login
POST /api/patient/refresh-token

👤 Profile
PATCH /api/patient/edit-profile   (Protected)

👨‍⚕️ Doctor Browsing
GET /api/patient/fetchDoctorDetails   (Protected)
GET /api/patient/fetchDoctorList      (Protected)
GET /api/patient/fetchSlots

📅 Booking & Payments
POST  /api/patient/create-payment     (Protected)
POST  /api/patient/verify-payment     (Protected)
POST  /api/patient/confirmBooking     (Protected)
GET   /api/patient/fetchBookings      (Protected)
GET   /api/patient/myBookings         (Protected)
PATCH /api/patient/cancelBooking/:bookingId   (Protected)

💰 Wallet

GET /api/patient/walletHistory/:patientId   (Protected)

❤️ Favorites

PATCH /api/patient/addToFavourites
GET   /api/patient/getFavouriteDoctors/:patientId

⭐ Ratings

POST /api/patient/postRating   (Protected)

🔔 Notifications

GET   /api/patient/getNotification/:patientId   (Protected)
PATCH /api/patient/markAsRead/:notificationId/read   (Protected)

📢 Others

GET  /api/patient/getBanner
GET  /api/patient/fetchAdmin
POST /api/patient/postContactData

💬 Message APIs

POST /api/message/send/:id/:senderId
GET  /api/message/conversations
POST /api/message/:id/:senderId

Supports:
Image upload
Voice messages

👨‍⚕️ Doctor APIs

🔐 Authentication
POST /api/doctor/doctor-register
POST /api/doctor/otp-generator
POST /api/doctor/otp-verify
POST /api/doctor/resend-otp
POST /api/doctor/doctor-login
POST /api/doctor/google-login
POST /api/doctor/refresh-token

👤 Profile
PATCH /api/doctor/edit-profile   (Protected)
PATCH /api/doctor/uploadDocuments   (Protected)
GET   /api/doctor/getDocuments   (Protected)

🕒 Slot Management
POST  /api/doctor/updateSlots   (Protected)
GET   /api/doctor/fetchSlots    (Protected)
PATCH /api/doctor/deleteSlots   (Protected)

📅 Appointments
GET   /api/doctor/fetchAppointments/:doctorId   (Protected)
GET   /api/doctor/drAppointments   (Protected)
PATCH /api/doctor/updateBooking   (Protected)

💰 Wallet
GET /api/doctor/wallet-history/:doctorId   (Protected)
📄 Prescriptions
POST /api/doctor/postPrescription   (Protected)

🔔 Notifications
GET   /api/doctor/getNotification/:doctorId   (Protected)
PATCH /api/doctor/markAsRead/:notificationId/read   (Protected)

📢 Others
GET /api/doctor/fetchAdmin


🛠 Admin APIs

🔐 Authentication
POST /api/admin/admin-login
POST /api/admin/refresh-token

👥 User Management
GET   /api/admin/fetchUserList
PATCH /api/admin/patient/:userId/blockUnblock

👨‍⚕️ Doctor Management

GET   /api/admin/fetchDoctorList
GET   /api/admin/fetchDoctors
PATCH /api/admin/doctor/:userId/blockUnblock
PATCH /api/admin/doctor/:doctorId/verify

🎯 Banner Management
POST  /api/admin/createBanner
PATCH /api/admin/banner/:bannerId/blockUnblockBanner
GET   /api/admin/fetchBanner

📅 Bookings
GET /api/admin/bookings
GET /api/admin/bookingList
🔐 Protected Routes

All protected routes require:

Authorization: Bearer <access_token>
📦 File Upload

Handled using Multer.

Used in:

POST /api/message/send/:id/:senderId

Fields:

voiceMessage
image
💬 Real-Time Features (Socket.IO)
Chat system
Typing indicator
Online users
Unread messages
Video call signaling

🗄 Database Collections
Users
Doctors
Bookings
Payments
Messages
Conversations
Banners
Reviews
Notifications

🔄 Payment Workflow
Create booking
Generate Razorpay order
Complete payment
Verify payment
Confirm booking

🌐 Deployment
Backend hosted on Render / AWS
Database: MongoDB Atlas
SSL: Let's Encrypt


⚠️ Important Notes
Allow MongoDB Atlas access (0.0.0.0/0)
Do not commit .env
Use HTTPS in production
Ensure correct CORS configuration
