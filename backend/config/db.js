const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error('[DB] Missing DB_URI environment variable');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[DB] Connection successful');

    mongoose.connection.on('error', (err) => {
      console.error('[DB] Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] Disconnected');
    });

    // Optional: graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('[DB] Connection closed due to app termination');
      process.exit(0);
    });
  } catch (err) {
    console.error('[DB] Failed to connect:', err);
    process.exit(1);
  }
}

module.exports = { connectDB };
