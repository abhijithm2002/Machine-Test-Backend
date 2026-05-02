import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Patients, { Patient } from "../models/userModel";
import dotenv from 'dotenv'
import { join } from 'path';
import { Doctor } from "../models/doctorModel";


dotenv.config({path: join('./src', './env')})
// Define interfaces for decoded token and user
interface DecodedToken {
  userId?: string;
  email?: string;
}

type User = Doctor|Patient;


declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// @desc    To get user from decoded token
// @route   < Middleware - Helper >
// @access  Private
const verifyUser = (decodedToken: DecodedToken): Promise<Patient | null> => {
  return new Promise((resolve, reject) => {
    Patients.findOne({ _id: decodedToken?.userId })
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
const renewAccessToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      process.env.JWT_KEY_SECRET as string,
      { expiresIn: '8hr' },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
};

// @desc    User authentication
// @route   < Middleware >
// @access  Private
const protect = async (req: Request, res: Response, next: NextFunction) => {
  
  
  // WHEN WE HAVE AN ACCESS TOKEN
  if (req.headers.authorization) {
    try {
      let accessToken = req.header('authorization')?.split(' ')[1]
      accessToken = accessToken?.replace('"', ' ')
      // const accessToken = req.headers.authorization;
      console.log('accessToken', accessToken);

      
      if(accessToken) {
        const decoded = jwt.verify(accessToken, process.env.JWT_KEY_SECRET as string) as DecodedToken;
      verifyUser(decoded)
        .then((user) => {
          if (user) {
            if (!user.is_blocked) {
              req.user = user;
              next();
            } else {
              // User has been blocked
              res.status(401).json({
                message: "User has been blocked",
                status: 401,
                error_code: "FORBIDDEN",
              });
            }
          } else {
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
    } catch (e) {
      console.log(e);
      // Token verification failed
      res.status(401).json({
        message: "User not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }
  // WHEN WE HAVE NO ACCESS BUT REFRESH TOKEN
  } else {
    // No token provided
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
      noRefresh: true,
    });
  }
};

export default protect;

// @desc    To refresh access token
// @route   < POST /refresh-token >
// @access  Public
export const refreshAccessToken = (req: Request, res: Response) => {
  try {
    if (req.cookies) {
      console.log('refresg acess tokennnnn',req.cookies)
      const {refreshToken} = req.cookies;

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as DecodedToken; // decoding the refresh token
      console.log('decoded ref token', decodedRefreshToken);
      
      verifyUser(decodedRefreshToken)
        .then(async (user) => {
          console.log('hai');
          console.log('token user: ///',user);
          
          if (user && !user?.is_blocked) {
            const newAccessToken = await renewAccessToken(
              decodedRefreshToken?.userId as string
            );
            res.status(200).send({ accessToken: newAccessToken });
          } else {
            // User not found or is blocked
            res.status(401).json({
              message: "User not authorized",
              status: 401,
              error_code: "AUTHENTICATION_FAILED",
            });
          }
        })
        .catch((error) => {
          res.status(401).json({
            message: "User not authorized",
            status: 401,
            error_code: "AUTHENTICATION_FAILED",
            error,
          });
        });
    } else {
      // No token provided
      res.status(401).json({
        status: 401,
        message: "No token provided",
        error_code: "NO_TOKEN",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "User not authorized",
      status: 401,
      error_code: "AUTHENTICATION_FAILED",
      error,
    });
  }
};