import { insertUser } from "../prisma_queries/create.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";

export async function addNewUser(req, res, next) {
  try {
    const { username, password } = matchedData(req);
    const hashedPassword = await hash(password, 10);
    const usernameLowerCase = username.toLowerCase();
    await insertUser(usernameLowerCase, hashedPassword);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
