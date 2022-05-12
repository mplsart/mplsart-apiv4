import { NextFunction, Request, Response } from 'express';
import * as ex from '../exceptions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ex.DataValidationError) {
    res.status(400).json(err.toData());
  } else if (err instanceof ex.DoesNotExistException) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof ex.BadRequestException) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof ex.AuthenticationException) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ex.PermissionException) {
    res.status(403).json({ error: err.message });
  } else if (err instanceof ex.HTTPMethodNotAllowed) {
    res.status(405).json({ error: err.message });
  } else if (err instanceof ex.ConflictException) {
    res.status(409).json({ error: err.message });
  } else {
    res.status(500).json({ message: err.message || err });
  }
}

export default handler;
