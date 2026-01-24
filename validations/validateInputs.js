import { body, validationResult } from "express-validator";

const validBoards = ["board1", "board2", "board3", "board4"];
const validCharacters = ["waldo", "wenda", "wizard", "odlaw"];

export const validateLocationInputsRules = [
  body("board")
    .trim()
    .notEmpty()
    .withMessage("Board name is required")
    .isIn(validBoards)
    .withMessage("Invalid Board"),

  body("character")
    .trim()
    .notEmpty()
    .withMessage("Character name is required")
    .isIn(validCharacters)
    .withMessage("Invalid Character"),

  body("currentPos")
    .exists()
    .withMessage("Location is required")
    .isObject()
    .withMessage("Location must be an object"),

  body("currentPos.x")
    .exists()
    .withMessage("X coordinate is required")
    .isNumeric()
    .withMessage("X must be a number"),

  body("currentPos.y")
    .exists()
    .withMessage("Y coordinate is required")
    .isNumeric()
    .withMessage("Y must be a number"),
];

export const validatePlayerRules = [
  body("player")
    .trim()
    .notEmpty()
    .withMessage("Player name is required")
    .isString()
    .withMessage("Player must be a string")
    .isLength({ min: 1, max: 20 })
    .withMessage("Name must be between 1 and 20 chars"),
];

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
