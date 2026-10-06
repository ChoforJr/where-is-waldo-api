import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { isCorrectLocation } from "./correctLocation.js";
import { publishGameplay } from "../services/realtime.js";
import { toGameplayRecord, type CharacterGuessResponse } from "../types.js";

const idSchema = z.coerce.number().int().positive();
const levelSchema = z.coerce.number().int().min(1).max(4);
const guessSchema = z.object({
  board: z.enum(["board1", "board2", "board3", "board4"]),
  character: z.enum(["waldo", "wilma", "wizard", "odlaw"]),
  currentPos: z.object({
    x: z.number().int().min(0).max(800),
    y: z.number().int().min(0).max(500),
  }),
});

function readParam(value: string, schema: typeof idSchema | typeof levelSchema) {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export async function listGameplays(_req: Request, res: Response): Promise<void> {
  const gameplays = await prisma.gameplay.findMany({
    orderBy: { startAt: "desc" },
    take: 100,
  });
  res.json(gameplays.map(toGameplayRecord));
}

export async function listFinishedGameplays(
  _req: Request,
  res: Response
): Promise<void> {
  const gameplays = await prisma.gameplay.findMany({
    where: { player: { not: null }, endAt: { not: null } },
    orderBy: { endAt: "asc" },
  });
  res.json(gameplays.map(toGameplayRecord));
}

export async function getGameplay(req: Request, res: Response): Promise<void> {
  const id = readParam(req.params.gameID, idSchema);
  if (!id) {
    res.status(400).json({ message: "Invalid gameplay ID" });
    return;
  }

  const gameplay = await prisma.gameplay.findUnique({ where: { id } });
  if (!gameplay) {
    res.status(404).json({ message: "Gameplay session not found" });
    return;
  }
  res.json(toGameplayRecord(gameplay));
}

export async function listGameplaysByLevel(
  req: Request,
  res: Response
): Promise<void> {
  const level = readParam(req.params.level, levelSchema);
  if (!level) {
    res.status(400).json({ message: "Level must be a number between 1 and 4" });
    return;
  }

  const gameplays = await prisma.gameplay.findMany({ where: { level } });
  res.json(gameplays.map(toGameplayRecord));
}

export async function startGameplay(
  req: Request,
  res: Response
): Promise<void> {
  const level = readParam(req.params.level, levelSchema);
  if (!level) {
    res.status(400).json({ message: "Level must be a number between 1 and 4" });
    return;
  }

  const gameplay = await prisma.gameplay.create({ data: { level } });
  res.status(201).json([toGameplayRecord(gameplay)]);
}

export async function guessCharacter(
  req: Request,
  res: Response
): Promise<void> {
  const id = readParam(req.params.gameID, idSchema);
  const guess = guessSchema.safeParse(req.body);
  if (!id || !guess.success) {
    res.status(400).json({ message: "Invalid gameplay ID or location guess" });
    return;
  }

  if (!isCorrectLocation(guess.data.board, guess.data.character, guess.data.currentPos)) {
    const response: CharacterGuessResponse = { found: false };
    res.json(response);
    return;
  }

  const result = await prisma.$transaction(async (transaction) => {
    const existing = await transaction.gameplay.findUnique({ where: { id } });
    if (!existing) return null;
    if (existing.level !== Number(guess.data.board.slice(-1))) {
      return { game: null, previous: existing, mismatch: true };
    }
    if (existing[guess.data.character]) {
      return { game: existing, previous: existing, mismatch: false };
    }

    const updated = await transaction.gameplay.update({
      where: { id },
      data: { [guess.data.character]: true },
    });
    const foundEveryone =
      updated.waldo && updated.wilma && updated.wizard && updated.odlaw;
    if (foundEveryone && !updated.endAt) {
      const completed = await transaction.gameplay.update({
        where: { id },
        data: { endAt: new Date() },
      });
      return { game: completed, previous: existing, mismatch: false };
    }
    return { game: updated, previous: existing, mismatch: false };
  });

  if (!result || result.mismatch) {
    res.status(400).json({ message: "The guess does not match this gameplay board" });
    return;
  }
  if (!result.game) {
    res.status(404).json({ message: "Gameplay session not found" });
    return;
  }

  publishGameplay(result.game, result.previous);
  const response: CharacterGuessResponse = {
    found: true,
    gameplay: toGameplayRecord(result.game),
  };
  res.json(response);
}

export async function updatePlayer(
  req: Request,
  res: Response
): Promise<void> {
  const id = readParam(req.params.gameID, idSchema);
  const body = z.object({ player: z.string().trim().min(1).max(20) }).safeParse(req.body);
  if (!id || !body.success) {
    res.status(400).json({ message: "Player name must be between 1 and 20 characters" });
    return;
  }

  const gameplay = await prisma.gameplay.findUnique({ where: { id } });
  if (!gameplay) {
    res.status(404).json({ message: "Gameplay session not found" });
    return;
  }
  if (!gameplay.endAt) {
    res.status(409).json({ message: "Finish the game before saving your score" });
    return;
  }

  const updated = await prisma.gameplay.update({
    where: { id },
    data: {
      player: body.data.player,
      userId: req.authenticatedUser?.id ?? null,
    },
  });
  publishGameplay(updated, gameplay);
  res.json([toGameplayRecord(updated)]);
}
