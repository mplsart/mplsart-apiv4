// Blog Router
import express from 'express';

import { Datastore } from '@google-cloud/datastore';
import DSAuthorRepo from './repos/DSAuthorRepo';
import BlogController from './BlogController';

const router = express.Router();
// import authContext from '../../infrastructure/middleware/authContext';

// Authors
router.get('/authors', async (req, res, next) => {
  const controller = new BlogController(new DSAuthorRepo());
  try {
    const response = await controller.getAll();
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

export { router as blogRouter };
