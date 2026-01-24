import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { compare } from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from "passport-jwt";
import jwt from "jsonwebtoken";

import { getUserInfoByUsername } from "../prisma_queries/find.js";

async function verifyCallback(username, password, done) {
  try {
    const user = await getUserInfoByUsername(username.toLowerCase());

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const match = await compare(password, user.password);
    if (!match) {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

passport.use("login", new LocalStrategy(verifyCallback));

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      // Expect the token in the header: "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (tokenPayload, done) => {
      try {
        // tokenPayload contains the data we signed (e.g., { user: { id: 1, email: ... } })
        return done(null, tokenPayload.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export async function authLogin(req, res, next) {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error(info?.message || "An error occurred.");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // We verify the user, now we generate the token
        const body = { id: user.id, username: user.username };
        const token = jwt.sign({ user: body }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}
