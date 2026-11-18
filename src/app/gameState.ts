import {
  type Board,
  CELL_COUNT,
  columnOf,
  rowOf,
  SIZE,
} from "../domain/board.ts";
import { type Difficulty, generatePuzzle } from "../domain/generator.ts";
import { findHumanStep } from "../domain/humanSolver.ts";
import { conflicts, isSolved } from "../domain/rules.ts";

export type GameState = {
  puzzle: Board;
  board: Board;
  solution: Board;
  difficulty: Difficulty;
  selected: number;
  message: string;
  hintsUsed: number;
  startedAt: number;
  elapsedBeforeStart: number;
  history: { board: Board; selected: number; hintsUsed: number }[];
};

export function newGame(difficulty: Difficulty = "medium"): GameState {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return {
    puzzle,
    board: [...puzzle],
    solution,
    difficulty,
    selected: 0,
    message: "方向键移动，1–9 填数。",
    hintsUsed: 0,
    startedAt: Date.now(),
    elapsedBeforeStart: 0,
    history: [],
  };
}

export function selectCell(state: GameState, index: number): GameState {
  if (!Number.isInteger(index) || index < 0 || index >= CELL_COUNT) {
    return state;
  }
  return { ...state, selected: index };
}

export type Direction = "up" | "down" | "left" | "right";

const directionOffsets: Record<Direction, readonly [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

export function moveSelection(
  state: GameState,
  direction: Direction,
): GameState {
  const row = rowOf(state.selected);
  const column = columnOf(state.selected);
  const [rowOffset, columnOffset] = directionOffsets[direction];
  const nextRow = Math.max(0, Math.min(SIZE - 1, row + rowOffset));
  const nextColumn = Math.max(0, Math.min(SIZE - 1, column + columnOffset));
  return selectCell(state, nextRow * SIZE + nextColumn);
}

export function enterValue(state: GameState, value: number): GameState {
  if (!Number.isInteger(value) || value < 0 || value > 9) return state;
  const index = state.selected;
  if (state.puzzle[index] !== 0) {
    return { ...state, message: "此格是题目给定数字。" };
  }
  if (state.board[index] === value) return state;
  const board = [...state.board];
  board[index] = value;
  return {
    ...state,
    board,
    ...clockAfterBoardChange(state, board),
    history: [...state.history, snapshot(state)],
    message: entryMessage(board, value),
  };
}

function entryMessage(board: Board, value: number): string {
  if (isSolved(board)) return "完成！恭喜解出数独。";
  if (value === 0) return "已清除。";
  return "已填入。";
}

export function requestHint(state: GameState): GameState {
  if (conflicts(state.board).size > 0) {
    return { ...state, message: "棋盘中有冲突，请先检查。" };
  }
  if (
    state.board.some((value, index) =>
      value !== 0 && value !== state.solution[index]
    )
  ) {
    return { ...state, message: "棋盘中有填错的数字，请先检查。" };
  }
  const step = findHumanStep(state.board);
  if (!step) {
    return {
      ...state,
      message: isSolved(state.board)
        ? "没有需要提示的格子。"
        : "当前没有可用的基础技巧提示。",
    };
  }
  const board = [...state.board];
  board[step.index] = step.value;
  const explanation = `提示（${
    step.technique === "single-candidate" ? "唯一候选数" : "唯一位置"
  }）：${step.reason}`;
  return {
    ...state,
    board,
    ...clockAfterBoardChange(state, board),
    history: [...state.history, snapshot(state)],
    selected: step.index,
    hintsUsed: state.hintsUsed + 1,
    message: isSolved(board)
      ? `${explanation} 完成！恭喜解出数独。`
      : explanation,
  };
}

function snapshot(state: GameState) {
  return {
    board: state.board,
    selected: state.selected,
    hintsUsed: state.hintsUsed,
  };
}

export function undo(state: GameState): GameState {
  const previous = state.history.at(-1);
  if (!previous) return { ...state, message: "没有可撤销的操作。" };
  return {
    ...state,
    ...previous,
    ...clockAfterBoardChange(state, previous.board),
    history: state.history.slice(0, -1),
    message: "已撤销。",
  };
}

export function elapsedMilliseconds(state: GameState, now: number): number {
  return Math.max(
    0,
    state.elapsedBeforeStart +
      (isSolved(state.board) ? 0 : now - state.startedAt),
  );
}

function clockAfterBoardChange(
  state: GameState,
  board: Board,
): Pick<GameState, "startedAt" | "elapsedBeforeStart"> {
  const wasSolved = isSolved(state.board);
  const solved = isSolved(board);
  if (wasSolved === solved) {
    return {
      startedAt: state.startedAt,
      elapsedBeforeStart: state.elapsedBeforeStart,
    };
  }
  const now = Date.now();
  return solved
    ? {
      startedAt: state.startedAt,
      elapsedBeforeStart: elapsedMilliseconds(state, now),
    }
    : { startedAt: now, elapsedBeforeStart: state.elapsedBeforeStart };
}
