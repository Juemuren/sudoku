import { columnOf, rowOf } from "../domain/board.ts";
import { findHumanStep } from "../domain/humanSolver.ts";
import { conflicts, isSolved } from "../domain/rules.ts";
import { fillHintCell, type GameState } from "./gameState.ts";

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
  const explanation = `提示（${
    step.technique === "single-candidate" ? "唯一候选数" : "唯一位置"
  }）：${step.reason}`;
  return fillHintCell(state, step.index, step.value, explanation);
}

/** Fill the first editable cell that differs from the stored solution. */
export function requestAnswer(state: GameState): GameState {
  const index = state.board.findIndex(
    (value, i) => value !== state.solution[i] && state.puzzle[i] === 0,
  );
  if (index === -1) return { ...state, message: "没有需要答案的格子。" };
  const value = state.solution[index];
  if (value === undefined) throw new Error("答案棋盘缺少数字。");
  const explanation = `答案：第 ${rowOf(index) + 1} 行第 ${
    columnOf(index) + 1
  } 列是 ${value}。`;
  return fillHintCell(state, index, value, explanation);
}
