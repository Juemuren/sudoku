import { restoreSavedGame, type SavedGame } from "../app/saveGame.ts";

self.onmessage = (event: MessageEvent<SavedGame>) => {
  try {
    self.postMessage({ ok: true, game: restoreSavedGame(event.data) });
  } catch (error) {
    self.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "存档验证失败。",
    });
  }
};
