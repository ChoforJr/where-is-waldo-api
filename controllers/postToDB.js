import { insertGameplay } from "../prisma_queries/create.js";

export async function startGame(req, res, next) {
  try {
    const currentGame = await insertGameplay(Number(req.params.level));
    res.status(200).json(currentGame);
  } catch (err) {
    return next(err);
  }
}
