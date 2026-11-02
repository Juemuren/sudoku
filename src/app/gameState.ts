import {
  type Board,
  CELL_COUNT,
  columnOf,
  rowOf,
  SIZE,
} from "../domain/board.js";
import { type Difficulty, generatePuzzle } from "../domain/generator.js";
import { isSolved } from "../domain/rules.js";

export type GameState = {
  puzzle: Board;
  board: Board;
  solution: Board;
  difficulty: Difficulty;
  selected: number;
  message: string;
  hintsUsed: number;
  startedAt: number;
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
    history: [],
  };
}

export function selectCell(state: GameState, index: number): GameState {
  if (!Number.isInteger(index) || index < 0 || index >= CELL_COUNT)
    return state;
  return { ...state, selected: index };
}

export type Direction = "up" | "down" | "left" | "right";

export function moveSelection(
  state: GameState,
  direction: Direction,
): GameState {
  const row = rowOf(state.selected);
  const column = columnOf(state.selected);
  const nextRow = Math.max(
    0,
    Math.min(
      SIZE - 1,
      row + (direction === "down" ? 1 : direction === "up" ? -1 : 0),
    ),
  );
  const nextColumn = Math.max(
    0,
    Math.min(
      SIZE - 1,
      column + (direction === "right" ? 1 : direction === "left" ? -1 : 0),
    ),
  );
  return selectCell(state, nextRow * SIZE + nextColumn);
}

export function enterValue(state: GameState, value: number): GameState {
  if (!Number.isInteger(value) || value < 0 || value > 9) return state;
  const index = state.selected;
  if (state.puzzle[index] !== 0)
    return { ...state, message: "此格是题目给定数字。" };
  if (state.board[index] === value) return state;
  const board = [...state.board];
  board[index] = value;
  return {
    ...state,
    board,
    history: [...state.history, snapshot(state)],
    message: isSolved(board)
      ? "完成！恭喜解出数独。"
      : value === 0
        ? "已清除。"
        : "已填入。",
  };
}

export function requestHint(state: GameState): GameState {
  const index = state.board.findIndex(
    (value, i) => value !== state.solution[i] && state.puzzle[i] === 0,
  );
  if (index === -1) return { ...state, message: "没有需要提示的格子。" };
  const board = [...state.board];
  const hint = state.solution[index];
  if (hint === undefined) throw new Error("答案棋盘缺少提示数字。");
  board[index] = hint;
  return {
    ...state,
    board,
    history: [...state.history, snapshot(state)],
    selected: index,
    hintsUsed: state.hintsUsed + 1,
    message: isSolved(board)
      ? "完成！恭喜解出数独。"
      : `提示：第 ${Math.floor(index / 9) + 1} 行第 ${(index % 9) + 1} 列是 ${board[index]}。`,
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
    history: state.history.slice(0, -1),
    message: "已撤销。",
  };
}
