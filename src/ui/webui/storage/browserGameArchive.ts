import type { GameState } from "../../../app/gameState.ts";
import { parseGameArchive, restoreGame } from "../../../app/gameLoad.ts";
import { serializeGame } from "../../../app/gameSave.ts";

const MAX_BYTES = 64 * 1024;

export async function readArchiveFile(file: File): Promise<GameState> {
  if (file.size > MAX_BYTES) throw new Error("存档文件过大。");
  return restoreGame(parseGameArchive(await file.text()));
}

export function downloadArchive(game: GameState): void {
  const blob = new Blob([serializeGame(game)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sudoku-archive.json";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
