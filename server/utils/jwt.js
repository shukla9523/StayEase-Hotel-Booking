import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const signToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const sendAuthTokenResponse = (res, user, statusCode = 200, message = 'Success') => {
  const token = signToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  const cookieOptions = {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'strict' : 'lax',
    maxAge: config.cookieMaxAge,
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token, // Also return in body for clients/scripts using Bearer token headers
    user: user.toSafeObject ? user.toSafeObject() : user,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'strict' : 'lax',
  });
};
