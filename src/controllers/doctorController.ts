import { IdoctorController } from "./interfaces/IdoctorController";
import { Request, Response, NextFunction } from "express";
import VerificationService from "../services/patient/verificationService";
import bcrypt from 'bcrypt'
import generateJwt from "../middleware/jwt";
import { Payload } from "../middleware/jwt";
import doctorService from "../services/doctor/doctorService";

export default class doctorController implements IdoctorController {
    private _verificationService: VerificationService
    private _doctorService: doctorService
    constructor() {
        this._doctorService = new doctorService();
        this._verificationService = new VerificationService
    }

    async signupDoctor(req: Request, res: Response, next: NextFunction) {
        console.log('came to signupdoctor controller');

        try {
            const { name, email, mobile, address, gender, password, photo, is_verified, expertise, workingDays, currentWorkingHospital, dateOfBirth, languageKnown,education } = req.body;
            console.log('details body: ', req.body);
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = { name, email, address, mobile, gender, password: hashedPassword, photo, expertise, workingDays, currentWorkingHospital, dateOfBirth, languageKnown, education };
            const userData = await this._doctorService.signupDoctor(data);
            return res.status(201).json({
                message: "User data collected, proceed with OTP verification",
                email,
                data
            });

        } catch (error) {
            throw error
        }
    }

    async editDoctor(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                email,
                mobile,
                bio,
                gender,
                expertise,
                bookingfees,
                currentWorkingHospital,
                experienceYears,
                medicalLicenseNo,
                photo,
                documents,
                address, // Use the nested address object directly
            } = req.body;
            
            const doctorData = {
                name,
                email,
                mobile,
                bio,
                gender,
                expertise,
                bookingfees,
                currentWorkingHospital,
                experienceYears,
                medicalLicenseNo,
                photo,
                documents,
                address, // Keep it as an object
            };
            
    
            const updatedDoctor = await this._doctorService.editDoctor(doctorData);
    
