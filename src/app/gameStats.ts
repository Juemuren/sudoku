import { conflicts, isSolved } from "../domain/rules.ts";
import type { GameState } from "./gameState.ts";

export function gameStats(game: GameState, now: number) {
  const badCells = conflicts(game.board);
  return {
    badCells,
    solved: isSolved(game.board),
    remaining: game.board.filter((value) => value === 0).length,
    elapsedSeconds: Math.max(
      0,
      Math.floor((game.elapsedBeforeStart + now - game.startedAt) / 1000),
    ),
  };
}
