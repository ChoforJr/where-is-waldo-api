import { Router } from "express";
import {
  readGameplays,
  readGameplayByID,
  readGameplayByLevel,
  readFinishedGameplays,
} from "../controllers/readDB.js";
import { startGame } from "../controllers/postToDB.js";

const indexRouter = Router();

indexRouter.get("/gameplay/all", readGameplays);

indexRouter.get("/gameplay/finished", readFinishedGameplays);

indexRouter.get("/gameplay/:gameID", readGameplayByID);

indexRouter.get("/gameplay/level/:level", readGameplayByLevel);

indexRouter.post("/gameplay/level/:level", startGame);

export default indexRouter;
