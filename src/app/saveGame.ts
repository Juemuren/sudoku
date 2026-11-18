import { z } from "zod";
import { CELL_COUNT } from "../domain/board.ts";
import { assertCluesPreserved, validatePuzzle } from "../domain/validation.ts";
import type { GameState } from "./gameState.ts";

const boardSchema = z.array(z.number().int().min(0).max(9)).length(CELL_COUNT);
const saveSchema = z.object({
  version: z.literal(1),
  game: z.object({
    puzzle: boardSchema,
    board: boardSchema,
    difficulty: z.enum(["easy", "medium", "hard"]),
    selected: z
      .number()
      .int()
      .min(0)
      .max(CELL_COUNT - 1),
    hintsUsed: z.number().int().nonnegative().safe(),
    elapsedMilliseconds: z.number().int().nonnegative().safe(),
  }),
});

export type SavedGame = z.infer<typeof saveSchema>;

export function serializeGame(state: GameState, now = Date.now()): string {
  return JSON.stringify(
    {
      version: 1,
      game: {
        puzzle: state.puzzle,
        board: state.board,
        difficulty: state.difficulty,
        selected: state.selected,
        hintsUsed: state.hintsUsed,
        elapsedMilliseconds: Math.max(
          0,
          Math.floor(state.elapsedBeforeStart + now - state.startedAt),
        ),
      },
    } satisfies SavedGame,
    null,
    2,
  );
}

export function parseSavedGame(json: string): SavedGame {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    throw new Error("存档不是有效的 JSON。");
  }
  const parsed = saveSchema.safeParse(value);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(`存档格式错误：${issue?.path.join(".") || "根对象"}。`);
  }
  return parsed.data;
}

export function restoreSavedGame(saved: SavedGame): GameState {
  const {
    puzzle,
    board,
    difficulty,
    selected,
    hintsUsed,
    elapsedMilliseconds,
  } = saved.game;
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
