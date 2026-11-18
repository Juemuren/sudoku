import { Text } from "ink";
import { Fragment } from "react";
import type { GameState } from "../../../app/gameState.ts";
import { SIZE } from "../../../domain/board.ts";
import { colors } from "../../styles/colors.ts";

const rows = Array.from({ length: SIZE }, (_, index) => index);
const columns = Array.from({ length: SIZE }, (_, index) => index);
const topBorder = "┏━━━━━━━┳━━━━━━━┳━━━━━━━┓";
const midBorder = "┣━━━━━━━╋━━━━━━━╋━━━━━━━┫";
const btmBorder = "┗━━━━━━━┻━━━━━━━┻━━━━━━━┛";
const lftSeparator = "┃ ";
const ctrSeparator = " ┃ ";
const rgtSeparator = " ┃";
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
  "-1": lftSeparator,
  "0": " ",
  "1": " ",
  "2": ctrSeparator,
  "3": " ",
  "4": " ",
  "5": ctrSeparator,
  "6": " ",
  "7": " ",
  "8": rgtSeparator,
};

type Props = {
  game: GameState;
  badCells: Set<number>;
};

export function SudokuBoard({ game, badCells }: Props) {
  return (
    <>
      <Text color={colors.gridBorder}>{rowBorders[-1]}</Text>
      {rows.map((row) => (
        <Fragment key={row}>
          <Text>
            <Text color={colors.gridBorder}>{columnSeparators[-1]}</Text>
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
                      value === 0,
                    )}
                    backgroundColor={selected ? colors.accentSoft : undefined}
                  >
                    {value === 0 ? "·" : value}
                  </Text>
                  <Text color={colors.gridBorder}>
                    {columnSeparators[column]}
                  </Text>
                </Fragment>
              );
            })}
          </Text>
          <Text color={colors.gridBorder}>
            {rowBorders[row]}
          </Text>
        </Fragment>
      ))}
    </>
  );
}

function cellColor(conflict: boolean, given: boolean, empty: boolean) {
  if (conflict) return colors.conflict;
  if (given) return colors.givenText;
  if (empty) return colors.subtle;
  return colors.accentText;
}
