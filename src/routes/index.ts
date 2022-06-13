import express from 'express';
import { authRouter } from '~/modules/auth/router';
import { blogRouter } from '../modules/blog/router';
import { organizationRouter } from '../modules/organizations/router';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/blog', blogRouter);
router.use('/orgs', organizationRouter);
export default router;
