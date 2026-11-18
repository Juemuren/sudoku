import { Box, Text } from "ink";
import type { GameState } from "../../../app/gameState.ts";
import type { GameArchiveDialog } from "../hooks/useGameArchive.ts";
import { colors } from "../../styles/colors.ts";

const blankLine = " ";

type Props = {
  game: GameState;
  badCells: Set<number>;
  dialog: GameArchiveDialog;
  busy: boolean;
  compact?: boolean;
};

function Label({ children }: { children: string }) {
  return <Text bold color={colors.eyebrow}>{children}</Text>;
}

function KeyAction({
  keyLabel,
  action,
  width,
}: {
  keyLabel: string;
  action: string;
  width?: number;
}) {
  return (
    <Box width={width} flexShrink={0}>
      <Text color={colors.accentText}>{keyLabel}</Text>
      <Text color={colors.muted}>{` ${action}`}</Text>
    </Box>
  );
}

function KeyLine({ keyLabel, action }: { keyLabel: string; action: string }) {
  return (
    <Box width="100%">
      <Box width={8} flexShrink={0}>
        <Text color={colors.accentText}>{keyLabel}</Text>
      </Box>
      <Text color={colors.muted}>{action}</Text>
    </Box>
  );
}

function KeyRow({
  items,
}: {
  items: { keyLabel: string; action: string }[];
}) {
  return (
    <Box width="100%" columnGap={3}>
      {items.map(({ keyLabel, action }) => (
        <KeyAction key={keyLabel} keyLabel={keyLabel} action={action} />
      ))}
    </Box>
  );
}

export function Sidebar(
  { game, badCells, dialog, busy, compact = false }: Props,
) {
  if (busy || dialog) {
    return <ArchivePanel dialog={dialog} busy={busy} compact={compact} />;
  }
  if (compact) return null;

  const row = Math.floor(game.selected / 9) + 1;
  const column = game.selected % 9 + 1;
  const cellState = badCells.has(game.selected)
    ? "冲突"
    : game.puzzle[game.selected] !== 0
    ? "题目给定"
    : "可填写";

  return (
    <Box flexDirection="column" width="100%" height={13}>
      <Label>操作</Label>
      <KeyLine keyLabel="←↑↓→" action="移动" />
      <KeyLine keyLabel="1–9" action="填入" />
      <KeyLine keyLabel="0/⌫" action="清除" />
      <KeyRow
        items={[
          { keyLabel: "U", action: "撤销" },
          { keyLabel: "H", action: "提示" },
        ]}
      />
      <Text>{blankLine}</Text>
      <Label>对局</Label>
      <KeyRow
        items={[
          { keyLabel: "E", action: "简单" },
          { keyLabel: "M", action: "中等" },
          { keyLabel: "D", action: "困难" },
        ]}
      />
      <KeyRow
        items={[
          { keyLabel: "N", action: "新局" },
          { keyLabel: "Q", action: "退出" },
        ]}
      />
      <KeyRow
        items={[
          { keyLabel: "S", action: "保存" },
          { keyLabel: "L", action: "加载" },
        ]}
      />
      <Text>{blankLine}</Text>
      <Label>当前格</Label>
      <Text color={badCells.has(game.selected) ? colors.conflict : colors.text}>
        第 {row} 行 · 第 {column} 列 · {cellState}
      </Text>
    </Box>
  );
}

function ArchivePanel({
  dialog,
  busy,
  compact,
}: {
  dialog: GameArchiveDialog;
  busy: boolean;
  compact: boolean;
}) {
  if (busy) {
    return (
      <Box width="100%">
        <Label>处理中…</Label>
      </Box>
    );
  }
  if (!dialog) return null;

  const title = dialog.mode === "load"
    ? "加载对局"
    : dialog.mode === "overwrite"
    ? "覆盖存档？"
    : "保存对局";

  return (
    <Box flexDirection="column" width="100%" height={compact ? undefined : 13}>
      <Label>{title}</Label>
      <Text>{blankLine}</Text>
      <Text color={colors.muted}>
        {dialog.mode === "overwrite" ? "文件" : "路径"}
      </Text>
      <Text color={colors.actionText} wrap="truncate-start">
        {`> ${dialog.path}${dialog.mode === "overwrite" ? "" : "█"}`}
      </Text>
      <Text>{blankLine}</Text>
      <KeyRow
        items={dialog.mode === "overwrite"
          ? [
            { keyLabel: "Y", action: "覆盖" },
            { keyLabel: "N", action: "返回" },
            { keyLabel: "Esc", action: "取消" },
          ]
          : [
            { keyLabel: "Enter", action: "确认" },
            { keyLabel: "Esc", action: "取消" },
          ]}
      />
    </Box>
  );
}
