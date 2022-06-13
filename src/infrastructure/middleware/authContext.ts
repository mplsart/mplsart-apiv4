import { NextFunction, Request, Response } from 'express';
import SupaUserRepo from '~/modules/auth/repos/SupaUserRepo';
import firebase from '~/infrastructure/firebase/admin';
import { AuthenticationException } from '../exceptions';
// Configurable middleware
// https://expressjs.com/en/guide/writing-middleware.html

// TODO:
// -[ ] Unit tests
// -[ ] Login Required vs. Login Optional
// -[ ] Wrap in one try catch
// -[ ] Default to Anon user object

function handler(req: Request, res: Response, next: NextFunction) {
  const loginRequired = true;

  // Step 1: Isolate the header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    if (loginRequired) {
      next(new AuthenticationException('Authorization Header Missing'));
    } else {
      // TODO: Attach anon user
      next();
    }
    return;
  }

  // Step 2: Extract Token
  const idToken = authHeader.split(' ')[1];
  firebase.auth
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // Step 3: Fetch User
      const repo = new SupaUserRepo();
      repo
        .getByEmail(decodedToken.email as string)
        .then((opUser) => {
          if (opUser.isEmpty()) {
            next(
              new AuthenticationException(`Unknown User ${decodedToken.email}`)
            );
          } else {
            req.user = opUser.get();
            next();
          }
        })
        .catch((e) => {
          next(e);
        });
    })
    .catch((err) => {
      console.log(err.code);
      next(err.code);
      // TODO: Attach anon user
      return;
    });
}

export default handler;
