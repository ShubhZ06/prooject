import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from a single shared file (default: .env.local at project root)
// This works both in dev (ts-node, src/*) and in production (dist/*) because we resolve
// relative to the compiled file's directory.
const envFile = process.env.ENV_FILE || '.env.local';

dotenv.config({
  path: path.resolve(__dirname, '../../../', envFile),
});

const required = (value: string | undefined, name: string): string => {
  if (!value) throw new Error(`Missing required env var ${name}`);
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: required(process.env.MONGODB_URI, 'MONGODB_URI'),
  jwtSecret: required(process.env.JWT_SECRET, 'JWT_SECRET'),
  // In dev, Next runs on http://localhost:3000 and proxies /api to this server
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminFullName: process.env.ADMIN_FULL_NAME,
};
