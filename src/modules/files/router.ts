// Files Router
import express from 'express';
import { z } from 'zod';
//import superAdmin from '~/infrastructure/middleware/superAdminRequired';
import validateParams from '~/infrastructure/requests/validateParams';
//import validateData from '~/infrastructure/requests/validateData';

import DSFilesRepo from './repos/DSFilesRepo';
import FilesController from './FilesController';
import { FileListParams, FileListParamsType } from './types';

const router = express.Router();

// Request Payloads
const FilePayloadData = z.object({
  caption: z.string()
});

////////////////////////////////////////////////////////////////////////////////
// Files Routes
////////////////////////////////////////////////////////////////////////////////
router.get('/list', async (req, res, next) => {
  const controller = new FilesController(new DSFilesRepo());

  try {
    // Validate list query params
    const q = req.query;
    const params = validateParams<FileListParamsType>(FileListParams, q);

    // Fetch Data
    const response = await controller.getAll(params);
    return res.send(response); // {result: ..., more: ..., cursor: ... }
  } catch (err) {
    next(err);
  }
});

// router.post('/list', superAdmin, async (req, res, next) => {
//   const controller = new FilesController(new DSFilesRepo()
//   );

//   try {
//     const params = validateData(FilePayloadData, req.body);
//     const response = await controller.createAuthor(params);
//     return res.send({ result: response });
//   } catch (err) {
//     next(err);
//   }
// });

// File Detail View
router.get('/list/:fileId', async (req, res, next) => {
  const controller = new FilesController(new DSFilesRepo());

  try {
    const fileId = req.params.fileId;
    const response = await controller.getByResourceId(fileId);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

// router.put('/authors/:authorId', superAdmin, async (req, res, next) => {
//   const controller = new FilesController(new DSFilesRepo());

//   try {
//     const authorId = req.params.authorId;
//     const params = validateData(FilePayloadData, req.body);
//     const response = await controller.updateAuthor(authorId, params);
//     return res.send({ result: response });
//   } catch (err) {
//     next(err);
//   }
// });

export { router as filesRouter };
