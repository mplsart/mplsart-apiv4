// Blog Router
import express from 'express';
import DSAuthorRepo from './repos/DSAuthorRepo';
import BlogController from './BlogController';
import superAdminRequired from '../../infrastructure/middleware/superAdminRequired';
import validateData from '../../infrastructure/requests/validateData';
import { z } from 'zod';

const router = express.Router();

const AuthorPayloadData = z.object({
  website: z.string(),
  firstname: z.string(),
  lastname: z.string()
});

// Authors Collection
router.get('/authors', async (req, res, next) => {
  const controller = new BlogController(new DSAuthorRepo());
  try {
    const response = await controller.getAllAuthors();
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

router.post('/authors', async (req, res, next) => {
  const controller = new BlogController(new DSAuthorRepo());

  try {
    const params = validateData(AuthorPayloadData, req.body);
    const response = await controller.create(params);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

// Author
router.get('/authors/:authorId', async (_req, res, next) => {
  const controller = new BlogController(new DSAuthorRepo());

  try {
    const response = await controller.getAuthorByResourceId(
      _req.params.authorId
    );
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

router.put(
  '/authors/:authorId',
  superAdminRequired,
  async (_req, res, next) => {
    // Validate Request Data
    const controller = new BlogController(new DSAuthorRepo());

    try {
      const params = validateData(AuthorPayloadData, _req.body);
      const response = await controller.updateAuthor(
        _req.params.authorId,
        params
      );

      return res.send({ result: response });
    } catch (err) {
      next(err);
    }
  }
);

export { router as blogRouter };
