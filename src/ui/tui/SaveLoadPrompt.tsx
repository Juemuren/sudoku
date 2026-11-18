import { Text } from "ink";
import type { SaveLoadDialog } from "./useSaveLoad.ts";

export function SaveLoadPrompt({
  dialog,
  busy,
}: {
  dialog: SaveLoadDialog;
  busy: boolean;
}) {
  if (busy) return <Text color="yellow">处理中…</Text>;
  if (!dialog) return null;
  return <Text color="cyan">{promptText(dialog)}</Text>;
}

function promptText(dialog: NonNullable<SaveLoadDialog>): string {
  switch (dialog.mode) {
    case "overwrite":
      return `覆盖 ${dialog.path}？Y 确认 / N 返回 / Esc 取消`;
    case "save":
      return `保存路径: ${dialog.path}█ Enter 确认 / Esc 取消`;
    case "load":
      return `加载路径: ${dialog.path}█ Enter 确认 / Esc 取消`;
  }
}
