/**
 * Input validation helpers for clean server-side data sanitization
 */

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Name must be at least 2 characters long.' });
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  next();
};

export const validateBookingDates = (req, res, next) => {
  const { checkIn, checkOut } = req.body;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ success: false, message: 'Both check-in and check-out dates are required.' });
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ success: false, message: 'Invalid check-in or check-out date format.' });
  }

  if (start < today) {
    return res.status(400).json({ success: false, message: 'Check-in date cannot be in the past.' });
  }

  if (end <= start) {
    return res.status(400).json({ success: false, message: 'Check-out date must be strictly after check-in date.' });
  }

  next();
};
