const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_DB_URI || process.env.DB_URI;
  if (!uri) {
    logger.error('[DB] Missing MONGODB_URI / DB_URI environment variable');
    process.exit(1);
  }

  try {
    // `useNewUrlParser` and `useUnifiedTopology` were no-ops from Mongoose 6 and were removed
    // in 8; the underlying driver now always behaves the way they used to request.
    await mongoose.connect(uri);
    logger.info('[DB] Connection successful');

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, '[DB] Connection error');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('[DB] Disconnected');
    });

    // Optional: graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('[DB] Connection closed due to app termination');
      process.exit(0);
    });
  } catch (err) {
    logger.error({ err }, '[DB] Failed to connect');
    process.exit(1);
  }
}

module.exports = { connectDB };
