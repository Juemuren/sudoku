import { type Board, CELL_COUNT } from './board.js';
import { shuffle, solve } from './solver.js';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Puzzle = { puzzle: Board; solution: Board; difficulty: Difficulty };

const clueTargets: Record<Difficulty, number> = { easy: 40, medium: 34, hard: 28 };

export function generatePuzzle(difficulty: Difficulty = 'medium'): Puzzle {
  const solution = solve(Array(CELL_COUNT).fill(0) as Board, 1, true)[0];
  if (!solution) throw new Error('无法生成完整棋盘。');
  const puzzle = [...solution];
  for (const index of shuffle(Array.from({ length: CELL_COUNT }, (_, i) => i))) {
    if (puzzle.filter((value) => value !== 0).length <= clueTargets[difficulty]) break;
    const saved = puzzle[index]!;
    puzzle[index] = 0;
    if (solve(puzzle, 2).length !== 1) puzzle[index] = saved;
  }
  return { puzzle, solution, difficulty };
}
