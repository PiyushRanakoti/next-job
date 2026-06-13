import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL_TEST,
  process.env.CLIENT_URL_PROD,
  'http://192.168.1.3:5000'
];


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

export default app;
