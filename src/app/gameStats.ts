import { conflicts, isSolved } from "../domain/rules.ts";
import { elapsedMilliseconds, type GameState } from "./gameState.ts";

export function gameStats(game: GameState, now: number) {
  const badCells = conflicts(game.board);
  return {
    badCells,
    solved: isSolved(game.board),
    remaining: game.board.filter((value) => value === 0).length,
    elapsedSeconds: Math.floor(elapsedMilliseconds(game, now) / 1000),
  };
}
