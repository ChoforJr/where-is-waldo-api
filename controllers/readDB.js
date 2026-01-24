import {
  getAllGameplays,
  getGameplayByID,
  getGameplaysByLevel,
  getFinishedGameplay,
} from "../prisma_queries/find.js";

export async function readGameplays(req, res, next) {
  try {
    const gameplays = await getAllGameplays();
    res.json(gameplays);
  } catch (err) {
    return next(err);
  }
}

export async function readGameplayByID(req, res, next) {
  try {
    const gameplay = await getGameplayByID(Number(req.params.gameID));
    res.json(gameplay);
  } catch (err) {
    return next(err);
  }
}

export async function readGameplayByLevel(req, res, next) {
  try {
    const gameplay = await getGameplaysByLevel(Number(req.params.level));
    res.json(gameplay);
  } catch (err) {
    return next(err);
  }
}

export async function readFinishedGameplays(req, res, next) {
  try {
    const gameplays = await getFinishedGameplay();
    res.json(gameplays);
  } catch (err) {
    return next(err);
  }
}
