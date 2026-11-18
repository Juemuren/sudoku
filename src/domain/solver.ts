import { type Board, CELL_COUNT } from "./board.ts";
import { candidates, conflicts } from "./rules.ts";

// Returns at most `limit` solutions. A limit of two is enough to check uniqueness.
export function solve(board: Board, limit = 1, randomize = false): Board[] {
  if (limit < 1 || conflicts(board).size > 0) return [];
  const working = [...board];
  const solutions: Board[] = [];

  function search(): void {
    if (solutions.length >= limit) return;
    let bestIndex = -1;
    let bestOptions: number[] = [];
    for (let index = 0; index < CELL_COUNT; index++) {
      if (working[index] !== 0) continue;
      const options = candidates(working, index);
      if (options.length === 0) return;
      if (bestIndex === -1 || options.length < bestOptions.length) {
        bestIndex = index;
        bestOptions = options;
        if (options.length === 1) break;
      }
    }
    if (bestIndex === -1) {
      solutions.push([...working]);
      return;
    }
    if (randomize) shuffle(bestOptions);
    for (const value of bestOptions) {
      working[bestIndex] = value;
      search();
      working[bestIndex] = 0;
      if (solutions.length >= limit) return;
    }
  }

  search();
  return solutions;
}

export function shuffle(items: number[]): number[] {
  for (let index = items.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    const current = items[index];
    const selected = items[other];
    if (current === undefined || selected === undefined) {
      throw new Error("无法打乱缺少元素的数组。");
    }
    items[index] = selected;
    items[other] = current;
  }
  return items;
}
