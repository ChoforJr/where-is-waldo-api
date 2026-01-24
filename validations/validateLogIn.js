import { body, validationResult } from "express-validator";

export const validateLogInRules = [
  body("username")
    .trim()
    .isEmail()
    .withMessage("Email: Should be an email")
    .isLength({ min: 8, max: 250 })
    .withMessage("Email: Has to have a length of between 8 and 250"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 250 })
    .withMessage("Password: Has to have a length of between 4 and 250"),
];

export const checkLoginValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
