import mongoose from 'mongoose';

let mongoMemoryServerInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  try {
    if (uri && uri !== 'memory') {
      console.log(`[Database] Attempting connection to MongoDB at: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('[Database] MongoDB connected successfully.');
      return mongoose.connection;
    }
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection failed: ${err.message}.`);
  }

  // Graceful fallback to MongoMemoryServer for instant zero-config local execution
  try {
    console.log('[Database] Starting embedded MongoDB server...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServerInstance = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServerInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to embedded MongoDB successfully at: ${memoryUri}`);
    return mongoose.connection;
  } catch (embeddedErr) {
    console.error(`[Database] Failed to start embedded MongoDB: ${embeddedErr.message}`);
    throw embeddedErr;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServerInstance) {
    await mongoMemoryServerInstance.stop();
  }
};
