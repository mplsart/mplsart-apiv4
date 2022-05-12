import { NextFunction, Request, Response } from 'express';
import firebase from '../firebase/admin';
import { AuthenticationException } from '../exceptions';

/* 
Temporary middleware to require superAdmin roll based on firebase token claims
Note: These are set in the webapp middleware...
We can eliminate this (hopefully) once we eliminate both the python api and the v3/auth/authenticate endpoint
*/

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
      if (decodedToken.superAdmin) {
        next();
      } else {
        next(new AuthenticationException(`Must be superAdmin`));
      }
    })
    .catch((err) => {
      next(new AuthenticationException(err.code));
      return;
    });
}

export default handler;
