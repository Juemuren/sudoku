import type { GameState } from "../../../app/gameState.ts";
import type { gameStats } from "../../../app/gameStats.ts";
import type { Difficulty } from "../../../domain/generator.ts";
import { SudokuBoard } from "./SudokuBoard.tsx";

type Props = {
  game: GameState;
  stats: ReturnType<typeof gameStats>;
  status: string;
  onNewGame: (difficulty: Difficulty) => void;
  onSelectCell: (index: number) => void;
  onEnterValue: (value: number) => void;
  onUndo: () => void;
  onHint: () => void;
};

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

export function GamePanel({
  game,
  stats,
  status,
  onNewGame,
  onSelectCell,
  onEnterValue,
  onUndo,
  onHint,
}: Props) {
  const { badCells, solved, remaining, elapsedSeconds } = stats;
  return (
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
              onClick={() => onNewGame(value)}
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

      <SudokuBoard
        game={game}
        badCells={badCells}
        onSelectCell={onSelectCell}
      />

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
        {Array.from({ length: 9 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onEnterValue(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="clear-key"
          type="button"
          onClick={() => onEnterValue(0)}
        >
          清除
        </button>
      </div>
      <div className="game-actions">
        <button type="button" onClick={onUndo}>
          ↶ <span>撤销</span>
        </button>
        <button type="button" onClick={onHint}>
          ✦ <span>提示</span>
        </button>
        <button type="button" onClick={() => onNewGame(game.difficulty)}>
          ↻ <span>新局</span>
        </button>
      </div>
    </section>
  );
}
