import assert from "node:assert/strict";
import { join } from "@std/path";
import type { GameState } from "../src/app/gameState.ts";
import { loadFromFile, saveToFile } from "../src/storage/fileGameStore.ts";

const puzzle =
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
    .split("")
    .map(Number);
const solution =
  "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    .split("")
    .map(Number);

function game(): GameState {
  return {
    puzzle: [...puzzle],
    board: [...puzzle],
    solution: [...solution],
    difficulty: "medium",
    selected: 2,
    hintsUsed: 1,
    startedAt: Date.now() - 3_000,
    elapsedBeforeStart: 12_000,
    history: [],
    message: "测试对局",
  };
}

async function withGameArchive(run: (path: string) => Promise<void>) {
  const root = join(Deno.cwd(), ".tmp");
  await Deno.mkdir(root, { recursive: true });
  const directory = await Deno.makeTempDir({
    dir: root,
    prefix: "game-archive-test-",
  });
  try {
    await run(join(directory, "game.json"));
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

Deno.test("保存后恢复进度和计时，保留玩家填错的数字", async () => {
  await withGameArchive(async (path) => {
    const current = game();
    current.board[2] = 9;
    await saveToFile(path, current);
    const restored = await loadFromFile(path);
    assert.deepEqual(restored.puzzle, puzzle);
    assert.deepEqual(restored.solution, solution);
    assert.equal(restored.board[2], 9);
    assert.equal(restored.selected, 2);
    assert.equal(restored.hintsUsed, 1);
    assert.ok(restored.elapsedBeforeStart >= 15_000);
    assert.deepEqual(restored.history, []);
    await saveToFile(path, restored);
    assert.equal((await loadFromFile(path)).board[2], 9);
  });
});

Deno.test("格式错误和改动给定数字的存档不能加载", async () => {
  await withGameArchive(async (path) => {
    await Deno.writeTextFile(path, "{bad json");
    await assert.rejects(loadFromFile(path), /JSON/);
    await Deno.writeTextFile(path, JSON.stringify({ version: 2, game: {} }));
    await assert.rejects(loadFromFile(path), /存档格式错误/);
    const saved = {
      version: 1,
      game: {
        puzzle,
        board: [...puzzle],
        difficulty: "medium",
        selected: 2,
        hintsUsed: 0,
        elapsedMilliseconds: 0,
      },
    };
    saved.game.board[0] = 0;
    await Deno.writeTextFile(path, JSON.stringify(saved));
    await assert.rejects(loadFromFile(path), /修改/);
  });
});

Deno.test("过大的存档在解析前被拒绝", async () => {
  await withGameArchive(async (path) => {
    await Deno.writeTextFile(path, " ".repeat(64 * 1024 + 1));
    await assert.rejects(loadFromFile(path), /过大/);
  });
});

Deno.test("给定数字冲突和多解题目不能加载", async () => {
  await withGameArchive(async (path) => {
    const saved = {
      version: 1,
      game: {
        puzzle: [...puzzle],
        board: [...puzzle],
        difficulty: "medium",
        selected: 0,
        hintsUsed: 0,
        elapsedMilliseconds: 0,
      },
    };
    saved.game.puzzle[2] = 5;
    saved.game.board[2] = 5;
    await Deno.writeTextFile(path, JSON.stringify(saved));
    await assert.rejects(loadFromFile(path), /冲突/);
    saved.game.puzzle = Array(81).fill(0);
    saved.game.board = Array(81).fill(0);
    await Deno.writeTextFile(path, JSON.stringify(saved));
    await assert.rejects(loadFromFile(path), /多个解/);
  });
});