            if (updatedDoctor) {
                return res.status(200).json({ message: 'Doctor Profile Updated', data: updatedDoctor });
            } else {
                return res.status(404).json({ message: 'Doctor not found' });
            }
        } catch (error) {
            console.error('Error in editDoctor controller:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    

    async uploadDocuments(req: Request, res: Response, next: NextFunction) {
        console.log('entered uploadDocuments controller')
        try {
            const {documents, email} = req.body;
            console.log('email',email)
            console.log('documents',documents)
            const doctorData = {documents, email};
            const data = await this._doctorService.uploadDocuments(doctorData)
            if(data) {
                return res.status(200).json({message: "upload documents successfull", data})
                
            } else {
                return res.status(400).json({message: "documents failed to upload"})
            }
        } catch (error) {
            console.log('error in uploadDocuments',error)
            res.status(500).json({message: 'Internal server error'})
        }
    }

    async fetchDocuments(req: Request, res: Response, next: NextFunction) {
        console.log('entered fetchDocument controller')
        try {
            const email = req.query.email as string;
            console.log('email', email)
            const data = await this._doctorService.fetchDocuments(email)
            if(data) {
                return res.status(200).json({message: 'fetched documents successfull', data})
            } else {
                return res.status(400).json({message: 'fetching documents Unsuccessfull', data})

            }
        } catch (error) {
            console.log('error in fetchingDocuments',error)
            res.status(500).json({message: 'Internal server error'})
        }
    }


    async updateSlots(req: Request, res: Response, next: NextFunction) {
        console.log('entered update slots controller');
        try {
            const slotsArray = req.body; 
            console.log('//////////////////////////////////')
            console.log('body data', req.body);
    
            const updatedSlots = await Promise.all(slotsArray.map(async (slotData: any) => {
                const { doctorId, day, startTime, endTime, duration, breakTime } = slotData;
                console.log('slot data in controller', slotData);
                
                const slotsData = {
                    doctorId,
                    startDate: day, 
                    endDate: day,   
                    startTime,
                    endTime,
                    duration,
                    breakTime
                };
                
                return await this._doctorService.updateSlots(slotsData);
            }));
    
            return res.status(201).json({ message: 'slots update successful', data: updatedSlots });
        } catch (error) {
            console.log('error in updateslots', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async fetchSlots(req: Request, res: Response, next: NextFunction) {
        console.log('entered fetchSlots controller')
        try {
            const {id,date}=req.query
            console.log('id',id)
            console.log('date...',date)
            const slots=await this._doctorService.fetchSlots(id as string,date as string)
            if(slots) {
                return res.status(200).json({message: 'slot fetched successfully', slots})
            } else {
                return res.status(400).json({message: 'slot fetched unsuccessfull'})

            }
        } catch (error) {
            throw error
        }
    }


    async deleteSlots(req: Request, res: Response, next: NextFunction) {
        console.log('entered delete slots controller')
        try {
            const {slotId, selectedShifts} = req.body;
            const updatedSlots = await this._doctorService.deleteSlots(slotId,selectedShifts)
            if(updatedSlots) {
                return res.status(200).json({message: 'slot deleted successfully',slot: updatedSlots})
            } else {
                return res.status(400).json({message: 'slot deletion unsuccessfull'})
            }
        } catch (error) {
            console.log('error in delete slots', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async fetchAppointments(req: Request, res: Response, next: NextFunction) {
        console.log('entered fetchAppointments controller');
        try {
            const doctorId = req.params.doctorId;
            console.log(doctorId)
            const AppointmentData = await this._doctorService.fetchAppointments(doctorId);
            if(AppointmentData) {
                return res.status(200).json({message: 'fetched Appointments successfully', data: AppointmentData})
            } else {
                return res.status(400).json({message: 'fetching Appointments unsuccessfull'})

            }
        } catch (error) {
            console.log('error in fetching Appointments', error);
            res.status(500).json({ message: 'Internal server error' });
        }
        
    }
    
    async getWalletHistory(req: Request, res: Response, next: NextFunction) {
        console.log('entered wallet history controller');
        try {
            const doctorId = req.params.doctorId;
            console.log(doctorId)
            const data = await this._doctorService.getWalletHistory(doctorId);
            if(data) {
                return res.status(200).json({message: 'fetched wallet history successfully', data})
            } else {
                return res.status(400).json({message: 'fetching wallet history unsuccessfull'})
            }
        } catch (error) {
            console.log('error in fetching wallet history', error);
            res.status(500).json({ message: 'Internal server error' });
        }
        
    }


    async updateBooking(req: Request, res: Response, next: NextFunction) {
        console.log('entered update booking');
        try {
        const {bookingId} = req.body
        console.log('booking id', bookingId);
        const data = await this._doctorService.updateBooking(bookingId as string)
        if(data) {
            return res.status(200).json({message: 'updated booking successfully'})
        } else {
            return res.status(400).json({message: 'updating booking is unsuccessfull'})
        }
        } catch (error) {
            res.status(500).json({message: 'internal server error'})
        }
        
    }
    
    async postPrescriptions(req: Request, res: Response, next: NextFunction){
        try {
            const {id, prescriptions} = req.body;
            console.log('id', id);
            console.log('prescription', prescriptions);
            const prescriptionData = await this._doctorService.postPrescription(id, prescriptions)
            if(prescriptionData) {
                res.status(200).json({message: 'prescription added successfully',prescriptionData})
            } else {
                res.status(400).json({message: 'prescription adding unsuccessfull'})
            }
        } catch (error) {
            res.status(500).json({message: 'Internal server error'})
            
        }
    }

    async drAppointments(req: Request, res: Response, next: NextFunction) {
        try {
            const {date, doctorId} = req.query;
            console.log('dr app', date, doctorId)
            const appointmentData = await this._doctorService.appointments(date as string, doctorId as string);
            if(appointmentData) {
                res.status(200).json({message: 'fetched dr appointments successfull', appointments: appointmentData})
            } else {
                res.status(400).json({message: 'fetching dr appointments unsuccessfull'})

            }
        } catch (error) { 
            res.status(500).json({message: 'internal server error'})
            
        }
    }

    async getNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const doctorId = req.params.doctorId;
            if(doctorId) {
                const notificationData = await this._doctorService.getNotification(doctorId as string)
                if(notificationData) {
                    res.status(200).json({message: 'fetched notification successfully', data: notificationData})
                } else {
                res.status(400).json({message: 'fetching notification unsuccessfull'})
                }
            }

        } catch (error) {
            res.status(500).json({message: 'internal server error'})
            
        }
    }

    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const {notificationId} = req.params
            console.log('notification id', notificationId);
            const updatedNotification  = await this._doctorService.markAsRead(notificationId as string);
            if(updatedNotification) {
                return res.status(200).json({
                    success: true,
                    message: "Notification marked as read",
                    data: updatedNotification,
                  });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found",
                  });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to update notification",
                error: error
              });
        }
    }

    async fetchAdmin(req: Request, res: Response, next: NextFunction) {
        try {
          const adminData = await this._doctorService.fetchAdmin();
          if (adminData) {
            res.status(200).json({ message: 'fetched Admin details', data: adminData })
          } else {
            res.status(400).json({ message: 'fetch admin details unsuccessfull' })
          }
        } catch (error) {
          res.status(500).json({ message: 'Internal server error' })
    
        }
      }
}


