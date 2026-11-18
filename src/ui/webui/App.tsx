import { useEffect, useRef, useState } from "react";
import {
  enterValue,
  type GameState,
  moveSelection,
  newGame,
  requestHint,
  selectCell,
  undo,
} from "../../app/gameState.ts";
import { gameStats } from "../../app/gameStats.ts";
import type { Difficulty } from "../../domain/generator.ts";
import { downloadArchive, readArchiveFile } from "./browserGameArchive.ts";

const difficulties: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${
    String(seconds % 60).padStart(2, "0")
  }`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "操作失败，请重试。";
}

export function App() {
  const [game, setGame] = useState<GameState>(() => newGame());
  const [now, setNow] = useState(Date.now());
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingLoad, setPendingLoad] = useState<GameState | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const { badCells, solved, remaining, elapsedSeconds } = gameStats(game, now);

  useEffect(() => {
    const timer = globalThis.setInterval(() => setNow(Date.now()), 1000);
    return () => globalThis.clearInterval(timer);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        pendingLoad || busy || event.altKey || event.ctrlKey || event.metaKey
      ) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest("input, textarea, select"))
      ) return;
      const directions = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      } as const;
      const direction = directions[event.key as keyof typeof directions];
      if (direction) {
        event.preventDefault();
        setGame((current) => moveSelection(current, direction));
      } else if (/^[1-9]$/.test(event.key)) {
        setGame((current) => enterValue(current, Number(event.key)));
      } else if (
        event.key === "0" || event.key === "Backspace" || event.key === "Delete"
      ) {
        event.preventDefault();
        setGame((current) => enterValue(current, 0));
      } else if (event.key.toLowerCase() === "h") {
        setGame(requestHint);
      } else if (event.key.toLowerCase() === "u") {
        setGame(undo);
      } else if (event.key.toLowerCase() === "n") {
        startNewGame(game.difficulty);
      } else if (event.key.toLowerCase() === "e") {
        startNewGame("easy");
      } else if (event.key.toLowerCase() === "m") {
        startNewGame("medium");
      } else if (event.key.toLowerCase() === "d") {
        startNewGame("hard");
      } else if (event.key.toLowerCase() === "s") {
        save();
      } else if (event.key.toLowerCase() === "l") {
        fileInput.current?.click();
      }
    }
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  });

  function startNewGame(difficulty: Difficulty) {
    setGame(newGame(difficulty));
    setStatus("");
  }

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
    setGame(pendingLoad);
    setStatus("已加载存档。");
    setPendingLoad(null);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">九</span>
          <span>
            数独<span className="brand-en">/ SUDOKU</span>
          </span>
        </div>
        <span className="header-note">一格一格，慢慢解开。</span>
      </header>

      <main className="layout">
        <section className="game-panel" aria-label="数独游戏">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DAILY PLAY</p>
              <h1>数独练习</h1>
            </div>
            <div className="difficulty-picker" aria-label="选择难度">
              {difficulties.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={game.difficulty === value ? "active" : ""}
                  onClick={() => startNewGame(value)}
                  aria-pressed={game.difficulty === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="stats" aria-label="游戏统计">
            <div>
              <span>用时</span>
              <strong>{formatTime(elapsedSeconds)}</strong>
            </div>
            <div>
              <span>剩余空格</span>
              <strong>{remaining}</strong>
            </div>
            <div>
              <span>使用提示</span>
              <strong>{game.hintsUsed}</strong>
            </div>
          </div>

          <div className="board-wrap">
            <div className="board" role="grid" aria-label="数独棋盘">
              {game.board.map((value, index) => {
                const row = Math.floor(index / 9);
                const column = index % 9;
                const given = game.puzzle[index] !== 0;
                const selected = game.selected === index;
                return (
                  <button
                    key={index}
                    type="button"
                    role="gridcell"
                    aria-label={`第 ${row + 1} 行第 ${column + 1} 列，${
                      value === 0 ? "空格" : value
                    }${given ? "，题目数字" : ""}${
                      badCells.has(index) ? "，冲突" : ""
                    }`}
                    aria-selected={selected}
                    className={[
                      "cell",
                      given ? "given" : "entered",
                      selected ? "selected" : "",
                      badCells.has(index) ? "conflict" : "",
                      column === 2 || column === 5 ? "box-right" : "",
                      row === 2 || row === 5 ? "box-bottom" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() =>
                      setGame((current) => selectCell(current, index))}
                  >
                    {value || ""}
                  </button>
                );
              })}
            </div>
          </div>

          <p
            className={`game-message ${
              solved ? "success" : badCells.size ? "warning" : ""
            }`}
            role="status"
          >
            {status || game.message}
            {badCells.size > 0 && ` 冲突格：${badCells.size}`}
          </p>

          <div className="number-pad" aria-label="输入数字">
            {Array.from(
              { length: 9 },
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setGame((current) => enterValue(current, index + 1))}
                >
                  {index + 1}
                </button>
              ),
            )}
            <button
              className="clear-key"
              type="button"
              onClick={() => setGame((current) => enterValue(current, 0))}
            >
              清除
            </button>
          </div>
          <div className="game-actions">
            <button type="button" onClick={() => setGame(undo)}>
              ↶ <span>撤销</span>
            </button>
            <button type="button" onClick={() => setGame(requestHint)}>
              ✦ <span>提示</span>
            </button>
            <button type="button" onClick={() => startNewGame(game.difficulty)}>
              ↻ <span>新局</span>
            </button>
          </div>
        </section>

        <aside className="side-panel">
          <section className="archive-card" aria-labelledby="archive-title">
            <p className="eyebrow">YOUR PROGRESS</p>
            <h2 id="archive-title">存档文件</h2>
            <p className="card-intro">
              保存会下载 JSON 文件；加载可从文件恢复进度。
            </p>
            <div className="archive-actions">
              <button
                type="button"
                className="primary"
                disabled={busy}
                onClick={save}
              >
                保存文件
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInput.current?.click()}
              >
                加载文件
              </button>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept=".json,application/json"
              aria-label="选择 JSON 存档文件"
              onChange={(event) => void chooseLoad(event.target.files?.[0])}
              hidden
            />
          </section>
          <section className="help-card" aria-labelledby="help-title">
            <p className="eyebrow">QUICK GUIDE</p>
            <h2 id="help-title">如何操作</h2>
            <div className="help-row">
              <span>移动选格</span>
              <kbd>方向键</kbd>
            </div>
            <div className="help-row">
              <span>填写数字</span>
              <kbd>1–9</kbd>
            </div>
            <div className="help-row">
              <span>清除数字</span>
              <kbd>0 / ⌫</kbd>
            </div>
            <div className="help-row">
              <span>提示 / 撤销</span>
              <kbd>H / U</kbd>
            </div>
            <p className="help-footnote">
              也可直接点击棋盘和数字按钮。红色数字表示行、列或九宫格中有冲突。
            </p>
          </section>
        </aside>
      </main>

      {pendingLoad && (
        <div className="dialog-backdrop" role="presentation">
          <div
            className="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
          >
            <p className="eyebrow">PLEASE CONFIRM</p>
            <h2 id="dialog-title">加载这份存档？</h2>
            <p id="dialog-description">
              当前棋盘会被文件中的进度替换。请先保存需要保留的进度。
            </p>
            <div className="dialog-actions">
              <button
                type="button"
                autoFocus
                onClick={() => setPendingLoad(null)}
                disabled={busy}
              >
                取消
              </button>
              <button
                type="button"
                className="primary"
                onClick={confirmLoad}
                disabled={busy}
              >
                {busy ? "处理中…" : "确认替换"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
