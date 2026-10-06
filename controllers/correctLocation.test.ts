import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Gameplay } from "@prisma/client";
import { isCorrectLocation } from "./correctLocation.js";
import { toGameplayRecord } from "../types.js";

describe("isCorrectLocation", () => {
  it("accepts coordinates on the inclusive character bounds", () => {
    assert.equal(isCorrectLocation("board1", "waldo", { x: 337, y: 368 }), true);
    assert.equal(isCorrectLocation("board1", "waldo", { x: 359, y: 396 }), true);
  });

  it("rejects coordinates outside the target area", () => {
    assert.equal(isCorrectLocation("board1", "waldo", { x: 336, y: 368 }), false);
    assert.equal(isCorrectLocation("board2", "wilma", { x: 224, y: 326 }), false);
  });

  it("keeps target positions specific to each board and character", () => {
    assert.equal(isCorrectLocation("board2", "waldo", { x: 752, y: 29 }), true);
    assert.equal(isCorrectLocation("board2", "wilma", { x: 752, y: 29 }), false);
  });

  it("does not expose account IDs in public gameplay payloads", () => {
    const internalGame = {
      id: 1,
      level: 1,
      startAt: new Date("2026-01-01T00:00:00.000Z"),
      endAt: null,
      waldo: false,
      wilma: false,
      wizard: false,
      odlaw: false,
      player: null,
      userId: 42,
    } satisfies Gameplay;

    const publicGame = toGameplayRecord(internalGame);
    assert.equal("userId" in publicGame, false);
    assert.equal(publicGame.level, 1);
  });
});
