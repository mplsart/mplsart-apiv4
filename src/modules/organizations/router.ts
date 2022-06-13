import express from 'express';
import OrganizationsController from './controllers/OrganizationController';
import { z } from 'zod';
import validateData from '~/infrastructure/requests/validateData';
import SupaOrgRepo from './repos/SupaOrgRepo';

const orgRouter = express.Router();

orgRouter.get('/organizations', async (_req, res, next) => {
  const controller = new OrganizationsController(new SupaOrgRepo());

  try {
    const response = await controller.getAll();
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

const CreateData = z.object({
  name: z.string()
});

orgRouter.post('/organizations', async (_req, res, next) => {
  const controller = new OrganizationsController(new SupaOrgRepo());
  // Validate Paramaters
  try {
    const params = validateData(CreateData, _req.body);
    const response = await controller.create(params.name);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

orgRouter.get('/organizations/:organizationId', async (_req, res, next) => {
  const controller = new OrganizationsController(new SupaOrgRepo());
  try {
    const response = await controller.getOrgById(_req.params.organizationId);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

orgRouter.patch('/organizations/:organizationId', async (_req, res, next) => {
  const controller = new OrganizationsController(new SupaOrgRepo());
  // Get Organization by Id
  // TODO: Ensure org id

  try {
    const params = validateData(CreateData, _req.body);
    const response = await controller.rename(
      _req.params.organizationId,
      params.name
    );
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

orgRouter.delete('/organizations/:organizationId', async (_req, res, next) => {
  const controller = new OrganizationsController(new SupaOrgRepo());
  try {
    const response = await controller.squelch(_req.params.organizationId);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

export { orgRouter as organizationRouter };
