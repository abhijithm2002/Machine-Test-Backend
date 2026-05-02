import { Request, Response, NextFunction } from 'express';
import patientService from '../services/patient/patientService';
import bcrypt from 'bcrypt';
import { IpatientController } from './interfaces/IpatientController';
import doctorService from '../services/doctor/doctorService';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export default class patientController implements IpatientController {
  private _patientService: patientService;
  private _doctorService: doctorService
  private _razorpay: Razorpay;

  constructor() {
    this._patientService = new patientService();
    this._doctorService = new doctorService();
    this._razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async signupPatient(req: Request, res: Response, next: NextFunction) {
   
    try {
      const { name, email, mobile, address, gender, password, photo, is_verified, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = { name, email, address, mobile, gender, password: hashedPassword, photo, role };
      const userData = await this._patientService.signupPatient(data);
      return res.status(201).json({
        message: "User data collected, proceed with OTP verification",
        email,
        data
      });

    } catch (error) {
      console.error('Error in signupPatient:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async editPatient(req: Request, res: Response, next: NextFunction) {
   
    try {
      const { name, email, photo, mobile, gender } = req.body;
      const userData = { name, email, photo, mobile, gender }
      const data = await this._patientService.editPatient(userData);
      return res.status(200).json({ message: "Profile Updated", name, email, photo, mobile })
    } catch (error) {
      console.error('Error in editprofile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async fetchDoctorDetails(req: Request, res: Response, next: NextFunction) {
   
    try {
      const { id } = req.query
      console.log(id)
      const data = await this._patientService.fetchDoctorDetails(id as string)
      if (data) {
        return res.status(200).json({ message: "doctor details fetched successfull", data })
      } else {
        return res.status(400).json({ message: 'fetching doctor details  Unsuccessfull' })
      }
    } catch (error) {
      console.error('Error in fetching doctor details :', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async fetchSlots(req: Request, res: Response, next: NextFunction) {
 
    try {
      const { id, date } = req.query
      const slots = await this._doctorService.fetchSlots(id as string, date as string)
      if (slots) {
        return res.status(200).json({ message: 'slot fetched successfully', slots })
      } else {
        return res.status(400).json({ message: 'slot fetched unsuccessfull' })

      }
    } catch (error) {
      throw error
    }
  }

  async createPayment(req: Request, res: Response, next: NextFunction) {
  

    const { amount, currency } = req.body;
    console.log('Amount:', amount);
    console.log('Currency:', currency);

    try {
      const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await this._razorpay.orders.create(options);
      console.log('Order Response:', order);

      if (!order || !order.id) {
        return res.status(500).json({ message: 'Error creating order' });
      }

      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Error in creating order:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


  async verifyPayment(req: Request, res: Response, next: NextFunction) {
  

    const { response } = req.body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

    console.log('razorpay signature', razorpay_signature)
    console.log('Received payment verification data:', req.body);
    try {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature === razorpay_signature) {
        res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
      }
    } catch (error) {
      console.error('Error in verifying payment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


  async postBooking(req: Request, res: Response, next: NextFunction) {
  
    try {
      const { doctorId, userId, selectedShift, selectedDate, fee } = req.body
      const userData = { doctorId, patientId: userId, shift: selectedShift, date: selectedDate, fee }
      console.log('body data', req.body)
      const data = await this._patientService.postBooking(userData);
      if (data) {
        return res.status(200).json({ message: 'slot booked successfull' })
      } else {
        return res.status(400).json({ message: 'slot booking Unsuccessfull' })

      }
    } catch (error) {
      console.error('Error in booking slot:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  }

  async fetchBookings(req: Request, res: Response, next: NextFunction) {


    try {
      const { id, date } = req.query
      console.log('id', id)
      console.log('date...', date)
      const bookedSlots = await this._patientService.fetchBookings(id as string, date as string)
      if (bookedSlots) {
        return res.status(200).json({ message: 'slot fetched successfully', bookedSlots })
      } else {
        return res.status(400).json({ message: 'slot fetched unsuccessfull' })

      }
    } catch (error) {
      throw error
    }

  }

  async myBookings(req: Request, res: Response, next: NextFunction) {

    try {
      const { patientId } = req.query;
      const data = await this._patientService.myBookings(patientId as string)
      if (data) {
        return res.status(200).json({ message: 'myBookings fetched successfully', data })
      } else {
        return res.status(400).json({ message: 'myBookings fetched unsuccessfull' })

      }
    } catch (error) {
      console.error('Error in fetch my booking :', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }




  async cancelBooking(req: Request, res: Response, next: NextFunction) {
   
    try {
      const bookingId = req.params.bookingId
      console.log('booking id', bookingId);

      const data = await this._patientService.cancelBooking(bookingId)
      if (data) {
        return res.status(200).json({ message: 'cancelled  booking successfull' })
      } else {
        return res.status(400).json({ message: 'cancel booking unsuccessfull' })
      }
    } catch (error) {
      console.error('Error in cancel booking :', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  }

  async getWalletHistory(req: Request, res: Response, next: NextFunction) {
  
    try {
      const patientId = req.params.patientId;
      const walletData = await this._patientService.getWalletHistory(patientId);
      if (walletData) {
        return res.status(200).json({ message: 'fetched user wallet history successfull', data: walletData })
      } else {
        return res.status(400).json({ message: 'fetching user wallet history unsuccessfull' })
      }
    } catch (error) {
      console.error('Error in fetching wallet history :', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  }

  async getBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const bannerData = await this._patientService.getBanner();
      if (bannerData) {
        return res.status(200).json({ message: 'fetched banner successfull', data: bannerData })
      } else {
        return res.status(400).json({ message: 'fetching banner data unsuccessfull' })
      }
    } catch (error) {
      console.error('Error in fetching banner:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async addFavouriteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, doctorId } = req.body;
      console.log(patientId)
      console.log(doctorId)

      const message = await this._patientService.addFavouriteDoctor(patientId, doctorId);
      return res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getFavouriteDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.params;
      const favouriteDoctors = await this._patientService.getFavouriteDoctors(patientId);

      if (!favouriteDoctors) {
        return res.status(404).json({ message: 'No favorite doctors found' });
      }
      console.log('favourite', favouriteDoctors)
      return res.status(200).json(favouriteDoctors);
    } catch (error) {
      console.error('Error fetching favourite doctors:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }




  async fetchDoctorList(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        specialization = '',
        minPrice ,
        maxPrice ,
        state,
        experienceYears ,
    } = req.query;
    

        const { doctors, total } = await this._patientService.fetchDoctorList({
            page: Number(page),
            limit: Number(limit),
            search: String(search),
            specialization: String(specialization),
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            state: String(state),
            experienceYears: Number(experienceYears),
            
        });

        const totalPages = Math.ceil(total / Number(limit));

        return res.status(200).json({
            doctorData: {
                doctors,
                total,
                currentPage: Number(page),
                totalPages,
            },
        });
    } catch (error) {
        console.error('Error fetching doctor list:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}




  async postRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, doctorId, rating } = req.body;
      const ratingData = await this._patientService.postRating(patientId, doctorId, rating);
      if (ratingData) {
        res.status(200).json({ message: 'Rating sumbitted' })
      } else {
        res.status(400).json({ message: 'Rating not sumbitted' })

      }
    } catch (error) {
      res.status(500).json({ message: 'internal server error' })

    }
  }

  async fetchAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminData = await this._patientService.fetchAdmin();
      if (adminData) {
        res.status(200).json({ message: 'fetched Admin details', data: adminData })
      } else {
        res.status(400).json({ message: 'fetch admin details unsuccessfull' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })

    }
  }

  async getNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.params.patientId;
      if (patientId) {
        const notificationData = await this._patientService.getNotification(patientId as string)
        if (notificationData) {
          res.status(200).json({ message: 'fetched user notification successfully', data: notificationData })
        } else {
          res.status(400).json({ message: 'fetching notification unsuccessfull' })
        }
      }

    } catch (error) {
      res.status(500).json({ message: 'internal server error' })

    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { notificationId } = req.params
      console.log('notification id', notificationId);
      const updatedNotification = await this._patientService.markAsRead(notificationId as string);
      if (updatedNotification) {
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

  
  async postContact(req: Request, res: Response, next: NextFunction) {
    try {
      const {name, email, message} = req.body;
      const formData = {name, email, message}
      const contactData = await this._patientService.postContact(formData)
      if(contactData) {
        res.status(200).json({message: 'contact data submitting successfull'})
      } else {
        res.status(400).json({message: 'submitting contact data unsuccessfull'})
      }
    } catch (error) {
      res.status(500).json({message: 'internal server error'})
    }
  }
}