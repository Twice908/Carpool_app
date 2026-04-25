import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
 
// ------------------------------------------------------------------
// TYPES  (src/types/index.ts)
// ------------------------------------------------------------------
interface JwtPayload {
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