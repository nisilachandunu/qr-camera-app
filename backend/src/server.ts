import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { config } from './config/index.js';
import { photoRoutes, statusRoutes } from './routes/index.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { socketService } from './services/SocketService.js';
import { printQueueService } from './services/PrintQueueService.js';
import { storageService } from './services/StorageService.js';

async function bootstrap(): Promise<void> {
  await printQueueService.load();
  await storageService.ensureDir();

  const app = express();
  const httpServer = createServer(app);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: config.frontendUrl,
      methods: ['GET', 'POST'],
    }),
  );
  app.use(express.json());

  app.use('/api', photoRoutes);
  app.use('/api', statusRoutes);

  app.use((_req, _res, next) => {
    next(new AppError(404, 'Not found'));
  });

  app.use(errorHandler);

  socketService.initialize(httpServer);

  httpServer.listen(config.port, () => {
    console.log(`Server running on ${config.baseUrl}`);
    console.log(`Frontend URL: ${config.frontendUrl}`);
    console.log(`Upload dir: ${config.uploadDir}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
