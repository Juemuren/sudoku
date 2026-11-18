import { Text } from "ink";
import type { Difficulty } from "../../../domain/generator.ts";
import { colors } from "../../styles/colors.ts";

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
    <Text>
      <Text bold color={colors.eyebrow}>数独</Text>{"  "}
      <Text color={colors.muted}>难度:</Text>
      <Text bold color={colors.text}>{difficultyLabels[difficulty]}</Text>{"  "}
      <Text color={colors.muted}>用时:</Text>
      <Text bold color={colors.accent}>{time}</Text>{"  "}
      <Text color={colors.muted}>空格:</Text>
      <Text bold color={colors.success}>{remaining}</Text>{"  "}
      <Text color={colors.muted}>提示:</Text>
      <Text bold color={colors.warning}>{hintsUsed}</Text>
    </Text>
  );
}
