import { useInput } from "ink";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { GameState } from "../../../app/gameState.ts";
import { loadFromStore } from "../../../app/gameLoad.ts";
import { saveToStore } from "../../../app/gameSave.ts";
import {
  fileGameStore,
  resolveGameArchivePath,
} from "../storage/fileGameStore.ts";

export type GameArchiveDialog = {
  mode: "save" | "load" | "overwrite";
  path: string;
} | null;

export function useGameArchive(
  game: GameState,
  setGame: Dispatch<SetStateAction<GameState>>,
) {
  const [dialog, setDialog] = useState<GameArchiveDialog>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(path: string, overwrite = false) {
    setBusy(true);
    try {
      const target = resolveGameArchivePath(path);
      const result = await saveToStore(
        fileGameStore,
        target,
        game,
        location,
        overwrite,
      );
      if (result === "confirm-overwrite") {
        setDialog({ mode: "overwrite", path });
      } else {
        setLocation(target);
        setStatus(`已保存至 ${target}`);
        setDialog(null);
      }
    } catch (error) {
      setStatus(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function load(path: string) {
    setBusy(true);
    try {
      const location = resolveGameArchivePath(path);
      const loaded = await loadFromStore(fileGameStore, location);
      setGame(loaded);
      setLocation(location);
      setStatus(`已加载 ${location}`);
      setDialog(null);
    } catch (error) {
      setStatus(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function submit(current: NonNullable<GameArchiveDialog>) {
    if (!current.path.trim()) {
      setStatus("请输入存档路径。");
      return;
    }
    if (current.mode === "save") void save(current.path);
    if (current.mode === "load") void load(current.path);
  }

  useInput((input, key) => {
    if (busy) return;
    if (!dialog) {
      if (input === "s" || input === "l") {
        setDialog({
          mode: input === "s" ? "save" : "load",
          path: location ?? "sudoku-archive.json",
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
      if (input.toLowerCase() === "y") void save(dialog.path, true);
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
