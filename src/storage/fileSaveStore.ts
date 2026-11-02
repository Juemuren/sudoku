import { randomUUID } from "node:crypto";
import { open, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { GameState } from "../app/gameState.js";
import { parseSavedGame, serializeGame } from "../app/saveGame.js";
import { verifySavedGame } from "./verifySavedGame.js";

const MAX_BYTES = 64 * 1024;

export function savePath(input: string): string {
  if (!input.trim()) throw new Error("请输入存档路径。");
  return resolve(input.trim());
}

export async function saveToFile(path: string, game: GameState): Promise<void> {
  const target = savePath(path);
  const temporary = resolve(dirname(target), `.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, serializeGame(game), {
      encoding: "utf8",
      flag: "wx",
    });
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(savePath(path));
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

export async function loadFromFile(path: string): Promise<GameState> {
  const target = savePath(path);
  const handle = await open(target, "r");
  let data: string;
  try {
    const info = await handle.stat();
    if (!info.isFile()) throw new Error("存档路径不是普通文件。");
    if (info.size > MAX_BYTES) throw new Error("存档文件过大。");
    const buffer = Buffer.alloc(MAX_BYTES + 1);
    let bytesRead = 0;
    while (bytesRead < buffer.length) {
      const result = await handle.read(
        buffer,
        bytesRead,
        buffer.length - bytesRead,
        bytesRead,
      );
      if (result.bytesRead === 0) break;
      bytesRead += result.bytesRead;
    }
    if (bytesRead > MAX_BYTES) throw new Error("存档文件过大。");
    data = buffer.toString("utf8", 0, bytesRead);
  } finally {
    await handle.close();
  }
  return verifySavedGame(parseSavedGame(data));
}
