import { useApp, useInput } from "ink";
import { useEffect, useState } from "react";
import { requestAnswer, requestHint } from "../../../app/gameHint.ts";
import {
  type Direction,
  enterValue,
  type GameState,
  moveSelection,
  newGame,
  undo,
} from "../../../app/gameState.ts";
import type { Difficulty } from "../../../domain/generator.ts";
import { useGameArchive } from "./useGameArchive.ts";
import {
  CLOCK_TICK_MS,
  EXPANDED_COMPACT_MIN_ROWS,
  SCREEN_WIDTH,
} from "../layout.ts";

export function useGameSession(columns: number, rows: number) {
  const { exit } = useApp();
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());
  const [showHelp, setShowHelp] = useState(false);
  const archive = useGameArchive(game, setGame);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (archive.active || input === "s" || input === "l") return;
    archive.clearStatus();
    if (
      input === "?" && columns < SCREEN_WIDTH &&
      rows < EXPANDED_COMPACT_MIN_ROWS
    ) {
      setShowHelp((value) => !value);
      return;
    }
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
      return;
    }
    const direction = arrowDirection(key);
    if (direction) {
      setGame((state) => moveSelection(state, direction));
      return;
    }
    if (/^[1-9]$/.test(input)) {
      setGame((state) => enterValue(state, Number(input)));
      return;
    }
    if (input === "0" || key.backspace || key.delete) {
      setGame((state) => enterValue(state, 0));
      return;
    }
    if (input === "h") {
      setGame(requestHint);
      return;
    }
    if (input === "a") {
      setGame(requestAnswer);
      return;
    }
    if (input === "u") {
      setGame(undo);
      return;
    }
    const difficulty = difficultyKeys[input];
    if (difficulty) {
      archive.forgetLocation();
      setGame(newGame(difficulty));
      return;
    }
    if (input === "n") {
      archive.forgetLocation();
      setGame((state) => newGame(state.difficulty));
    }
  });

  return { game, now, showHelp, archive };
}

const difficultyKeys: Record<string, Difficulty | undefined> = {
  e: "easy",
  m: "medium",
  d: "hard",
};

function arrowDirection(key: {
  upArrow: boolean;
  downArrow: boolean;
  leftArrow: boolean;
  rightArrow: boolean;
}): Direction | undefined {
  if (key.upArrow) return "up";
  if (key.downArrow) return "down";
  if (key.leftArrow) return "left";
  if (key.rightArrow) return "right";
}
