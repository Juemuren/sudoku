import assert from "node:assert/strict";
import type { GameState } from "../src/app/gameState.ts";
import {
  loadFromStore,
  type SaveStore,
  saveToStore,
} from "../src/app/saveLoad.ts";

Deno.test("已有存档需要确认覆盖，确认后才写入", async () => {
  let writes = 0;
  let checks = 0;
  const game = {} as GameState;
  const store: SaveStore = {
    exists: (_location) => {
      checks++;
      return Promise.resolve(true);
    },
    save: (_location, saved) => {
      assert.equal(saved, game);
      writes++;
      return Promise.resolve();
    },
    load: (_location) => Promise.resolve(game),
  };

  assert.equal(
    await saveToStore(store, "slot", game, null),
    "confirm-overwrite",
  );
  assert.equal(writes, 0);
  assert.equal(await saveToStore(store, "slot", game, null, true), "saved");
  assert.equal(await saveToStore(store, "slot", game, "slot"), "saved");
  assert.equal(writes, 2);
  assert.equal(checks, 1);
  assert.equal(await loadFromStore(store, "slot"), game);
});
