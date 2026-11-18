import type { GameState } from "./gameState.ts";
import type { GameStore } from "./gameStore.ts";
import { type GameArchive, gameArchiveSchema } from "./gameArchive.ts";
import { assertCluesPreserved, validatePuzzle } from "../domain/validation.ts";

export function loadFromStore(
  store: GameStore,
  location: string,
): Promise<GameState> {
  return store.load(location);
}

export function parseGameArchive(json: string): GameArchive {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    throw new Error("存档不是有效的 JSON。");
  }
  const parsed = gameArchiveSchema.safeParse(value);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(`存档格式错误：${issue?.path.join(".") || "根对象"}。`);
  }
  return parsed.data;
}

export function restoreGame(fileData: GameArchive): GameState {
  const {
    puzzle,
    board,
    difficulty,
    selected,
    hintsUsed,
    elapsedMilliseconds,
  } = fileData.game;
  assertCluesPreserved(puzzle, board);
  const solution = validatePuzzle(puzzle);
  return {
    puzzle: [...puzzle],
    board: [...board],
    solution,
    difficulty,
    selected,
    hintsUsed,
    elapsedBeforeStart: elapsedMilliseconds,
    startedAt: Date.now(),
    history: [],
    message: "已加载存档。",
  };
}
