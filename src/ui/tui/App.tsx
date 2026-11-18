import { Box, Text, useApp, useInput, useWindowSize } from "ink";
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
import { colors } from "../styles/colors.ts";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { SudokuBoard } from "./components/SudokuBoard.tsx";
import { useGameArchive } from "./hooks/useGameArchive.ts";

export function App() {
  const { exit } = useApp();
  const { columns, rows } = useWindowSize();
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());
  const [showHelp, setShowHelp] = useState(false);
  const gameArchive = useGameArchive(game, setGame);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (gameArchive.active || input === "s" || input === "l") return;
    gameArchive.clearStatus();
    if (input === "?" && columns < 64 && rows < 22) {
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
    if (input === "u") {
      setGame(undo);
      return;
    }
    const difficulty = difficultyKeys[input];
    if (difficulty) {
      gameArchive.forgetLocation();
      setGame(newGame(difficulty));
      return;
    }
    if (input === "n") {
      gameArchive.forgetLocation();
      setGame((state) => newGame(state.difficulty));
    }
  });

  const { badCells, solved, remaining, elapsedSeconds } = gameStats(game, now);
  const compact = columns < 64;
  const collapsed = compact && rows < 22;
  const showBoard = !(collapsed && showHelp);
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
          compact={compact}
        />
        {!compact && <Text color={colors.gridBorder}>{"─".repeat(62)}</Text>}
        {showBoard && (
          <Box
            width="100%"
            justifyContent="center"
            marginTop={compact ? 0 : 1}
            marginBottom={1}
          >
            <Box width={25} flexShrink={0} flexDirection="column">
              <SudokuBoard game={game} badCells={badCells} />
            </Box>
            {!compact && (
              <>
                <Box marginX={2} flexDirection="column">
                  {Array.from(
                    { length: 13 },
                    (_, index) => (
                      <Text key={index} color={colors.gridBorder}>│</Text>
                    ),
                  )}
                </Box>
                <Box width={32} flexDirection="column">
                  <Sidebar
                    game={game}
                    badCells={badCells}
                    dialog={gameArchive.dialog}
                    busy={gameArchive.busy}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
        {compact && gameArchive.active && (
          <Sidebar
            game={game}
            badCells={badCells}
            dialog={gameArchive.dialog}
            busy={gameArchive.busy}
            compact
          />
        )}
        <Footer
          message={gameArchive.status ||
            (gameArchive.active ? " " : game.message)}
          solved={solved}
          conflictCount={badCells.size}
          compact={compact && !gameArchive.active}
          showHelp={showHelp}
          collapsed={collapsed}
        />
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
