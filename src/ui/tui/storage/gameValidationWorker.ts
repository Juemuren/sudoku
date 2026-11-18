import { restoreGame } from "../../../app/gameLoad.ts";
import type { GameArchive } from "../../../app/gameArchive.ts";

self.onmessage = (event: MessageEvent<GameArchive>) => {
  try {
    self.postMessage({ ok: true, game: restoreGame(event.data) });
  } catch (error) {
    self.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "存档验证失败。",
    });
  }
};
