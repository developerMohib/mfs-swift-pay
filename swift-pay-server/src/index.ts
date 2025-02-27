import express, { Application, NextFunction, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { agentRouter } from './routes/agentRoutes';
import path from 'path';
import { adnminRouter } from './routes/adminRoutes';
import { transectionRouter } from './routes/transactionRoutes';
import cookieParser from 'cookie-parser';
// parsers
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin:'https://mfs-swift-pay.vercel.app',
    credentials: true,
  }),
);

app.use('/admin', adnminRouter);
// my routes
app.use('/user', authRouter);

app.use('/all', userRouter);
app.use('/user', userRouter);

app.use('/all', agentRouter);
app.use('/agent', agentRouter);

app.use('/user', transectionRouter);

// server static files
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../public/', 'index.html'));
});

// Home route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('swiftPay server is ready');
});

// global route error handler
app.all('*', (req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    message: 'Route not found',
  });
});

// global error handler
type Err = string | number | undefined | null;
app.use((error: Err, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Server something went wrong',
    });
  }
  next();
});

export default app;
