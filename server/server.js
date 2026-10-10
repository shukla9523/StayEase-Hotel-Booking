import http from 'http';
import app from './app.js';
import config from './config/config.js';
import { connectDB, closeDB } from './config/db.js';
import Hotel from './models/Hotel.js';
import { seedDatabase } from './scripts/seed.js';

const startServer = async () => {
  try {
    console.log('[Server] Connecting to database...');
    await connectDB();

    // Auto-seed if database is currently empty
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      console.log('[Server] No hotels found in database. Auto-populating sample dataset...');
      await seedDatabase();
    } else {
      console.log(`[Server] Database contains ${hotelCount} hotels ready.`);
    }

    const server = http.createServer(app);

    server.listen(config.port, () => {
      console.log('----------------------------------------------------');
      console.log(`✨ StayEase Backend API running on http://localhost:${config.port}`);
      console.log(`✨ Environment: ${config.nodeEnv}`);
      console.log(`✨ Client URL: ${config.clientUrl}`);
      console.log(`✨ Health Check: http://localhost:${config.port}/api/health`);
      console.log('----------------------------------------------------');
    });

    const handleExit = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await closeDB();
        console.log('[Server] Shutdown complete.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleExit('SIGINT'));
    process.on('SIGTERM', () => handleExit('SIGTERM'));
  } catch (err) {
    console.error('[Server Start Error]:', err);
    process.exit(1);
  }
};

startServer();
