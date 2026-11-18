import { dirname, resolve } from "@std/path";
import type { GameState } from "../app/gameState.ts";
import type { GameStore } from "../app/gameStore.ts";
import { parseGameArchive } from "../app/gameLoad.ts";
import { serializeGame } from "../app/gameSave.ts";
import { validateGameArchive } from "./validateGameArchive.ts";

const MAX_BYTES = 64 * 1024;

export function resolveGameArchivePath(input: string): string {
  if (!input.trim()) throw new Error("请输入存档路径。");
  return resolve(input.trim());
}

export async function saveToFile(path: string, game: GameState): Promise<void> {
  const target = resolveGameArchivePath(path);
  const temporary = resolve(dirname(target), `.${crypto.randomUUID()}.tmp`);
  try {
    await Deno.writeTextFile(temporary, serializeGame(game), {
      createNew: true,
    });
    await Deno.rename(temporary, target);
  } finally {
    await Deno.remove(temporary).catch((error) => {
      if (!(error instanceof Deno.errors.NotFound)) throw error;
    });
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(resolveGameArchivePath(path));
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}

export async function loadFromFile(path: string): Promise<GameState> {
  const target = resolveGameArchivePath(path);
  const handle = await Deno.open(target, { read: true });
  let data: string;
  try {
    const info = await handle.stat();
    if (!info.isFile) throw new Error("存档路径不是普通文件。");
    if (info.size > MAX_BYTES) throw new Error("存档文件过大。");
    const buffer = new Uint8Array(MAX_BYTES + 1);
    let bytesRead = 0;
    while (bytesRead < buffer.length) {
      const count = await handle.read(buffer.subarray(bytesRead));
      if (count === null) break;
      bytesRead += count;
    }
    if (bytesRead > MAX_BYTES) throw new Error("存档文件过大。");
    data = new TextDecoder().decode(buffer.subarray(0, bytesRead));
  } finally {
    handle.close();
  }
  return validateGameArchive(parseGameArchive(data));
}

export const fileGameStore: GameStore = {
  exists: fileExists,
  save: saveToFile,
  load: loadFromFile,
};
