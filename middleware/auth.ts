import type { NextFunction, Request, Response } from "express";
import { findSessionUser } from "../services/auth.js";
import type { PublicUser } from "../types.js";
import { isTrustedOrigin } from "../config/origins.js";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: PublicUser;
      sessionId?: string;
    }
  }
}

export function requireTrustedOrigin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!isTrustedOrigin(req.get("origin"))) {
    res.status(403).json({ message: "Origin is not allowed" });
    return;
  }
  next();
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const session = await findSessionUser(req);
  if (!session) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  req.authenticatedUser = session.user;
  req.sessionId = session.sessionId;
  next();
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const session = await findSessionUser(req);
  if (session) {
    req.authenticatedUser = session.user;
    req.sessionId = session.sessionId;
  }
  next();
}
