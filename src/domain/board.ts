export const SIZE = 9;
export const CELL_COUNT = SIZE * SIZE;
export type Board = number[];

export function assertBoard(board: Board): void {
  if (board.length !== CELL_COUNT || board.some((value) => !Number.isInteger(value) || value < 0 || value > 9)) {
    throw new Error('棋盘必须包含 81 个 0–9 的整数。');
  }
}

export function rowOf(index: number): number {
  return Math.floor(index / SIZE);
}

export function columnOf(index: number): number {
  return index % SIZE;
}

export function boxOf(index: number): number {
  return Math.floor(rowOf(index) / 3) * 3 + Math.floor(columnOf(index) / 3);
}

export function peers(index: number): number[] {
  const result: number[] = [];
  for (let other = 0; other < CELL_COUNT; other++) {
    if (other !== index && (rowOf(other) === rowOf(index) || columnOf(other) === columnOf(index) || boxOf(other) === boxOf(index))) {
      result.push(other);
    }
  }
  return result;
}
