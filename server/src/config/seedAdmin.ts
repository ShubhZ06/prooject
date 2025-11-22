import bcrypt from 'bcryptjs';
import { User } from '../models/index';
import { env } from './env';

export const seedAdminUser = async () => {
  if (!env.adminEmail || !env.adminPassword) {
    console.log('Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set');
    return;
  }

  const email = env.adminEmail.toLowerCase();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists, skipping seed');
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  const fullName = env.adminFullName ?? 'Admin User';

  await User.create({
    fullName,
    email,
    passwordHash,
    role: 'manager',
  });

  console.log(`Seeded admin user with email: ${email}`);
};
