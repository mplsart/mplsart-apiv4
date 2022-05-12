import express from 'express';
import { authRouter } from '../modules/auth/router';
import { organizationRouter } from '../modules/organizations/router';

const router = express.Router();

// Organization Management
router.use('/orgs', organizationRouter);
router.use('/auth', authRouter);

export default router;
