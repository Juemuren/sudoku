import { Worker } from "node:worker_threads";
import type { GameState } from "../app/gameState.js";
import type { SavedGame } from "../app/saveGame.js";

const VERIFY_TIMEOUT_MS = 5_000;

export function verifySavedGame(saved: SavedGame): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./saveWorker.js", import.meta.url));
    const timer = setTimeout(() => {
      void worker.terminate();
      reject(new Error("题目验证超时，请检查存档。"));
    }, VERIFY_TIMEOUT_MS);
    worker.once(
      "message",
      (result: { ok: boolean; game?: GameState; message?: string }) => {
        clearTimeout(timer);
        void worker.terminate();
        if (result.ok && result.game) resolve(result.game);
        else reject(new Error(result.message ?? "存档验证失败。"));
      },
    );
    worker.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    worker.once("exit", (code) => {
      if (code !== 0) {
        clearTimeout(timer);
        reject(new Error("题目验证进程意外退出。"));
      }
    });
    worker.postMessage(saved);
  });
}
