import { Text } from "ink";
import { Fragment } from "react";
import type { GameState } from "../../app/gameState.js";
import { SIZE } from "../../domain/board.js";

const rows = Array.from({ length: SIZE }, (_, index) => index);
const columns = Array.from({ length: SIZE }, (_, index) => index);
const topBorder = "┏━━━━━━━┳━━━━━━━┳━━━━━━━┓";
const midBorder = "┣━━━━━━━╋━━━━━━━╋━━━━━━━┫";
const btmBorder = "┗━━━━━━━┻━━━━━━━┻━━━━━━━┛";

type Props = {
  game: GameState;
  badCells: Set<number>;
};

export function SudokuBoard({ game, badCells }: Props) {
  return (
    <>
      <Text>{topBorder}</Text>
      {rows.map((row) => (
        <Fragment key={row}>
          <Text>
            {"┃ "}
            {columns.map((column) => {
              const index = row * SIZE + column;
              const value = game.board[index];
              const selected = game.selected === index;
              return (
                <Fragment key={column}>
                  <Text
                    bold={game.puzzle[index] !== 0 || selected}
                    color={
                      badCells.has(index)
                        ? "red"
                        : game.puzzle[index] !== 0
                          ? "white"
                          : "cyan"
                    }
                    backgroundColor={selected ? "blue" : undefined}
                  >
                    {value === 0 ? "·" : value}
                  </Text>
                  <Text>
                    {column === 2 || column === 5
                      ? " ┃ "
                      : column === 8
                        ? " ┃"
                        : " "}
                  </Text>
                </Fragment>
              );
            })}
          </Text>
          <Text>
            {row === 2 || row === 5
              ? midBorder
              : row === 8
                ? btmBorder
                : ""}
          </Text>
        </Fragment>
      ))}
    </>
  );
}
