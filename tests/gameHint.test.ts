import assert from "node:assert/strict";
import { requestAnswer, requestHint } from "../src/app/gameHint.ts";
import { enterValue, newGame, selectCell, undo } from "../src/app/gameState.ts";
import { gameStats } from "../src/app/gameStats.ts";

Deno.test("答案修正首个错误格，记录次数且可撤销", () => {
  const start = newGame("easy");
  const empty = start.board.indexOf(0);
  const wrong = start.solution[empty] === 1 ? 2 : 1;
  const entered = enterValue(selectCell(start, empty), wrong);
  const answered = requestAnswer(entered);
  assert.equal(answered.selected, empty);
  assert.equal(answered.board[empty], start.solution[empty]);
  assert.equal(answered.hintsUsed, entered.hintsUsed + 1);
  assert.match(answered.message, /答案：第 .*列是/);
  const reverted = undo(answered);
  assert.deepEqual(reverted.board, entered.board);
  assert.equal(reverted.hintsUsed, entered.hintsUsed);
});

Deno.test("完成棋盘后答案不改棋盘或计数", () => {
  const start = newGame("easy");
  const complete = { ...start, board: [...start.solution] };
  const answered = requestAnswer(complete);
  assert.deepEqual(answered.board, complete.board);
  assert.equal(answered.hintsUsed, complete.hintsUsed);
  assert.equal(answered.message, "没有需要答案的格子。");
});

Deno.test("人类提示填写可解释的一步并记录次数", () => {
  const start = newGame("easy");
  const hinted = requestHint(start);
  assert.equal(hinted.hintsUsed, 1);
  assert.equal(hinted.board[hinted.selected], hinted.solution[hinted.selected]);
  assert.equal(start.board[hinted.selected], 0);
  assert.match(hinted.message, /提示（唯一候选数|唯一位置）：/);
});

Deno.test("错误填数时人类提示不改棋盘或计数", () => {
  const start = newGame("easy");
  const empty = start.board.indexOf(0);
  const wrong = start.solution[empty] === 1 ? 2 : 1;
  const entered = enterValue(selectCell(start, empty), wrong);
  const hinted = requestHint(entered);
  assert.deepEqual(hinted.board, entered.board);
  assert.equal(hinted.hintsUsed, entered.hintsUsed);
  assert.match(hinted.message, /冲突|填错/);
});

Deno.test("人类提示解出数独后用时不再增加", () => {
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
  assert.match(solved.message, /提示（唯一候选数）：.*完成！/);
});
