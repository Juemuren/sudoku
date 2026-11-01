import assert from "node:assert/strict";
import test from "node:test";
import {
  enterValue,
  newGame,
  requestHint,
  selectCell,
} from "../src/app/gameState.js";
import { generatePuzzle } from "../src/domain/generator.js";
import { conflicts, isSolved } from "../src/domain/rules.js";
import { solve } from "../src/domain/solver.js";

test("每个难度生成合法且唯一解的题目", () => {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const { puzzle, solution } = generatePuzzle(difficulty);
    assert.equal(puzzle.length, 81);
    assert.equal(conflicts(puzzle).size, 0);
    assert.equal(isSolved(solution), true);
    assert.deepEqual(solve(puzzle, 2), [solution]);
    assert.ok(puzzle.some((value) => value === 0));
  }
});

test("给定数字不可修改，普通数字可输入和清除", () => {
  const start = newGame("easy");
  const given = start.puzzle.findIndex((value) => value !== 0);
  const empty = start.puzzle.findIndex((value) => value === 0);
  const unchanged = enterValue(selectCell(start, given), 0);
  assert.equal(unchanged.board[given], start.puzzle[given]);
  const entered = enterValue(selectCell(start, empty), start.solution[empty]!);
  assert.equal(entered.board[empty], start.solution[empty]);
  assert.equal(enterValue(entered, 0).board[empty], 0);
  assert.equal(start.board[empty], 0);
});

test("提示填写一个正确数字并记录次数", () => {
  const start = newGame("easy");
  const hinted = requestHint(start);
  assert.equal(hinted.hintsUsed, 1);
  assert.equal(hinted.board[hinted.selected], hinted.solution[hinted.selected]);
  assert.equal(start.board[hinted.selected], 0);
});
