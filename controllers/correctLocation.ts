import type { BoardId, CharacterName, Coordinates } from "../types.js";

type Bounds = { min: Coordinates; max: Coordinates };
type LocationMap = Record<BoardId, Record<CharacterName, Bounds>>;

export const correctLocation: LocationMap = {
  board1: {
    waldo: { min: { x: 337, y: 368 }, max: { x: 359, y: 396 } },
    wilma: { min: { x: 347, y: 296 }, max: { x: 352, y: 303 } },
    wizard: { min: { x: 521, y: 382 }, max: { x: 532, y: 394 } },
    odlaw: { min: { x: 461, y: 475 }, max: { x: 477, y: 488 } },
  },
  board2: {
    waldo: { min: { x: 748, y: 23 }, max: { x: 756, y: 35 } },
    wilma: { min: { x: 217, y: 317 }, max: { x: 224, y: 325 } },
    wizard: { min: { x: 223, y: 186 }, max: { x: 249, y: 229 } },
    odlaw: { min: { x: 715, y: 272 }, max: { x: 724, y: 296 } },
  },
  board3: {
    waldo: { min: { x: 444, y: 217 }, max: { x: 449, y: 223 } },
    wilma: { min: { x: 246, y: 304 }, max: { x: 253, y: 309 } },
    wizard: { min: { x: 528, y: 153 }, max: { x: 539, y: 161 } },
    odlaw: { min: { x: 346, y: 160 }, max: { x: 353, y: 170 } },
  },
  board4: {
    waldo: { min: { x: 329, y: 83 }, max: { x: 346, y: 107 } },
    wilma: { min: { x: 234, y: 361 }, max: { x: 242, y: 385 } },
    wizard: { min: { x: 545, y: 15 }, max: { x: 559, y: 29 } },
    odlaw: { min: { x: 151, y: 355 }, max: { x: 162, y: 377 } },
  },
};

export function isCorrectLocation(
  board: BoardId,
  character: CharacterName,
  point: Coordinates
): boolean {
  const { min, max } = correctLocation[board][character];
  return (
    point.x >= min.x &&
    point.x <= max.x &&
    point.y >= min.y &&
    point.y <= max.y
  );
}
