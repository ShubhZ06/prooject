import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { seedAdminUser } from './config/seedAdmin';
import { seedDemoData } from './config/seedDemoData';

const start = async () => {
  await connectDB();
  await seedAdminUser();
  await seedDemoData();

  const server = http.createServer(app);

  server.listen(env.port, () => {
    console.log(`API server listening on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
