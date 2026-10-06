import type { Gameplay, User } from "@prisma/client";

export type CharacterName = "waldo" | "wilma" | "wizard" | "odlaw";
export type BoardId = "board1" | "board2" | "board3" | "board4";

export interface Coordinates {
  x: number;
  y: number;
}

export interface LocationGuessRequest {
  board: BoardId;
  character: CharacterName;
  currentPos: Coordinates;
}

export type GameplayRecord = Omit<Gameplay, "userId">;
export type PublicUser = Pick<User, "id" | "email" | "createdAt">;

export type CharacterGuessResponse =
  | { found: false }
  | { found: true; gameplay: GameplayRecord };

export function toGameplayRecord(game: Gameplay): GameplayRecord {
  return {
    id: game.id,
    level: game.level,
    startAt: game.startAt,
    endAt: game.endAt,
    waldo: game.waldo,
    wilma: game.wilma,
    wizard: game.wizard,
    odlaw: game.odlaw,
    player: game.player,
  };
}

export interface ClientToServerEvents {
  "game:join": (payload: { gameId: number }) => void;
  "game:leave": (payload: { gameId: number }) => void;
}

export interface ServerToClientEvents {
  "game:state": (game: GameplayRecord) => void;
  "game:character:found": (payload: {
    gameId: number;
    character: CharacterName;
  }) => void;
  "game:completed": (payload: { gameId: number; endAt: string }) => void;
  "leaderboard:updated": (entry: {
    id: number;
    level: number;
    time: number;
    player: string;
  }) => void;
  "game:error": (payload: { message: string }) => void;
}
