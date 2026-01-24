import prisma from "../config/prisma.js";

export async function insertGameplay(level) {
  const currentGame = await prisma.gameplay.createManyAndReturn({
    data: {
      level: level,
    },
  });
  return currentGame;
}
