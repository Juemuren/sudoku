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
} from "../../app/gameState.js";
import { gameStats } from "../../app/gameStats.js";
import type { Difficulty } from "../../domain/generator.js";
import { Footer } from "./Footer.js";
import { Header } from "./Header.js";
import { SudokuBoard } from "./SudokuBoard.js";

export function App() {
  const { exit } = useApp();
  const { columns, rows } = useWindowSize();
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
      return;
    }
    const direction: Direction | undefined = key.upArrow
      ? "up"
      : key.downArrow
        ? "down"
        : key.leftArrow
          ? "left"
          : key.rightArrow
            ? "right"
            : undefined;
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
    const difficulty: Difficulty | undefined =
      input === "e"
        ? "easy"
        : input === "m"
          ? "medium"
          : input === "d"
            ? "hard"
            : undefined;
    if (difficulty) {
      setGame(newGame(difficulty));
      return;
    }
    if (input === "n") setGame((state) => newGame(state.difficulty));
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
          message={game.message}
          solved={solved}
          conflictCount={badCells.size}
        />
      </Box>
    </Box>
  );
}
