import { useRef, useState } from "react";
import type { GameState } from "../../../app/gameState.ts";
import {
  downloadArchive,
  readArchiveFile,
} from "../storage/browserGameArchive.ts";

export function useGameArchive(
  game: GameState,
  onLoad: (game: GameState) => void,
) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingLoad, setPendingLoad] = useState<GameState | null>(null);

  function save() {
    try {
      downloadArchive(game);
      setStatus("已开始下载存档文件。");
    } catch (error) {
      setStatus(errorMessage(error));
    }
  }

  async function chooseLoad(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const loaded = await readArchiveFile(file);
      setPendingLoad(loaded);
      setStatus("");
    } catch (error) {
      setStatus(errorMessage(error));
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function confirmLoad() {
    if (!pendingLoad) return;
    onLoad(pendingLoad);
    setStatus("已加载存档。");
    setPendingLoad(null);
  }

  return {
    fileInput,
    status,
    busy,
    pendingLoad,
    save,
    chooseLoad,
    confirmLoad,
    cancelLoad: () => setPendingLoad(null),
    openFilePicker: () => fileInput.current?.click(),
    clearStatus: () => setStatus(""),
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "操作失败，请重试。";
}
