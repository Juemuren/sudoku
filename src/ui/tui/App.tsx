import { Box, Text, useApp, useInput, useWindowSize } from "ink";
import { useEffect, useState } from "react";
import {
  type Direction,
  enterValue,
  type GameState,
  moveSelection,
  newGame,
  requestHint,
} from "../../app/gameState.js";
import { gameStats } from "../../app/gameStats.js";
import type { Difficulty } from "../../domain/generator.js";
import { SudokuBoard } from "./SudokuBoard.js";

const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

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
  const time = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;

  return (
    <Box
      width={columns}
      height={rows}
      justifyContent="center"
      alignItems="center"
    >
      <Box flexDirection="column" padding={1}>
        <Text bold color="cyan">
          数独 {difficultyLabels[game.difficulty]} {time} 空格 {remaining} 提示{" "}
          {game.hintsUsed}
        </Text>
        <SudokuBoard game={game} badCells={badCells} />
        <Text color={solved ? "green" : badCells.size ? "red" : "yellow"}>
          {game.message}
          {badCells.size ? `  冲突格：${badCells.size}` : ""}
        </Text>
        <Text dimColor>方向键 移动 1–9 填入 0/退格 清除 h 提示</Text>
        <Text dimColor>e 简单 m 中等 d 困难 n 同难度新局 q 退出</Text>
      </Box>
    </Box>
  );
}
