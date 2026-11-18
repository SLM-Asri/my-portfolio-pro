import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import environment from '../config/environment.js';
import validator from 'validator';

const cookieOptions = {
  httpOnly: true,
  secure: environment.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
};

function signToken(admin, sessionId, issuedAt) {
  return jwt.sign(
    { email: admin.email, role: 'admin', jti: sessionId, iat: issuedAt },
    environment.JWT_SECRET,
    { subject: String(admin.id), expiresIn: '24h', issuer: 'portfolio-admin' }
  );
}

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (
      !normalizedEmail ||
      normalizedEmail.length > 254 ||
      !validator.isEmail(normalizedEmail) ||
      typeof password !== 'string' ||
      password.length === 0 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({ message: 'Enter a valid email and password.' });
    }

    const rows = await query(
      'SELECT id, name, email, password_hash, role FROM admins WHERE email = ? AND is_active = 1 LIMIT 1',
      [normalizedEmail]
    );
    const admin = rows[0];

    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const sessionId = randomUUID();
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = (issuedAt + 24 * 60 * 60) * 1000;
    const token = signToken(admin, sessionId, issuedAt);
    await query('DELETE FROM admin_sessions WHERE expires_at <= ?', [Date.now()]);
    await query(
      'INSERT INTO admin_sessions (id, admin_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, admin.id, expiresAt]
    );
    res.cookie('portfolio_admin_token', token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

    return res.json({
      message: 'Login successful.',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin authentication failed:', error);
    return res.status(503).json({ message: 'Authentication service is unavailable.' });
  }
}

export async function logoutAdmin(req, res) {
  const token = req.cookies?.portfolio_admin_token;
  if (token) {
    let decoded;
    try {
      decoded = jwt.verify(token, environment.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'portfolio-admin',
        ignoreExpiration: true
      });
    } catch (error) {
      res.clearCookie('portfolio_admin_token', cookieOptions);
      return res.json({ message: 'Logged out successfully.' });
    }

    if (
      decoded &&
      typeof decoded === 'object' &&
      typeof decoded.jti === 'string' &&
      typeof decoded.sub === 'string'
    ) {
      try {
        await query('DELETE FROM admin_sessions WHERE id = ? AND admin_id = ?', [decoded.jti, decoded.sub]);
      } catch (error) {
        console.error('Admin logout failed:', error);
        res.clearCookie('portfolio_admin_token', cookieOptions);
        return res.status(503).json({ message: 'Unable to revoke the admin session.' });
      }
    }
  }

  res.clearCookie('portfolio_admin_token', cookieOptions);
  return res.json({ message: 'Logged out successfully.' });
}

export function getCurrentAdmin(req, res) {
  return res.json({
    admin: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
}
