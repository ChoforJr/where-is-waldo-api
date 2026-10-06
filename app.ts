import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { isTrustedOrigin } from "./config/origins.js";
import router from "./routes/indexRouter.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isTrustedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "32kb" }));
app.use("/api", router);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof Error && error.message === "Origin is not allowed by CORS") {
    res.status(403).json({ message: "Origin is not allowed" });
    return;
  }

  console.error("Unhandled API error", error);
  res.status(500).json({ message: "An unexpected server error occurred" });
});

export default app;
