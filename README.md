# 数独游戏

使用 TypeScript 实现的终端数独游戏。题目由回溯算法生成，并检查唯一解。

## 运行

需要 Deno 2.9 或更新版本。

```sh
deno install
deno task start
```

游戏在交互式终端中运行。

## 构建

### TUI

```sh
deno task build
```

- Windows 产物为 `dist/sudoku.exe`
- Linux / macOS 产物为 `dist/sudoku`

## 检查和测试

使用 Deno 进行类型检查

```sh
deno task check
```

使用 Deno 进行静态检查和格式化

```sh
deno task lint
deno task fmt
```

使用 Deno 进行测试

```sh
deno task test
```
