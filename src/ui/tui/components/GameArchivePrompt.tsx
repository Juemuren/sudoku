import { Text } from "ink";
import type { GameArchiveDialog } from "../hooks/useGameArchive.ts";
import { colors } from "../../styles/colors.ts";

export function GameArchivePrompt({
  dialog,
  busy,
}: {
  dialog: GameArchiveDialog;
  busy: boolean;
}) {
  if (busy) return <Text color={colors.warning}>处理中…</Text>;
  if (!dialog) return null;
  return <Text color={colors.actionText}>{promptText(dialog)}</Text>;
}

function promptText(dialog: NonNullable<GameArchiveDialog>): string {
  switch (dialog.mode) {
    case "overwrite":
      return `覆盖 ${dialog.path}？Y 确认 / N 返回 / Esc 取消`;
    case "save":
      return `保存路径: ${dialog.path}█ Enter 确认 / Esc 取消`;
    case "load":
      return `加载路径: ${dialog.path}█ Enter 确认 / Esc 取消`;
  }
}
