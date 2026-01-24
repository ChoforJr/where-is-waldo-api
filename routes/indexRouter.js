import { Router } from "express";
import {
  readGameplays,
  readGameplayByID,
  readGameplayByLevel,
  readFinishedGameplays,
} from "../controllers/readDB.js";
import { startGame } from "../controllers/postToDB.js";
import { editCharacter, editPlayer } from "../controllers/putToDB.js";
import {
  validateLocationInputsRules,
  validatePlayerRules,
  checkValidationResult,
} from "../validations/validateInputs.js";

const indexRouter = Router();

indexRouter.get("/gameplay/all", readGameplays);

indexRouter.get("/gameplay/finished", readFinishedGameplays);

indexRouter.get("/gameplay/:gameID", readGameplayByID);

indexRouter.get("/gameplay/level/:level", readGameplayByLevel);

indexRouter.post("/gameplay/level/:level", startGame);

indexRouter.patch(
  "/gameplay/:gameID/player",
  validatePlayerRules,
  checkValidationResult,
  editPlayer
);

indexRouter.patch(
  "/gameplay/:gameID/character",
  validateLocationInputsRules,
  checkValidationResult,
  editCharacter
);

export default indexRouter;
