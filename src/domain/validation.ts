import { assertBoard, type Board, CELL_COUNT } from "./board.ts";
import { conflicts } from "./rules.ts";
import { solve } from "./solver.ts";

/** Verify that a player's board still contains every clue from the puzzle. */
export function assertCluesPreserved(puzzle: Board, board: Board): void {
  assertBoard(puzzle);
  assertBoard(board);
  for (let index = 0; index < CELL_COUNT; index++) {
    if (puzzle[index] !== 0 && board[index] !== puzzle[index]) {
      throw new Error(`第 ${index + 1} 格的题目数字已被修改。`);
    }
  }
}

/** Return the unique solution, or reject an invalid puzzle. */
export function validatePuzzle(puzzle: Board): Board {
  assertBoard(puzzle);
  if (conflicts(puzzle).size > 0) {
    throw new Error("题目中的给定数字冲突。");
  }
  const solutions = solve(puzzle, 2);
  const solution = solutions[0];
  if (!solution) throw new Error("题目无解。");
  if (solutions.length > 1) throw new Error("题目有多个解。");
  return solution;
}
