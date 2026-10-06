import type { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types.js";
import { toGameplayRecord } from "../types.js";
import type { Gameplay } from "@prisma/client";

let io: Server<ClientToServerEvents, ServerToClientEvents> | undefined;

export function setRealtimeServer(
  server: Server<ClientToServerEvents, ServerToClientEvents>
): void {
  io = server;
}

export function publishGameplay(
  game: Gameplay,
  previous?: Gameplay
): void {
  if (!io) return;

  const publicGame = toGameplayRecord(game);
  io.to(`game:${game.id}`).emit("game:state", publicGame);
  const foundCharacters = (["waldo", "wilma", "wizard", "odlaw"] as const).filter(
    (character) => game[character] && !previous?.[character]
  );
  for (const character of foundCharacters) {
    io.to(`game:${game.id}`).emit("game:character:found", {
      gameId: game.id,
      character,
    });
  }
  if (game.endAt) {
    io.to(`game:${game.id}`).emit("game:completed", {
      gameId: game.id,
      endAt: game.endAt.toISOString(),
    });
  }
  if (game.player && game.endAt) {
    io.emit("leaderboard:updated", {
      id: game.id,
      level: game.level,
      time: Math.floor((game.endAt.getTime() - game.startAt.getTime()) / 1000),
      player: game.player,
    });
  }
}
