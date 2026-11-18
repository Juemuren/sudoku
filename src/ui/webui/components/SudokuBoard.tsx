import type { GameState } from "../../../app/gameState.ts";
import type { CSSProperties } from "react";
import { columnOf, rowOf, SIZE } from "../../../domain/board.ts";
import { colors } from "../../styles/colors.ts";
import {
  BOARD_MAX_WIDTH,
  BOX_SIZE,
  COMPACT_SCREEN_MAX_WIDTH,
  MOBILE_SCREEN_MAX_WIDTH,
} from "../layout.ts";

type Props = {
  game: GameState;
  badCells: Set<number>;
  width: number;
  onSelectCell: (index: number) => void;
};

export function SudokuBoard({ game, badCells, width, onSelectCell }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: width <= MOBILE_SCREEN_MAX_WIDTH ? 18 : 26,
      }}
    >
      <div style={boardStyle} role="grid" aria-label="数独棋盘">
        {game.board.map((value, index) => {
          const row = rowOf(index);
          const column = columnOf(index);
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
              style={cellStyle({
                width,
                given,
                selected,
                conflict: badCells.has(index),
                boxRight: (column + 1) % BOX_SIZE === 0 &&
                  column < SIZE - 1,
                boxBottom: (row + 1) % BOX_SIZE === 0 && row < SIZE - 1,
                lastColumn: column === SIZE - 1,
                lastRow: row === SIZE - 1,
              })}
              onClick={() => onSelectCell(index)}
            >
              {value || ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const boardStyle: CSSProperties = {
  boxSizing: "border-box",
  width: `min(100%, ${BOARD_MAX_WIDTH}px)`,
  aspectRatio: "1",
  display: "grid",
  gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
  gridTemplateRows: `repeat(${SIZE}, 1fr)`,
  border: `2px solid ${colors.gridBorder}`,
  background: colors.surface,
  boxShadow: `0 12px 30px ${colors.boardShadow}`,
};

function cellStyle(state: {
  width: number;
  given: boolean;
  selected: boolean;
  conflict: boolean;
  boxRight: boolean;
  boxBottom: boolean;
  lastColumn: boolean;
  lastRow: boolean;
}): CSSProperties {
  return {
    boxSizing: "border-box",
    minWidth: 0,
    padding: 0,
    background: state.conflict
      ? state.selected ? colors.conflictSelected : colors.conflictSoft
      : state.selected
      ? colors.accentSoft
      : colors.surface,
    border: 0,
    borderRight: state.boxRight
      ? `2px solid ${colors.gridBorder}`
      : state.lastColumn
      ? 0
      : `1px solid ${colors.gridLine}`,
    borderBottom: state.boxBottom
      ? `2px solid ${colors.gridBorder}`
      : state.lastRow
      ? 0
      : `1px solid ${colors.gridLine}`,
    color: state.conflict
      ? colors.conflict
      : state.given
      ? colors.givenText
      : colors.accentText,
    fontFamily: "inherit",
    fontSize: state.width <= COMPACT_SCREEN_MAX_WIDTH
      ? 19
      : "clamp(18px, 3vw, 28px)",
    fontWeight: state.given ? 700 : 600,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    cursor: "pointer",
    boxShadow: state.selected
      ? `inset 0 0 0 2px ${colors.selectedBorder}`
      : undefined,
  };
}
