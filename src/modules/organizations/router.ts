import express from 'express';
import OrganizationsController from './controllers/OrganizationController';

const orgRouter = express.Router();

orgRouter.get('/organizations', async (_req, res, next) => {
  const controller = new OrganizationsController();

  try {
    const response = await controller.search('gam');
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
