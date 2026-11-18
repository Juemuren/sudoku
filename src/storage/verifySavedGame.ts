import type { GameState } from "../app/gameState.ts";
import type { SavedGame } from "../app/saveGame.ts";

const VERIFY_TIMEOUT_MS = 5_000;

type WorkerResult = { ok: boolean; game?: GameState; message?: string };

export function verifySavedGame(saved: SavedGame): Promise<GameState> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./saveWorker.ts", import.meta.url), {
      type: "module",
    });
    const timer = setTimeout(() => {
      finish(() => reject(new Error("题目验证超时，请检查存档。")));
    }, VERIFY_TIMEOUT_MS);

    function finish(settle: () => void) {
      clearTimeout(timer);
      worker.terminate();
      settle();
    }

    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      const result = event.data;
      finish(() => {
        if (result.ok && result.game) resolve(result.game);
        else reject(new Error(result.message ?? "存档验证失败。"));
      });
    };
    worker.onerror = (event) => {
      event.preventDefault();
      finish(() => reject(new Error("题目验证进程意外退出。")));
    };
    worker.postMessage(saved);
  });
}
