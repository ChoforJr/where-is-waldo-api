import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import prisma from "./config/prisma.js";
import { allowedOrigins } from "./config/origins.js";
import { setRealtimeServer } from "./services/realtime.js";
import { toGameplayRecord } from "./types.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./types.js";

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

setRealtimeServer(io);

io.on("connection", (socket) => {
  socket.on("game:join", async ({ gameId }) => {
    if (!Number.isSafeInteger(gameId) || gameId < 1) {
      socket.emit("game:error", { message: "Invalid gameplay ID" });
      return;
    }

    try {
      const gameplay = await prisma.gameplay.findUnique({
        where: { id: gameId },
      });
      if (!gameplay) {
        socket.emit("game:error", { message: "Gameplay session not found" });
        return;
      }

      await socket.join(`game:${gameId}`);
      socket.emit("game:state", toGameplayRecord(gameplay));
    } catch (error) {
      console.error("Failed to join gameplay room", error);
      socket.emit("game:error", { message: "Unable to load this gameplay session" });
    }
  });

  socket.on("game:leave", ({ gameId }) => {
    if (Number.isSafeInteger(gameId) && gameId > 0) {
      void socket.leave(`game:${gameId}`);
    }
  });
});

const port = Number(process.env.PORT ?? 5000);
httpServer.listen(port, () => {
  console.log(`Where's Waldo API listening on port ${port}`);
});

async function shutdown(): Promise<void> {
  io.close();
  await prisma.$disconnect();
}

process.on("SIGINT", () => void shutdown().finally(() => process.exit(0)));
process.on("SIGTERM", () => void shutdown().finally(() => process.exit(0)));
