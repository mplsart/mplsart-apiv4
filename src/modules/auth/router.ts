// Auth Router
import express from 'express';
import AuthenticationController from './controllers/AuthenticationController';
import SupaUserRepo from './repos/SupaUserRepo';
import authContext from '../../infrastructure/middleware/authContext';
import * as ex from '../../infrastructure/exceptions';

const router = express.Router();

router.get('/me', authContext, async (req, res) => {
  return res.send(req.user);
});

router.post('/authenticate/firebase', async (_req, res, next) => {
  const accessToken = _req.body.firebaseIdToken;
  const controller = new AuthenticationController(new SupaUserRepo());

  try {
    // Ensure we have a token
    if (!accessToken) {
      throw new ex.DataValidationError('Unable to Authenticate', [
        new ex.FieldError('token', 'Token Not Provided')
      ]);
    }

    // Call Our Controller to Authenticate
    const response = await controller.firebaseAuthenticate(accessToken);
    return res.send({ result: response });
  } catch (err) {
    next(err);
  }
});

export { router as authRouter };
