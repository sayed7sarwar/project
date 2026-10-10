import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/error.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));
app.use(generalLimiter);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`JanMati backend running on port ${config.port} (${config.nodeEnv})`);
});

export default app;
