import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import joiErrors from './middlewares/joiErrors';
import * as statusCodes from './constants/statusCodes';

// Require our routes and passport into the application
import routers from './routes';
import passportAuth from './config/passport';

dotenv.config();
passportAuth(passport);

const apiPrefix = '/api';
const authPrefix = '/auth';

// Set up the express app
const app = express();

app.use(helmet());

// Configure cors
app.use(cors());

// Initialize passport with express
app.use(passport.initialize());

// Log request to the console
app.use(logger('dev'));

// Parse incoming requests data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add routes to the app
app.use(authPrefix, routers.authRouter());

// Add validation middleware
app.use(joiErrors);

app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of insanity',
  api_docs: 'Add postman link here'
}));

// Return 404 for nonexistent routes
app.use((req, res) => res.status(statusCodes.NOT_FOUND).send({
  statusCode: statusCodes.NOT_FOUND,
  success: false,
  errors: {
    message: 'Route not found'
  }
}));

export default app;
