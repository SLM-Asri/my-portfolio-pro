import app from './app.js';
import environment from './config/environment.js';
import { ensureDatabase, pingDatabase } from './config/database.js';

async function bootstrap() {
  if (environment.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 characters.');
  }

  await ensureDatabase();
  const databaseReady = await pingDatabase();

  if (databaseReady) {
    console.log('MySQL connection is active.');
  } else {
    console.warn('MySQL not reachable. Backend started in fallback mode. Configure DB credentials to enable database persistence.');
  }

  const server = app.listen(environment.PORT, () => {
    console.log(`Portfolio backend running on http://localhost:${environment.PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${environment.PORT} is already in use. Stop the existing process or choose another port.`);
      process.exit(1);
    }

    console.error('Server error:', error);
    process.exit(1);
  });
}

bootstrap().catch((error) => {
  console.error('Server bootstrap failed:', error);
  process.exit(1);
});
