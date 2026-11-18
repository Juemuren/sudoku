import { useEffect, useState } from "react";
import {
  enterValue,
  type GameState,
  newGame,
  requestHint,
  selectCell,
  undo,
} from "../../app/gameState.ts";
import { gameStats } from "../../app/gameStats.ts";
import type { Difficulty } from "../../domain/generator.ts";
import { GameArchivePrompt } from "./components/GameArchivePrompt.tsx";
import { GamePanel } from "./components/GamePanel.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { SiteHeader } from "./components/SiteHeader.tsx";
import { useGameArchive } from "./hooks/useGameArchive.ts";
import { useGameKeyboard } from "./hooks/useGameKeyboard.ts";

export function App() {
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());
  const gameArchive = useGameArchive(game, setGame);

  useEffect(() => {
    const timer = globalThis.setInterval(() => setNow(Date.now()), 1000);
    return () => globalThis.clearInterval(timer);
  }, []);

  function startNewGame(difficulty: Difficulty) {
    setGame(newGame(difficulty));
    gameArchive.clearStatus();
  }

  useGameKeyboard({
    game,
    setGame,
    blocked: gameArchive.pendingLoad !== null || gameArchive.busy,
    startNewGame,
    save: gameArchive.save,
    openFilePicker: gameArchive.openFilePicker,
  });

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="layout">
        <GamePanel
          game={game}
          stats={gameStats(game, now)}
          status={gameArchive.status}
          onNewGame={startNewGame}
          onSelectCell={(index) =>
            setGame((current) => selectCell(current, index))}
          onEnterValue={(value) =>
            setGame((current) => enterValue(current, value))}
          onUndo={() => setGame(undo)}
          onHint={() => setGame(requestHint)}
        />
        <Sidebar
          busy={gameArchive.busy}
          fileInput={gameArchive.fileInput}
          onSave={gameArchive.save}
          onOpenFilePicker={gameArchive.openFilePicker}
          onChooseLoad={(file) => void gameArchive.chooseLoad(file)}
        />
      </main>
      {gameArchive.pendingLoad && (
        <GameArchivePrompt
          busy={gameArchive.busy}
          onCancel={gameArchive.cancelLoad}
          onConfirm={gameArchive.confirmLoad}
        />
      )}
    </div>
  );
}
