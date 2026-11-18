import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
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
import { colors } from "../styles/colors.ts";
import { GameArchivePrompt } from "./components/GameArchivePrompt.tsx";
import { GamePanel } from "./components/GamePanel.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { SiteHeader } from "./components/SiteHeader.tsx";
import { useGameArchive } from "./hooks/useGameArchive.ts";
import { useGameKeyboard } from "./hooks/useGameKeyboard.ts";

export function App() {
  const [width, setWidth] = useState(() => globalThis.innerWidth);
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());
  const gameArchive = useGameArchive(game, setGame);

  useEffect(() => {
    const timer = globalThis.setInterval(() => setNow(Date.now()), 1000);
    return () => globalThis.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onResize = () => setWidth(globalThis.innerWidth);
    globalThis.addEventListener("resize", onResize);
    return () => globalThis.removeEventListener("resize", onResize);
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
    <div style={shellStyle}>
      <SiteHeader width={width} />
      <main style={layoutStyle(width)}>
        <GamePanel
          width={width}
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
          width={width}
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

const shellStyle: CSSProperties = {
  minHeight: "100vh",
  fontFamily: 'system-ui, "Microsoft YaHei", "PingFang SC", sans-serif',
  color: colors.text,
  background: colors.canvas,
  fontSynthesis: "none",
};

function layoutStyle(width: number): CSSProperties {
  return {
    boxSizing: "border-box",
    maxWidth: 1220,
    margin: "0 auto",
    padding: width <= 650
      ? "27px 14px 50px"
      : width <= 950
      ? "35px 30px 70px"
      : "48px 30px 70px",
    display: "grid",
    gridTemplateColumns: width <= 950
      ? "minmax(0, 650px)"
      : "minmax(0, 696px) 350px",
    justifyContent: "center",
    gap: width <= 650 ? 30 : 40,
    alignItems: "start",
  };
}
