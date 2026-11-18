import { useInput } from "ink";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { GameState } from "../../app/gameState.ts";
import {
  fileExists,
  loadFromFile,
  savePath,
  saveToFile,
} from "../../storage/fileSaveStore.ts";

export type SaveLoadDialog = {
  mode: "save" | "load" | "overwrite";
  path: string;
} | null;

export function useSaveLoad(
  game: GameState,
  setGame: Dispatch<SetStateAction<GameState>>,
) {
  const [dialog, setDialog] = useState<SaveLoadDialog>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(path: string) {
    setBusy(true);
    try {
      await saveToFile(path, game);
      setLocation(savePath(path));
      setStatus(`已保存至 ${savePath(path)}`);
      setDialog(null);
    } catch (error) {
      setStatus(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function submit(current: NonNullable<SaveLoadDialog>) {
    if (!current.path.trim()) {
      setStatus("请输入存档路径。");
      return;
    }
    setBusy(true);
    try {
      if (current.mode === "save") {
        if (
          (await fileExists(current.path)) &&
          savePath(current.path) !== location
        ) {
          setDialog({ ...current, mode: "overwrite" });
        } else {
          await saveToFile(current.path, game);
          setLocation(savePath(current.path));
          setStatus(`已保存至 ${savePath(current.path)}`);
          setDialog(null);
        }
      } else {
        const loaded = await loadFromFile(current.path);
        setGame(loaded);
        setLocation(savePath(current.path));
        setStatus(`已加载 ${savePath(current.path)}`);
        setDialog(null);
      }
    } catch (error) {
      setStatus(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  useInput((input, key) => {
    if (busy) return;
    if (!dialog) {
      if (input === "s" || input === "l") {
        setDialog({
          mode: input === "s" ? "save" : "load",
          path: location ?? "sudoku-save.json",
        });
        setStatus("");
      }
      return;
    }
    if (key.escape) {
      setDialog(null);
      return;
    }
    if (dialog.mode === "overwrite") {
      if (input.toLowerCase() === "y") void save(dialog.path);
      if (input.toLowerCase() === "n") setDialog({ ...dialog, mode: "save" });
      return;
    }
    if (key.return) {
      void submit(dialog);
      return;
    }
    if (key.backspace || key.delete) {
      setDialog({ ...dialog, path: dialog.path.slice(0, -1) });
    } else if (input && !key.ctrl && !key.meta) {
      setDialog({ ...dialog, path: dialog.path + input });
    }
  });

  return {
    active: busy || dialog !== null,
    busy,
    dialog,
    status,
    clearStatus: () => setStatus(""),
    forgetLocation: () => setLocation(null),
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "存档操作失败。";
}
