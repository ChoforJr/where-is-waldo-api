import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  accountStats,
  currentUser,
  login,
  logout,
  register,
} from "../controllers/auth.js";
import {
  getGameplay,
  guessCharacter,
  listFinishedGameplays,
  listGameplays,
  listGameplaysByLevel,
  startGameplay,
  updatePlayer,
} from "../controllers/gameplay.js";
import {
  optionalAuth,
  requireAuth,
  requireTrustedOrigin,
} from "../middleware/auth.js";

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Try again later." },
});

router.post("/auth/register", requireTrustedOrigin, authLimiter, register);
router.post("/auth/login", requireTrustedOrigin, authLimiter, login);
router.get("/auth/me", requireAuth, currentUser);
router.get("/auth/stats", requireAuth, accountStats);
router.post("/auth/logout", requireTrustedOrigin, requireAuth, logout);

router.get("/gameplay/all", listGameplays);
router.get("/gameplay/finished", listFinishedGameplays);
router.get("/gameplay/level/:level", listGameplaysByLevel);
router.post("/gameplay/level/:level", startGameplay);
router.get("/gameplay/:gameID", getGameplay);
router.patch(
  "/gameplay/:gameID/player",
  requireTrustedOrigin,
  optionalAuth,
  updatePlayer
);
router.patch("/gameplay/:gameID/character", guessCharacter);

export default router;
