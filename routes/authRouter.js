import { Router } from "express";
import passport from "passport";
import { authLogin } from "../config/passport.js";

import { addNewUser } from "../controllers/postToDB.js";
import {
  checkSignUpValidationResult,
  validateSignUpRules,
} from "..//validations/validateSignUp.js";
import {
  validateLogInRules,
  checkLoginValidationResult,
} from "..//validations/validateLogIn.js";
import indexRouter from "./indexRouter.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateSignUpRules,
  checkSignUpValidationResult,
  addNewUser
);

authRouter.post(
  "/login",
  validateLogInRules,
  checkLoginValidationResult,
  authLogin
);

authRouter.use(
  "/",
  passport.authenticate("jwt", { session: false }),
  indexRouter
);

export default authRouter;
