import { Text } from "ink";
import { Fragment } from "react";
import type { GameState } from "../../../app/gameState.ts";
import { SIZE } from "../../../domain/board.ts";

const rows = Array.from({ length: SIZE }, (_, index) => index);
const columns = Array.from({ length: SIZE }, (_, index) => index);
const topBorder = "┏━━━━━━━┳━━━━━━━┳━━━━━━━┓";
const midBorder = "┣━━━━━━━╋━━━━━━━╋━━━━━━━┫";
const btmBorder = "┗━━━━━━━┻━━━━━━━┻━━━━━━━┛";
const topSeparator = "┃ ";
const midSeparator = " ┃ ";
const btmSeparator = " ┃";
const rowBorders: Partial<Record<number, string>> = {
  "-1": topBorder,
  "0": "",
  "1": "",
  "2": midBorder,
  "3": "",
  "4": "",
  "5": midBorder,
  "6": "",
  "7": "",
  "8": btmBorder,
};
const columnSeparators: Record<number, string> = {
  "-1": topSeparator,
  "0": " ",
  "1": " ",
  "2": midSeparator,
  "3": " ",
  "4": " ",
  "5": midSeparator,
  "6": " ",
  "7": " ",
  "8": btmSeparator,
};

type Props = {
  game: GameState;
  badCells: Set<number>;
};

export function SudokuBoard({ game, badCells }: Props) {
  return (
    <>
      <Text>{rowBorders[-1]}</Text>
      {rows.map((row) => (
        <Fragment key={row}>
          <Text>
            {columnSeparators[-1]}
            {columns.map((column) => {
              const index = row * SIZE + column;
              const value = game.board[index];
              const selected = game.selected === index;
              return (
                <Fragment key={column}>
                  <Text
                    bold={game.puzzle[index] !== 0 || selected}
                    color={cellColor(
                      badCells.has(index),
                      game.puzzle[index] !== 0,
                    )}
                    backgroundColor={selected ? "blue" : undefined}
                  >
                    {value === 0 ? "·" : value}
                  </Text>
                  <Text>
                    {columnSeparators[column]}
                  </Text>
                </Fragment>
              );
            })}
          </Text>
          <Text>
            {rowBorders[row]}
          </Text>
        </Fragment>
      ))}
    </>
  );
}

function cellColor(conflict: boolean, given: boolean) {
  if (conflict) return "red";
  if (given) return "white";
  return "cyan";
}
