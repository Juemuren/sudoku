#!/usr/bin/env deno
import { App } from "./App.tsx";

// Ink needs an interactive terminal for keyboard input.
if (!process.stdin.isTTY) {
  console.error("请在交互式终端中运行数独游戏。");
  process.exitCode = 1;
} else {
  const { render } = await import("ink");
  render(<App />, { alternateScreen: true });
}
