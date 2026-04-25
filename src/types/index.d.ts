// ------------------------------------------------------------------
// TYPES  (src/types/index.ts)
// ------------------------------------------------------------------
export interface JwtPayload {
  userId: string;
  email: string;
}

// Extends Express Request so TypeScript knows req.user exists
// after the auth middleware runs
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}