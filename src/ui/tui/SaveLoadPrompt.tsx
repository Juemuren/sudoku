import { Text } from "ink";
import type { SaveLoadDialog } from "./useSaveLoad.js";

export function SaveLoadPrompt({
  dialog,
  busy,
}: {
  dialog: SaveLoadDialog;
  busy: boolean;
}) {
  if (busy) return <Text color="yellow">处理中…</Text>;
  if (!dialog) return null;
  return (
    <Text color="cyan">
      {dialog.mode === "overwrite"
        ? `覆盖 ${dialog.path}？Y 确认 / N 返回 / Esc 取消`
        : `${dialog.mode === "save" ? "保存" : "加载"}路径: ${dialog.path}█ Enter 确认 / Esc 取消`}
    </Text>
  );
}
