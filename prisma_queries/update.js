import prisma from "../config/prisma.js";

export async function updateCharacterAndCheckWin(gameID, character) {
  return await prisma.$transaction(async (tx) => {
    const updatedGame = await tx.gameplay.update({
      where: { id: gameID },
      data: {
        [character]: true,
      },
    });

    const allFound =
      updatedGame.waldo &&
      updatedGame.wilma &&
      updatedGame.wizard &&
      updatedGame.odlaw;

    if (updatedGame.endAt !== null) {
      return updatedGame;
    }

    if (allFound) {
      return await tx.gameplay.update({
        where: { id: gameID },
        data: { endAt: new Date() },
      });
    }

    return updatedGame;
  });
}

export async function updatePlayer(gameID, playerName) {
  const updatedGame = await prisma.gameplay.updateManyAndReturn({
    where: {
      id: gameID,
    },
    data: {
      player: playerName,
    },
  });
  return updatedGame;
}
