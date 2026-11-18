import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import environment from '../config/environment.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.portfolio_admin_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, environment.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'portfolio-admin'
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  if (
    !decoded ||
    typeof decoded !== 'object' ||
    decoded.role !== 'admin' ||
    typeof decoded.sub !== 'string' ||
    !/^\d+$/.test(decoded.sub) ||
    typeof decoded.jti !== 'string'
  ) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  try {
    const admins = await query(
      `SELECT admins.id, admins.name, admins.email, admins.role
       FROM admin_sessions
       INNER JOIN admins ON admins.id = admin_sessions.admin_id
       WHERE admin_sessions.id = ?
         AND admin_sessions.admin_id = ?
         AND admin_sessions.expires_at > ?
         AND admins.is_active = 1
       LIMIT 1`,
      [decoded.jti, decoded.sub, Date.now()]
    );
    const admin = admins[0];

    if (!admin || admin.role !== 'admin' || admin.email !== decoded.email) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = admin;
    return next();
  } catch (error) {
    console.error('Admin authorization failed:', error);
    return res.status(503).json({ message: 'Authentication service is unavailable.' });
  }
}
