// Blog Router
import express from 'express';
import DSAuthorRepo from './repos/DSAuthorRepo';
import BlogController from './BlogController';

const router = express.Router();
// import authContext from '../../infrastructure/middleware/authContext';

// Authors
router.get('/authors', async (req, res, next) => {
  const controller = new BlogController(new DSAuthorRepo());
  try {
    const response = await controller.getAllAuthors();
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

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

export { router as blogRouter };
