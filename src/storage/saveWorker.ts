import { parentPort } from "node:worker_threads";
import { restoreSavedGame, type SavedGame } from "../app/saveGame.js";

parentPort?.once("message", (saved: SavedGame) => {
  try {
    parentPort?.postMessage({ ok: true, game: restoreSavedGame(saved) });
  } catch (error) {
    parentPort?.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "存档验证失败。",
    });
  }
});
