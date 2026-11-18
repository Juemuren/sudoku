import {
  assertBoard,
  type Board,
  boxOf,
  CELL_COUNT,
  columnOf,
  rowOf,
  SIZE,
} from "./board.ts";
import { candidates, conflicts } from "./rules.ts";

export type UnitKind = "row" | "column" | "box";

export type SolveStep =
  & {
    index: number;
    value: number;
    reason: string;
  }
  & (
    | { technique: "single-candidate" }
    | {
      technique: "single-position";
      unit: { kind: UnitKind; index: number };
    }
  );

/** Find one placement justified by the current board, without guessing. */
export function findHumanStep(board: Board): SolveStep | null {
  assertBoard(board);
  if (conflicts(board).size > 0) return null;

  const options = board.map((value, index) =>
    value === 0 ? candidates(board, index) : []
  );
  // An empty cell with no legal value means this board cannot be continued.
  if (
    options.some((values, index) => board[index] === 0 && values.length === 0)
  ) {
    return null;
  }

  for (let index = 0; index < CELL_COUNT; index++) {
    const values = options[index];
    if (values?.length === 1) {
      const value = values[0]!;
      return {
        index,
        value,
        technique: "single-candidate",
        reason: `第 ${rowOf(index) + 1} 行第 ${
          columnOf(index) + 1
        } 列只有 ${value} 一个候选数。`,
      };
    }
  }

  for (const kind of ["row", "column", "box"] as const) {
    for (let unitIndex = 0; unitIndex < SIZE; unitIndex++) {
      const cells = Array.from({ length: CELL_COUNT }, (_, index) => index)
        .filter((index) => unitOf(kind, index) === unitIndex);
      for (let value = 1; value <= SIZE; value++) {
        if (cells.some((index) => board[index] === value)) continue;
        const places = cells.filter((index) => options[index]?.includes(value));
        if (places.length !== 1) continue;
        const index = places[0]!;
        return {
          index,
          value,
          technique: "single-position",
          unit: { kind, index: unitIndex },
          reason: `第 ${unitIndex + 1} ${
            unitName(kind)
          }中，${value} 只能填在第 ${rowOf(index) + 1} 行第 ${
            columnOf(index) + 1
          } 列。`,
        };
      }
    }
  }
  return null;
}

function unitOf(kind: UnitKind, index: number): number {
  switch (kind) {
    case "row":
      return rowOf(index);
    case "column":
      return columnOf(index);
    case "box":
      return boxOf(index);
  }
}

function unitName(kind: UnitKind): string {
  switch (kind) {
    case "row":
      return "行";
    case "column":
      return "列";
    case "box":
      return "宫";
  }
}
