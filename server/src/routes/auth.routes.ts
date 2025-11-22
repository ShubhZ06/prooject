import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index';
import { signToken, AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, phone, location, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      location,
      ...(role ? { role } : {}),
    });

    const token = signToken(user.id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      id: user.id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      username: user.email.split('@')[0],
      role: user.role,
      phone: user.phone,
      location: user.location,
      joinedAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user.id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.lastLogin = new Date();
    await user.save();

    return res.json({
      id: user.id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      username: user.email.split('@')[0],
      role: user.role,
      phone: user.phone,
      location: user.location,
      joinedAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const { id, fullName, email, role, phone, location, createdAt } = req.user as any;

  // Expose renamed fields while keeping backwards compatibility
  return res.json({
    id,
    name: fullName,
    fullName,
    email,
    username: email.split('@')[0],
    role,
    phone,
    location,
    joinedAt: createdAt,
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res.json({ message: 'Logged out' });
});

export default router;
