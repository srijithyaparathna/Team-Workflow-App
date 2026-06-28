import app from './src/app.js';
import { env } from './src/config/env.js';
import { testConnection } from './src/config/db.js';

const start = async () => {
  try {
    await testConnection();
    console.log('MySQL connected');
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }

  app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
};

start();
