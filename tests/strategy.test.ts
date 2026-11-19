import assert from "node:assert/strict";
import { findHumanStep } from "../src/domain/strategy.ts";
import { candidates, conflicts } from "../src/domain/rules.ts";

const nakedSingle = [
  ..."530070000600195000098000060800060003400803001700020006060000280000419005000080079",
].map(Number);

const hiddenSingle = [
  ..."504070000002095300100040060009000403426050790003900000000000080000409000300086100",
].map(Number);

Deno.test("唯一候选数给出可验证的数字和说明", () => {
  const step = findHumanStep(nakedSingle);
  assert.ok(step);
  assert.equal(step.technique, "single-candidate");
  assert.equal(step.index, 40);
  assert.equal(step.value, 5);
  assert.deepEqual(candidates(nakedSingle, step.index), [step.value]);
  assert.match(step.reason, /第 5 行第 5 列.*只有 5 一个候选数/);
});

Deno.test("唯一位置给出所属区域和可验证的说明", () => {
  const step = findHumanStep(hiddenSingle);
  assert.ok(step);
  assert.equal(step.technique, "single-position");
  assert.deepEqual(step.unit, { kind: "row", index: 5 });
  assert.equal(step.index, 50);
  assert.equal(step.value, 4);
  assert.deepEqual(
    Array.from({ length: 9 }, (_, column) => 5 * 9 + column)
      .filter((index) => candidates(hiddenSingle, index).includes(4)),
    [step.index],
  );
  assert.match(step.reason, /第 6 行中，4 只能填在第 6 行第 6 列/);
});

Deno.test("没有基础技巧或棋盘冲突时不进行猜测", () => {
  assert.equal(findHumanStep(Array(81).fill(0)), null);
  const conflicted = [...nakedSingle];
  conflicted[2] = 5;
  assert.ok(conflicts(conflicted).size > 0);
  assert.equal(findHumanStep(conflicted), null);
});
