import app from './app.js';
import { config } from './config.js';
import { connectDB, disconnectDB } from './db.js';

async function start() {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`mithila-art-api listening on http://localhost:${config.port}`);
    console.log(`Allowed client origin: ${config.clientOrigin}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down.`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
