import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

const JWT_SECRET = process.env.JWT_SECRET as string;

// ------------------------------------------------------------------
// MIDDLEWARE  →  src/middleware/auth.middleware.ts
// ------------------------------------------------------------------
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  // Expecting header:  Authorization: Bearer <token>
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    return next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}