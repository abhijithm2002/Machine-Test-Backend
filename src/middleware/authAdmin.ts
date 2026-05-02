import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Patients, { Patient } from "../models/userModel";
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join('./src', '.env') });

// Define interfaces for decoded token and user
interface DecodedToken {
  userId?: string;
  email?: string;
}

// Ensure `User` is consistent with `Patient`
type User = Patient;

// declare global {
//     namespace Express {
//       interface Request {
//         user?: User;
//       }
//     }
// }

// @desc    To get admin user from decoded token
// @route   < Middleware - Helper >
// @access  Private
const verifyAdmin = (decodedToken: DecodedToken): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    Patients.findOne({ _id: decodedToken?.userId, is_admin: true })
      .select("-password")
      .then((user) => {
        resolve(user);
      })
      .catch((err) => reject(err));
  });
};

// @desc    To renew the access token for admin
// @route   < Middleware - Helper >
// @access  Private
const renewAdminAccessToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      process.env.JWT_KEY_SECRET as string,
      { expiresIn: '8h' },
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

// @desc    Admin authentication
// @route   < Middleware >
// @access  Private
const adminProtect = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    try {
      let accessToken = req.header('authorization')?.split(' ')[1];
      accessToken = accessToken?.replace('"', ' ');

      if (accessToken) {
        const decoded = jwt.verify(accessToken, process.env.JWT_KEY_SECRET as string) as DecodedToken;
        
        verifyAdmin(decoded)
          .then((user) => {
            if (user) {
              if (!user.is_blocked) {
                req.user = user;
                next();
              } else {
                res.status(403).json({
                  message: "Admin has been blocked",
                  status: 403,
                  error_code: "FORBIDDEN",
                });
              }
            } else {
              res.status(404).json({
                message: "Admin not found",
                status: 404,
                error_code: "NOT_FOUND",
              });
            }
          })
          .catch((error) => {
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
      res.status(401).json({
        message: "Admin not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
    });
  }
};

export default adminProtect;

// @desc    To refresh access token for admin
// @route   < POST /admin/refresh-token >
// @access  Public
export const refreshAdminAccessToken = (req: Request, res: Response) => {
  try {
    if (req.headers.authorization) {
      const refreshToken = req.headers.authorization;

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as DecodedToken;

      verifyAdmin(decodedRefreshToken)
        .then(async (user) => {
          if (user && !user?.is_blocked) {
            const newAccessToken = await renewAdminAccessToken(
              decodedRefreshToken?.userId as string
            );
            res.status(200).send({ accessToken: newAccessToken });
          } else {
            res.status(401).json({
              message: "Admin not authorized",
              status: 401,
              error_code: "AUTHENTICATION_FAILED",
            });
          }
        })
        .catch((error) => {
          res.status(401).json({
            message: "Admin not authorized",
            status: 401,
            error_code: "AUTHENTICATION_FAILED",
            error,
          });
        });
    } else {
      res.status(401).json({
        status: 401,
        message: "No token provided",
        error_code: "NO_TOKEN",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Admin not authorized",
      status: 401,
      error_code: "AUTHENTICATION_FAILED",
      error,
    });
  }
};
