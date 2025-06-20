import express from 'express';

import cors from 'cors';
import notFoundRoute from './app/middlewares/notFoundRoutes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://trusted-website.com', // Only allow this domain
    // Only allow GET/POST requests
    credentials: true, // Allow cookies/auth headers
  }),
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// application route
app.use('/api/v1', router);
// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFoundRoute);
// app.use(notFound);

export default app;
