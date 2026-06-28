// Import Express framework to create the web server
import express from 'express';

// Import CORS middleware to allow requests from different origins
import cors from 'cors';

// Import Helmet middleware to add security-related HTTP headers
import helmet from 'helmet';

// Import Cookie Parser middleware to read cookies from incoming requests
import cookieParser from 'cookie-parser';

// Import Morgan middleware to log incoming requests and their response status/timing
import morgan from 'morgan';

// Load environment variables from the .env file
import 'dotenv/config';

// Import all application routes
import routes from './routes/index.js';

// Import global error handling middleware
import { errorHandler } from './middleware/error.middleware.js';

// Import environment configuration values
import { env } from './config/env.js';

// Create an Express application instance
const app = express();

// Enable security headers for better application security
app.use(helmet());

// Enable CORS and allow requests from the frontend URL with credentials (cookies, auth headers)
app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}));

// Log each request method/path/status/response time to the terminal
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies from incoming requests
app.use(cookieParser());

// Register all API routes under the '/api' base path
app.use('/api', routes);

// Register global error handling middleware (should be added after routes)
app.use(errorHandler);

// Export the configured Express application
export default app;