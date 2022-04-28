import 'dotenv/config';
import express, { Application } from 'express';
import morgan from 'morgan';
import Router from './routes';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const PORT = process.env.PORT || 8000;
const app: Application = express();

app.set('base', '/api/v4');
app.use(express.json());
app.use(morgan('tiny'));
app.use('/api/v4/public', express.static(path.join(__dirname, '../public')));

// Swagger Docs
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v4/`);
});
