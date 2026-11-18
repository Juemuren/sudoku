import type { GameState } from "./gameState.ts";

/** Storage operations supplied by the current platform. Locations are opaque to the app. */
export type SaveStore = {
  exists(location: string): Promise<boolean>;
  save(location: string, game: GameState): Promise<void>;
  load(location: string): Promise<GameState>;
};

export async function saveToStore(
  store: SaveStore,
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

export function loadFromStore(
  store: SaveStore,
  location: string,
): Promise<GameState> {
  return store.load(location);
}
