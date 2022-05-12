declare namespace Express {
  export interface Request {
    user: import('./modules/auth/types').User;
    //user?: string;
  }
}
