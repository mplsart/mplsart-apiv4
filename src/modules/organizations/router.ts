import express from 'express';
import OrganizationsController from './controllers/OrganizationController';
import { z } from 'zod';
import validateData from '../../infrastructure/requests/validateData';

const orgRouter = express.Router();

orgRouter.get('/organizations', async (_req, res, next) => {
  const controller = new OrganizationsController();

  try {
    const response = await controller.getAll();
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

const CreateData = z.object({
  name: z.string()
});

orgRouter.post('/organizations', async (_req, res, next) => {
  const controller = new OrganizationsController();
  // Validate Paramaters
  try {
    const params = validateData(CreateData, _req.body);
    const name = params.name as string;
    const response = await controller.create(name);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

orgRouter.get('/organizations/:organizationId', async (_req, res, next) => {
  const controller = new OrganizationsController();
  try {
    const response = await controller.getOrgById(_req.params.organizationId);
    return res.send(response);
  } catch (err) {
    next(err);
  }
});

export { orgRouter as organizationRouter };
