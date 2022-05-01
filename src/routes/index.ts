import express from 'express';
import { organizationRouter } from '../modules/organizations/router';

const router = express.Router();

// Organization Management
router.use('/orgs', organizationRouter);

export default router;
