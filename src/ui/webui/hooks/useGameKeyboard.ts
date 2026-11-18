import { type Dispatch, type SetStateAction, useEffect } from "react";
import {
  enterValue,
  type GameState,
  moveSelection,
  requestHint,
  undo,
} from "../../../app/gameState.ts";
import type { Difficulty } from "../../../domain/generator.ts";

type Options = {
  game: GameState;
  setGame: Dispatch<SetStateAction<GameState>>;
  blocked: boolean;
  startNewGame: (difficulty: Difficulty) => void;
  save: () => void;
  openFilePicker: () => void;
};

const directions = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
} as const;

export function useGameKeyboard({
  game,
  setGame,
  blocked,
  startNewGame,
  save,
  openFilePicker,
}: Options) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (blocked || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest("input, textarea, select"))
      ) return;

      const direction = directions[event.key as keyof typeof directions];
      if (direction) {
        event.preventDefault();
        setGame((current) => moveSelection(current, direction));
      } else if (/^[1-9]$/.test(event.key)) {
        setGame((current) => enterValue(current, Number(event.key)));
      } else if (
        event.key === "0" || event.key === "Backspace" ||
        event.key === "Delete"
      ) {
        event.preventDefault();
        setGame((current) => enterValue(current, 0));
      } else if (event.key.toLowerCase() === "h") {
        setGame(requestHint);
      } else if (event.key.toLowerCase() === "u") {
        setGame(undo);
      } else if (event.key.toLowerCase() === "n") {
        startNewGame(game.difficulty);
      } else if (event.key.toLowerCase() === "e") {
        startNewGame("easy");
      } else if (event.key.toLowerCase() === "m") {
        startNewGame("medium");
      } else if (event.key.toLowerCase() === "d") {
        startNewGame("hard");
      } else if (event.key.toLowerCase() === "s") {
        save();
      } else if (event.key.toLowerCase() === "l") {
        openFilePicker();
      }
    }
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  });
}
