import { Box, Text } from "ink";
import type { Difficulty } from "../../../domain/generator.ts";
import { colors } from "../../styles/colors.ts";

const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};
const titleDivider = " / ";

type Props = {
  difficulty: Difficulty;
  elapsedSeconds: number;
  remaining: number;
  hintsUsed: number;
  compact: boolean;
};

export function Header({
  difficulty,
  elapsedSeconds,
  remaining,
  hintsUsed,
  compact,
}: Props) {
  const time = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${
    String(elapsedSeconds % 60).padStart(2, "0")
  }`;

  return (
    <Box width="100%" justifyContent="space-between">
      <Text wrap="truncate-end">
        <Text bold color={colors.eyebrow}>数独</Text>
        <Text color={colors.muted}>{titleDivider}</Text>
        <Text bold color={colors.text}>{difficultyLabels[difficulty]}</Text>
      </Text>
      <Text wrap="truncate-end">
        <Text color={colors.muted}>{compact ? " " : "用时 "}</Text>
        <Text color={colors.accent}>{time}</Text>
        <Text color={colors.muted}>{compact ? " 空" : "   空格 "}</Text>
        <Text color={colors.success}>{remaining}</Text>
        <Text color={colors.muted}>{compact ? " 提" : "   提示 "}</Text>
        <Text color={colors.warning}>{hintsUsed}</Text>
      </Text>
    </Box>
  );
}
