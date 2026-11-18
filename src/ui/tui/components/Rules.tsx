import { Box, Text } from "ink";
import { colors } from "../../styles/colors.ts";

export function HorizontalRule({ width }: { width: number }) {
  return <Text color={colors.gridBorder}>{"─".repeat(width)}</Text>;
}

export function VerticalRule({ height }: { height: number }) {
  return (
    <Box flexDirection="column">
      {Array.from(
        { length: height },
        (_, index) => <Text key={index} color={colors.gridBorder}>│</Text>,
      )}
    </Box>
  );
}
