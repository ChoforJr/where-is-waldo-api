import prisma from "../config/prisma.js";

export async function getAllGameplays() {
  const gameplays = await prisma.gameplay.findMany();
  return gameplays;
}

export async function getGameplayByID(gameID) {
  const gameplay = await prisma.gameplay.findUnique({
    where: {
      id: gameID,
    },
  });
  return gameplay;
}

export async function getGameplaysByLevel(level) {
  const gameplays = await prisma.gameplay.findMany({
    where: {
      level: level,
    },
  });
  return gameplays;
}

export async function getFinishedGameplay() {
  const gameplays = await prisma.gameplay.findMany({
    where: {
      player: { not: null },
      endAt: { not: null },
    },
  });
  return gameplays;
}
