import { Text } from "ink";
import type { Difficulty } from "../../../domain/generator.ts";
import { terminalColors } from "../../styles/colors.ts";

const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

type Props = {
  difficulty: Difficulty;
  elapsedSeconds: number;
  remaining: number;
  hintsUsed: number;
};

export function Header({
  difficulty,
  elapsedSeconds,
  remaining,
  hintsUsed,
}: Props) {
  const time = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${
    String(elapsedSeconds % 60).padStart(2, "0")
  }`;

  return (
    <Text bold color={terminalColors.accent}>
      数独 {difficultyLabels[difficulty]} {time} 空格 {remaining} 提示{" "}
      {hintsUsed}
    </Text>
  );
}
