import type { GameState } from "../../../app/gameState.ts";

type Props = {
  game: GameState;
  badCells: Set<number>;
  onSelectCell: (index: number) => void;
};

export function SudokuBoard({ game, badCells, onSelectCell }: Props) {
  return (
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
