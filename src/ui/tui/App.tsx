import { Box, useApp, useInput, useWindowSize } from "ink";
import { useEffect, useState } from "react";
import {
  type Direction,
  enterValue,
  type GameState,
  moveSelection,
  newGame,
  requestHint,
  undo,
} from "../../app/gameState.ts";
import { gameStats } from "../../app/gameStats.ts";
import type { Difficulty } from "../../domain/generator.ts";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";
import { SaveLoadPrompt } from "./SaveLoadPrompt.tsx";
import { SudokuBoard } from "./SudokuBoard.tsx";
import { useSaveLoad } from "./useSaveLoad.ts";

export function App() {
  const { exit } = useApp();
  const { columns, rows } = useWindowSize();
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());
  const saveLoad = useSaveLoad(game, setGame);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (saveLoad.active || input === "s" || input === "l") return;
    saveLoad.clearStatus();
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
    if (input === "u") {
      setGame(undo);
      return;
    }
    const difficulty = difficultyKeys[input];
    if (difficulty) {
      saveLoad.forgetLocation();
      setGame(newGame(difficulty));
      return;
    }
    if (input === "n") {
      saveLoad.forgetLocation();
      setGame((state) => newGame(state.difficulty));
    }
  });

  const { badCells, solved, remaining, elapsedSeconds } = gameStats(game, now);
  return (
    <Box
      width={columns}
      height={rows}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        flexDirection="column"
        alignItems="center"
        width={Math.min(columns, 64)}
        padding={1}
      >
        <Header
          difficulty={game.difficulty}
          elapsedSeconds={elapsedSeconds}
          remaining={remaining}
          hintsUsed={game.hintsUsed}
        />
        <SudokuBoard game={game} badCells={badCells} />
        <Footer
          message={saveLoad.status || game.message}
          solved={solved}
          conflictCount={badCells.size}
        />
        <SaveLoadPrompt dialog={saveLoad.dialog} busy={saveLoad.busy} />
      </Box>
    </Box>
  );
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
