import { z } from "zod";
import { CELL_COUNT } from "../domain/board.ts";

const boardSchema = z.array(z.number().int().min(0).max(9)).length(CELL_COUNT);

export const gameArchiveSchema = z.object({
  version: z.literal(1),
  game: z.object({
    puzzle: boardSchema,
    board: boardSchema,
    difficulty: z.enum(["easy", "medium", "hard"]),
    selected: z.number().int().min(0).max(CELL_COUNT - 1),
    hintsUsed: z.number().int().nonnegative().safe(),
    elapsedMilliseconds: z.number().int().nonnegative().safe(),
  }),
});

export type GameArchive = z.infer<typeof gameArchiveSchema>;
