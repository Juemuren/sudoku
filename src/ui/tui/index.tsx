#!/usr/bin/env node
import { Box, Text, useApp, useInput } from "ink";
import { Fragment, useEffect, useState } from "react";
import {
  enterValue,
  type GameState,
  newGame,
  requestHint,
  selectCell,
} from "../../app/gameState.js";
import { columnOf, rowOf } from "../../domain/board.js";
import type { Difficulty } from "../../domain/generator.js";
import { conflicts, isSolved } from "../../domain/rules.js";

const rowKeys = Array.from({ length: 9 }, (_, index) => `row-${index}`);
const columnKeys = Array.from({ length: 9 }, (_, index) => `column-${index}`)

function App() {
  const { exit } = useApp();
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
    if (key.upArrow || key.downArrow || key.leftArrow || key.rightArrow) {
      setGame((state) => {
        const row = rowOf(state.selected);
        const column = columnOf(state.selected);
        const nextRow = Math.max(
          0,
          Math.min(8, row + (key.downArrow ? 1 : key.upArrow ? -1 : 0)),
        );
        const nextColumn = Math.max(
          0,
          Math.min(8, column + (key.rightArrow ? 1 : key.leftArrow ? -1 : 0)),
        );
        return selectCell(state, nextRow * 9 + nextColumn);
      });
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

  const badCells = conflicts(game.board);
  const elapsed = Math.floor((now - game.startedAt) / 1000);
  const time = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const label = { easy: "简单", medium: "中等", hard: "困难" }[game.difficulty];
  const remaining = game.board.filter((value) => value === 0).length;

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        数独 {label} {time} 空格 {remaining} 提示 {game.hintsUsed}
      </Text>
      <Text>┏━━━━━━━┳━━━━━━━┳━━━━━━━┓</Text>
      {rowKeys.map((rowKey, row) => (
        <Fragment key={rowKey}>
          <Text>
            {"┃ "}
            {columnKeys.map((columnKey, column) => {
              const index = row * 9 + column;
              const value = game.board[index];
              const selected = game.selected === index;
              return (
                <Fragment key={columnKey}>
                  <Text
                    bold={game.puzzle[index] !== 0 || selected}
                    color={
                      badCells.has(index)
                        ? "red"
                        : game.puzzle[index] !== 0
                          ? "white"
                          : "cyan"
                    }
                    backgroundColor={selected ? "blue" : undefined}
                  >
                    {value === 0 ? "·" : value}
                  </Text>
                  <Text>
                    {column === 2 || column === 5
                      ? " ┃ "
                      : column === 8
                        ? " ┃"
                        : " "}
                  </Text>
                </Fragment>
              );
            })}
          </Text>
          <Text>
            {row === 2 || row === 5
              ? "┣━━━━━━━╋━━━━━━━╋━━━━━━━┫"
              : row === 8
                ? "┗━━━━━━━┻━━━━━━━┻━━━━━━━┛"
                : ""}
          </Text>
        </Fragment>
      ))}
      <Text
        color={
          isSolved(game.board) ? "green" : badCells.size ? "red" : "yellow"
        }
      >
        {game.message}
        {badCells.size ? `  冲突格：${badCells.size}` : ""}
      </Text>
      <Text dimColor>方向键 移动 1–9 填入 0/退格 清除 h 提示</Text>
      <Text dimColor>e 简单 m 中等 d 困难 n 同难度新局 q 退出</Text>
    </Box>
  );
}

// Ink needs an interactive terminal for keyboard input.
if (!process.stdin.isTTY) {
  console.error("请在交互式终端中运行数独游戏。");
  process.exitCode = 1;
} else {
  const { render } = await import("ink");
  render(<App />);
}
