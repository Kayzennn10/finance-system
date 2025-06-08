import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.error('Auth Error: No Authorization header provided.');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    console.error('Auth Error: Token format invalid or missing Bearer prefix.');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('Auth Success: Token decoded, user:', req.user);
    next();
  } catch (err) {
    console.error('Auth Error: Token verification failed.', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;
