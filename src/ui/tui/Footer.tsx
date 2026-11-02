import { Box, Text } from "ink";

type Props = {
  message: string;
  solved: boolean;
  conflictCount: number;
};

type KeyHint = {
  key: string;
  action: string;
};

const editingHints: KeyHint[] = [
  { key: "←↑↓→", action: "移动" },
  { key: "1–9", action: "填入" },
  { key: "0/Backspace", action: "清除" },
  { key: "H", action: "提示" },
  { key: "U", action: "撤销" },
];

const gameHints: KeyHint[] = [
  { key: "E", action: "简单" },
  { key: "M", action: "中等" },
  { key: "D", action: "困难" },
  { key: "N", action: "新局" },
  { key: "Q", action: "退出" },
];

function KeyGroup({ title, hints }: { title: string; hints: KeyHint[] }) {
  return (
    <Box flexWrap="wrap" justifyContent="center" columnGap={2}>
      <Text bold color="black" backgroundColor="cyan">
        {` ${title} `}
      </Text>
      {hints.map(({ key, action }) => (
        <Box key={key}>
          <Text bold color="cyan">
            [{key}]
          </Text>
          <Text dimColor> {action}</Text>
        </Box>
      ))}
    </Box>
  );
}

export function Footer({ message, solved, conflictCount }: Props) {
  return (
    <Box flexDirection="column" alignItems="center" width="100%">
      <Text color={solved ? "green" : conflictCount ? "red" : "yellow"}>
        {message}
        {conflictCount ? `冲突格：${conflictCount}` : ""}
      </Text>
      <Box flexDirection="column" marginTop={1} width="100%">
        <KeyGroup title="操作" hints={editingHints} />
        <KeyGroup title="对局" hints={gameHints} />
      </Box>
    </Box>
  );
}
