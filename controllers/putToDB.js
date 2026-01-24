import {
  updateCharacterAndCheckWin,
  updatePlayer,
} from "../prisma_queries/update.js";
import { correctLocation } from "./correctLocation.js";
import { matchedData } from "express-validator";

export async function editCharacter(req, res, next) {
  try {
    const { board, character, currentPos } = matchedData(req);

    if (
      correctLocation[board][character].min.x <= currentPos.x &&
      correctLocation[board][character].max.x >= currentPos.x &&
      correctLocation[board][character].min.y <= currentPos.y &&
      correctLocation[board][character].max.y >= currentPos.y
    ) {
      const currentGame = await updateCharacterAndCheckWin(
        Number(req.params.gameID),
        character
      );
      return res.status(200).json(currentGame);
    } else {
      return res.status(404).json("Wrong");
    }
  } catch (err) {
    return next(err);
  }
}

export async function editPlayer(req, res, next) {
  try {
    const { player } = matchedData(req);
    const currentGame = await updatePlayer(Number(req.params.gameID), player);
    res.status(200).json(currentGame);
  } catch (err) {
    return next(err);
  }
}
