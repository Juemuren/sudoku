import type { GameState } from "../../../app/gameState.ts";
import type { gameStats } from "../../../app/gameStats.ts";
import type { Difficulty } from "../../../domain/generator.ts";
import type { CSSProperties } from "react";
import { SIZE } from "../../../domain/board.ts";
import { colors } from "../../styles/colors.ts";
import {
  COMPACT_SCREEN_MAX_WIDTH,
  MOBILE_SCREEN_MAX_WIDTH,
  NUMBER_PAD_MAX_WIDTH,
} from "../layout.ts";
import { SudokuBoard } from "./SudokuBoard.tsx";

const SECONDS_PER_MINUTE = 60;
const TIME_FIELD_WIDTH = 2;
const NUMBER_PAD_COLUMNS = SIZE + 1; // Digits and the clear button.

type Props = {
  game: GameState;
  width: number;
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
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  return `${String(minutes).padStart(TIME_FIELD_WIDTH, "0")}:${
    String(seconds % SECONDS_PER_MINUTE).padStart(TIME_FIELD_WIDTH, "0")
  }`;
}

export function GamePanel({
  game,
  width,
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
    <section style={{ minWidth: 0 }} aria-label="数独游戏">
      <div style={headingStyle(width)}>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: width <= MOBILE_SCREEN_MAX_WIDTH ? 30 : 38,
              letterSpacing: "-.045em",
              lineHeight: 1.2,
            }}
          >
            数独
          </h1>
        </div>
        <div style={difficultyStyle(width)} aria-label="选择难度">
          {difficulties.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              style={difficultyButtonStyle(game.difficulty === value)}
              onClick={() => onNewGame(value)}
              aria-pressed={game.difficulty === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={statsStyle} aria-label="游戏统计">
        <div style={statItemStyle}>
          <span style={statLabelStyle}>用时</span>
          <strong style={statValueStyle}>{formatTime(elapsedSeconds)}</strong>
        </div>
        <div
          style={{
            ...statItemStyle,
            borderLeft: `1px solid ${colors.statDivider}`,
          }}
        >
          <span style={statLabelStyle}>剩余空格</span>
          <strong style={statValueStyle}>{remaining}</strong>
        </div>
        <div
          style={{
            ...statItemStyle,
            borderLeft: `1px solid ${colors.statDivider}`,
          }}
        >
          <span style={statLabelStyle}>使用提示</span>
          <strong style={statValueStyle}>{game.hintsUsed}</strong>
        </div>
      </div>

      <SudokuBoard
        game={game}
        width={width}
        badCells={badCells}
        onSelectCell={onSelectCell}
      />

      <p
        style={{
          minHeight: 27,
          textAlign: "center",
          margin: "17px 0 12px",
          color: solved
            ? colors.success
            : badCells.size
            ? colors.warning
            : colors.message,
          fontSize: 13,
          fontWeight: solved ? 700 : 400,
        }}
        role="status"
      >
        {status || game.message}
        {badCells.size > 0 && ` 冲突格：${badCells.size}`}
      </p>

      <div style={numberPadStyle(width)} aria-label="输入数字">
        {Array.from({ length: SIZE }, (_, index) => (
          <button
            key={index}
            type="button"
            style={numberButtonStyle(width)}
            onClick={() => onEnterValue(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          style={{
            ...numberButtonStyle(width),
            fontSize: width <= COMPACT_SCREEN_MAX_WIDTH ? 10 : 12,
            fontWeight: 600,
          }}
          type="button"
          onClick={() => onEnterValue(0)}
        >
          清除
        </button>
      </div>
      <div style={actionsStyle}>
        <button style={actionButtonStyle(width)} type="button" onClick={onUndo}>
          ↶ <span style={actionLabelStyle}>撤销</span>
        </button>
        <button style={actionButtonStyle(width)} type="button" onClick={onHint}>
          ✦ <span style={actionLabelStyle}>提示</span>
        </button>
        <button
          style={actionButtonStyle(width)}
          type="button"
          onClick={() => onNewGame(game.difficulty)}
        >
          ↻ <span style={actionLabelStyle}>新局</span>
        </button>
      </div>
    </section>
  );
}

function headingStyle(width: number): CSSProperties {
  return {
    display: width <= MOBILE_SCREEN_MAX_WIDTH ? "block" : "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 26,
  };
}
function difficultyStyle(width: number): CSSProperties {
  return {
    display: width <= MOBILE_SCREEN_MAX_WIDTH ? "inline-flex" : "flex",
    padding: 4,
    marginTop: width <= MOBILE_SCREEN_MAX_WIDTH ? 18 : 0,
    background: colors.picker,
    borderRadius: 10,
    whiteSpace: "nowrap",
  };
}
function difficultyButtonStyle(active: boolean): CSSProperties {
  return {
    border: 0,
    background: active ? colors.surface : "transparent",
    color: active ? colors.accentDark : colors.pickerText,
    padding: "8px 13px",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    boxShadow: active ? `0 1px 5px ${colors.activeShadow}` : undefined,
    cursor: "pointer",
  };
}
const statsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  background: colors.surface,
  border: `1px solid ${colors.statBorder}`,
  borderRadius: 14,
  padding: "18px 0",
  boxShadow: `0 5px 24px ${colors.statShadow}`,
};
const statItemStyle: CSSProperties = {
  textAlign: "center",
  display: "grid",
  gap: 3,
};
const statLabelStyle: CSSProperties = { color: colors.subtle, fontSize: 12 };
const statValueStyle: CSSProperties = {
  color: colors.statValue,
  fontSize: 21,
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
};
function numberPadStyle(width: number): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(${NUMBER_PAD_COLUMNS}, 1fr)`,
    gap: width <= COMPACT_SCREEN_MAX_WIDTH ? 3 : 6,
    maxWidth: NUMBER_PAD_MAX_WIDTH,
    margin: "auto",
  };
}
function numberButtonStyle(width: number): CSSProperties {
  return {
    boxSizing: "border-box",
    border: `1px solid ${colors.controlBorder}`,
    background: colors.surface,
    color: colors.numberText,
    borderRadius: width <= COMPACT_SCREEN_MAX_WIDTH ? 5 : 8,
    aspectRatio: "1",
    fontSize: width <= COMPACT_SCREEN_MAX_WIDTH ? 16 : 20,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
  };
}
const actionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 13,
  marginTop: 18,
};
function actionButtonStyle(width: number): CSSProperties {
  return {
    border: `1px solid ${colors.controlBorder}`,
    color: colors.actionText,
    background: colors.actionSurface,
    borderRadius: 8,
    minWidth: width <= MOBILE_SCREEN_MAX_WIDTH ? 0 : 120,
    flex: width <= MOBILE_SCREEN_MAX_WIDTH ? 1 : undefined,
    padding: "11px 14px",
    fontSize: 17,
    fontFamily: "inherit",
    cursor: "pointer",
  };
}
const actionLabelStyle: CSSProperties = {
  marginLeft: 6,
  fontSize: 13,
  fontWeight: 600,
};
