// Blog Router
import express from 'express';
import DSAuthorRepo from './repos/DSAuthorRepo';
import DSCategoryRepo from './repos/DSCategoryRepo';
import BlogController from './BlogController';
import superAdminRequired from '~/infrastructure/middleware/superAdminRequired';
import validateData from '~/infrastructure/requests/validateData';
import { z } from 'zod';

const router = express.Router();

const AuthorPayloadData = z.object({
  website: z.string(),
  firstname: z.string(),
  lastname: z.string()
});

const CategoryPayloadData = z.object({
  slug: z.string(),
  title: z.string(),
  site_id: z.string()
});

// Authors Collection
router.get('/authors', async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const response = await controller.getAllAuthors();
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

router.post('/authors', async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const params = validateData(AuthorPayloadData, req.body);
    const response = await controller.createAuthor(params);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

// Author
router.get('/authors/:authorId', async (_req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

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
    const controller = new BlogController(
      new DSAuthorRepo(),
      new DSCategoryRepo()
    );

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

// Categories Collection
router.get('/categories', async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  // Check if there is a slug
  //  TODO: req.query.slug *could* be an array
  if (req.query && (req.query.slug || req.query.slug === '')) {
    const slug = req.query.slug as string;
    try {
      const response = await controller.getCategoryBySlug(slug);
      return res.send({ result: response });
    } catch (err) {
      next(err);
    }
    return;
  }

  try {
    const response = await controller.getAllCategories();
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

router.get('/categories/:categoryId', async (_req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const response = await controller.getCategoryByResourceId(
      _req.params.categoryId
    );
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

export { router as blogRouter };
