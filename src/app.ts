import express from 'express';

import cors from 'cors';
import notFoundRoute from './app/middlewares/notFoundRoutes';
const app = express();
app.use(express.json());
app.use(cors({}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// not found route
app.use(notFoundRoute);
// app.use(notFound);
export default app;
