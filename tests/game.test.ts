import assert from "node:assert/strict";
import {
  enterValue,
  newGame,
  requestHint,
  selectCell,
} from "../src/app/gameState.ts";
import { gameStats } from "../src/app/gameStats.ts";
import { generatePuzzle } from "../src/domain/generator.ts";
import { conflicts, isSolved } from "../src/domain/rules.ts";
import { solve } from "../src/domain/solver.ts";

Deno.test("每个难度生成合法且唯一解的题目", () => {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const { puzzle, solution } = generatePuzzle(difficulty);
    assert.equal(puzzle.length, 81);
    assert.equal(conflicts(puzzle).size, 0);
    assert.equal(isSolved(solution), true);
    assert.deepEqual(solve(puzzle, 2), [solution]);
    assert.ok(puzzle.some((value) => value === 0));
  }
});

Deno.test("给定数字不可修改，普通数字可输入和清除", () => {
  const start = newGame("easy");
  const given = start.puzzle.findIndex((value) => value !== 0);
  const empty = start.puzzle.indexOf(0);
  const unchanged = enterValue(selectCell(start, given), 0);
  assert.equal(unchanged.board[given], start.puzzle[given]);
  const correct = start.solution[empty];
  assert.ok(correct !== undefined);
  const entered = enterValue(selectCell(start, empty), correct);
  assert.equal(entered.board[empty], start.solution[empty]);
  assert.equal(enterValue(entered, 0).board[empty], 0);
  assert.equal(start.board[empty], 0);
});

Deno.test("提示填写一个正确数字并记录次数", () => {
  const start = newGame("easy");
  const hinted = requestHint(start);
  assert.equal(hinted.hintsUsed, 1);
  assert.equal(hinted.board[hinted.selected], hinted.solution[hinted.selected]);
  assert.equal(start.board[hinted.selected], 0);
});

Deno.test("手动解出数独后用时不再增加", () => {
  const start = newGame("easy");
  const empty = start.puzzle.indexOf(0);
  const almostDone = {
    ...start,
    board: [...start.solution],
    selected: empty,
    startedAt: Date.now() - 3_000,
  };
  almostDone.board[empty] = 0;
  const solved = enterValue(almostDone, start.solution[empty]!);
  const later = Date.now() + 60_000;
  assert.equal(gameStats(solved, later).solved, true);
  assert.equal(gameStats(solved, later).elapsedSeconds, 3);
});

Deno.test("提示解出数独后用时不再增加", () => {
  const start = newGame("easy");
  const empty = start.puzzle.indexOf(0);
  const almostDone = {
    ...start,
    board: [...start.solution],
    startedAt: Date.now() - 2_000,
  };
  almostDone.board[empty] = 0;
  const solved = requestHint(almostDone);
  assert.equal(gameStats(solved, Date.now() + 30_000).elapsedSeconds, 2);
});
