// Blog Router
import express from 'express';
import { z } from 'zod';
import superAdmin from '~/infrastructure/middleware/superAdminRequired';
import validateParams from '~/infrastructure/requests/validateParams';
import validateData from '~/infrastructure/requests/validateData';

import DSAuthorRepo from './repos/DSAuthorRepo';
import DSCategoryRepo from './repos/DSCategoryRepo';
import BlogController from './BlogController';
import {
  AuthorListParams,
  AuthorListParamsType,
  CategoryListParams,
  CategoryListParamsType
} from './types';

const router = express.Router();

// Request Payloads
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

////////////////////////////////////////////////////////////////////////////////
// Blog Authors
////////////////////////////////////////////////////////////////////////////////
router.get('/authors', async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    // Validate list query params
    const q = req.query;
    const params = validateParams<AuthorListParamsType>(AuthorListParams, q);

    // Fetch Data
    const response = await controller.getAllAuthors(params);
    return res.send(response); // {result: ..., more: ..., cursor: ... }
  } catch (err) {
    next(err);
  }
});

router.post('/authors', superAdmin, async (req, res, next) => {
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
router.get('/authors/:authorId', async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const authorId = req.params.authorId;
    const response = await controller.getAuthorByResourceId(authorId);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

router.put('/authors/:authorId', superAdmin, async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const authorId = req.params.authorId;
    const params = validateData(AuthorPayloadData, req.body);
    const response = await controller.updateAuthor(authorId, params);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

////////////////////////////////////////////////////////////////////////////////
// Categories Collection
////////////////////////////////////////////////////////////////////////////////
router.get('/categories', async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  // Check if there is a slug
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

  // ... else it is the list collection
  try {
    // Validate list query params
    const q = req.query;
    const params = validateParams<CategoryListParamsType>(
      CategoryListParams,
      q
    );

    // Fetch Data
    const response = await controller.getAllCategories(params);
    return res.send(response); // {result: ..., more: ..., cursor: ... }
  } catch (err) {
    next(err);
  }
});

router.post('/categories', superAdmin, async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const params = validateData(CategoryPayloadData, req.body);
    const response = await controller.createCategory(params);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

router.get('/categories/:categoryId', async (req, res, next) => {
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const categoryId = req.params.categoryId;
    const response = await controller.getCategoryByResourceId(categoryId);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

router.put('/categories/:categoryId', superAdmin, async (req, res, next) => {
  // Validate Request Data
  const controller = new BlogController(
    new DSAuthorRepo(),
    new DSCategoryRepo()
  );

  try {
    const params = validateData(CategoryPayloadData, req.body);
    const categoryId = req.params.categoryId;
    const response = await controller.updateCategory(categoryId, params);

    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

export { router as blogRouter };
