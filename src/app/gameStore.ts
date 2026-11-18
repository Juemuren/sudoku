import type { GameState } from "./gameState.ts";

/** Storage operations supplied by the current platform. Locations are opaque to the app. */
export type GameStore = {
  exists(location: string): Promise<boolean>;
  save(location: string, game: GameState): Promise<void>;
  load(location: string): Promise<GameState>;
};
