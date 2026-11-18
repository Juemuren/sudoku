import { Box, Text } from "ink";
import { KEY_GROUP_GAP, SECTION_GAP } from "../layout.ts";
import { colors } from "../../styles/colors.ts";

type Props = {
  message: string;
  solved: boolean;
  conflictCount: number;
  compact: boolean;
  showHelp: boolean;
  collapsed: boolean;
};

function HintRow({
  items,
}: {
  items: { keyLabel: string; action: string }[];
}) {
  return (
    <Box columnGap={KEY_GROUP_GAP}>
      {items.map(({ keyLabel, action }) => (
        <Box key={keyLabel}>
          <Text color={colors.accentText}>{keyLabel}</Text>
          <Text color={colors.muted}>{` ${action}`}</Text>
        </Box>
      ))}
    </Box>
  );
}

export function Footer({
  message,
  solved,
  conflictCount,
  compact,
  showHelp,
  collapsed,
}: Props) {
  const status = `${message}${
    conflictCount ? ` 冲突格：${conflictCount}` : ""
  }`;
  return (
    <Box flexDirection="column" width="100%">
      <Text color={messageColor(solved, conflictCount)} wrap="truncate-end">
        {status}
      </Text>
      {compact && (collapsed && !showHelp
        ? <Text color={colors.muted}>? 查看按键</Text>
        : (
          <Box flexDirection="column" marginTop={SECTION_GAP}>
            <HintRow
              items={[
                { keyLabel: "←↑↓→", action: "移动" },
                { keyLabel: "1–9", action: "填入" },
                { keyLabel: "0/⌫", action: "清除" },
              ]}
            />
            <HintRow
              items={[
                { keyLabel: "U", action: "撤销" },
                { keyLabel: "H", action: "提示" },
                { keyLabel: "E/M/D", action: "难度" },
              ]}
            />
            <HintRow
              items={[
                { keyLabel: "N", action: "新局" },
                { keyLabel: "Q", action: "退出" },
                { keyLabel: "S", action: "保存" },
                { keyLabel: "L", action: "加载" },
              ]}
            />
            {collapsed && <Text color={colors.muted}>? 返回棋盘</Text>}
          </Box>
        ))}
    </Box>
  );
}

function messageColor(solved: boolean, conflictCount: number) {
  if (solved) return colors.success;
  if (conflictCount) return colors.conflict;
  return colors.warning;
}
