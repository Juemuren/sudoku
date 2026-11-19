import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  enterValue,
  type GameState,
  newGame,
  requestAnswer,
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
import {
  CLOCK_TICK_MS,
  GAME_COLUMN_WIDTH,
  MOBILE_SCREEN_MAX_WIDTH,
  PAGE_MAX_WIDTH,
  SIDEBAR_COLUMN_WIDTH,
  STACKED_CONTENT_MAX_WIDTH,
  STACKED_LAYOUT_MAX_WIDTH,
} from "./layout.ts";

export function App() {
  const [width, setWidth] = useState(() => globalThis.innerWidth);
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());
  const gameArchive = useGameArchive(game, setGame);

  useEffect(() => {
    const timer = globalThis.setInterval(
      () => setNow(Date.now()),
      CLOCK_TICK_MS,
    );
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
          onAnswer={() => setGame(requestAnswer)}
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
    maxWidth: PAGE_MAX_WIDTH,
    margin: "0 auto",
    padding: width <= MOBILE_SCREEN_MAX_WIDTH
      ? "27px 14px 50px"
      : width <= STACKED_LAYOUT_MAX_WIDTH
      ? "35px 30px 70px"
      : "48px 30px 70px",
    display: "grid",
    gridTemplateColumns: width <= STACKED_LAYOUT_MAX_WIDTH
      ? `minmax(0, ${STACKED_CONTENT_MAX_WIDTH}px)`
      : `minmax(0, ${GAME_COLUMN_WIDTH}px) ${SIDEBAR_COLUMN_WIDTH}px`,
    justifyContent: "center",
    gap: width <= MOBILE_SCREEN_MAX_WIDTH ? 30 : 40,
    alignItems: "start",
  };
}
