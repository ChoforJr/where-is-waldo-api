import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "../services/auth.js";
import type { PublicUser } from "../types.js";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8)
    .max(72)
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72),
});

function readCredentials(body: unknown) {
  return credentialsSchema.safeParse(body);
}

export async function register(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = readCredentials(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Enter a valid email and password of 8-72 characters" });
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existingUser) {
    res.status(409).json({ message: "An account with this email already exists" });
    return;
  }

  let user: PublicUser;
  try {
    user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: { id: true, email: true, createdAt: true },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      res.status(409).json({ message: "An account with this email already exists" });
      return;
    }
    throw error;
  }
  await createSession(user.id, res);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = readCredentials(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Enter a valid email and password" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  const passwordMatches = user
    ? await verifyPassword(parsed.data.password, user.passwordHash)
    : false;
  if (!user || !passwordMatches) {
    res.status(401).json({ message: "Email or password is incorrect" });
    return;
  }

  await createSession(user.id, res);
  res.json({
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
  });
}

export function currentUser(req: Request, res: Response): void {
  res.json({ user: req.authenticatedUser });
}

export async function accountStats(
  req: Request,
  res: Response
): Promise<void> {
  const gameplays = await prisma.gameplay.findMany({
    where: { userId: req.authenticatedUser?.id, endAt: { not: null } },
    select: { id: true, level: true, startAt: true, endAt: true },
    orderBy: { endAt: "desc" },
  });
  res.json({
    gamesPlayed: gameplays.length,
    fastestTime: gameplays.reduce<number | null>((fastest, game) => {
      if (!game.endAt) return fastest;
      const time = Math.floor(
        (game.endAt.getTime() - game.startAt.getTime()) / 1000
      );
      return fastest === null ? time : Math.min(fastest, time);
    }, null),
    recentGames: gameplays.slice(0, 5).flatMap((game) => {
      if (!game.endAt) return [];
      return [
        {
          id: game.id,
          level: game.level,
          time: Math.floor(
            (game.endAt.getTime() - game.startAt.getTime()) / 1000
          ),
        },
      ];
    }),
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  await destroySession(req);
  res.clearCookie("waldo_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.status(204).end();
}
