import { elapsedMilliseconds, type GameState } from "./gameState.ts";
import type { GameStore } from "./gameStore.ts";
import type { GameArchive } from "./gameArchive.ts";

export async function saveToStore(
  store: GameStore,
  location: string,
  game: GameState,
  currentLocation: string | null,
  overwrite = false,
): Promise<"saved" | "confirm-overwrite"> {
  if (
    !overwrite && location !== currentLocation && await store.exists(location)
  ) {
    return "confirm-overwrite";
  }
  await store.save(location, game);
  return "saved";
}

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
        elapsedMilliseconds: Math.floor(elapsedMilliseconds(state, now)),
      },
    } satisfies GameArchive,
    null,
    2,
  );
}
