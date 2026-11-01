import { assertBoard, type Board, CELL_COUNT, peers } from "./board.js";

export function candidates(board: Board, index: number): number[] {
  if (index < 0 || index >= CELL_COUNT || board[index] !== 0) return [];
  const used = new Set(peers(index).map((peer) => board[peer]));
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((value) => !used.has(value));
}

export function conflicts(board: Board): Set<number> {
  const result = new Set<number>();
  for (let index = 0; index < CELL_COUNT; index++) {
    const value = board[index];
    if (value === 0) continue;
    for (const peer of peers(index)) {
      if (board[peer] === value) {
        result.add(index);
        result.add(peer);
      }
    }
  }
  return result;
}

export function isSolved(board: Board): boolean {
  assertBoard(board);
  return board.every((value) => value !== 0) && conflicts(board).size === 0;
}
