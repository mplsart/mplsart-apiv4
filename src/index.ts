import moduleAlias from 'module-alias';
moduleAlias.addAliases({ '~': `${__dirname}` });

import 'dotenv/config';
import express, { Application } from 'express';
import morgan from 'morgan';
import Router from './routes';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import errorHandler from './infrastructure/middleware/errorhandler';
import { DoesNotExistException } from './infrastructure/exceptions';
import cors from 'cors';

const PORT = process.env.PORT || 8000;
const app: Application = express();

// Setup Coors
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://127.0.0.1:4000',
    'https://www.mplsart.com'
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
};

app.use(cors(corsOptions));

app.set('base', '/api/v4');
app.use(express.json());
app.use(morgan('tiny'));

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 4);
}

// Swagger Docs
app.use('/api/v4/public', express.static(path.join(__dirname, '../public')));
app.use(
  '/api/v4/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/api/v4/public/swagger.json'
    }
  })
);

// Setup Modules
app.use('/api/v4', Router);

// Catch all unknown routes
app.all('*', function (req, res, next) {
  next(new DoesNotExistException('Resource Not Found'));
});

// Add our error handler last
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v4/`);
});
