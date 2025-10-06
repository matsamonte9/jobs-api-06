const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticateUser = async (req, res, next) => {
  // CHECK HEADER
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // ATTACH THE USER TO THE JOB ROUTES
    // const user = User.findById(payload.id).select('-password');
    // req.user = user;

    const { userId, name } = payload;
    req.user = { userId, name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
}

module.exports = authenticateUser;