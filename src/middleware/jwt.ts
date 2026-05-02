import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join('./src', './env') });

export interface Payload {
  _id?: string;
  email?: string;
  userId?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const generateRefreshToken = (payload: Payload): Promise<string> => {
  return new Promise((resolve, reject) => {
    // ✅ Use plain string, TypeScript now accepts it safely
    const options: jwt.SignOptions = { expiresIn: '1d' };

    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      options,
      (err, refreshToken) => {
        if (err) {
          reject(err);
        } else {
          resolve(refreshToken as string);
        }
      }
    );
  });
};

const generateJwt = (data: Payload): Promise<Tokens> => {
  return new Promise((resolve, reject) => {
    try {
      const tokens: Tokens = { accessToken: '', refreshToken: '' };
      const options: jwt.SignOptions = { expiresIn: '8h' }; // ✅ changed to valid format
      const payload: Payload = {};

      if (data._id) {
        payload.userId = data._id as string;
      } else if (data.email) {
        payload.email = data.email;
      }

      jwt.sign(
        payload,
        process.env.JWT_KEY_SECRET as string,
        options,
        (err, accessToken) => {
          if (err) {
            reject(err);
          } else {
            tokens.accessToken = accessToken as string;

            generateRefreshToken(payload)
              .then((refreshToken) => {
                tokens.refreshToken = refreshToken;
                resolve(tokens);
              })
              .catch((err) => {
                reject(err);
              });
          }
        }
      );
    } catch (error) {
      reject(error);
      console.log('Error generating JWT', error);
    }
  });
};

export default generateJwt;
