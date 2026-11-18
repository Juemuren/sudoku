# 数独游戏

使用 TypeScript 实现的数独游戏，提供终端界面和浏览器界面。

## 运行

需要 Deno 2.9 或更新版本。

```sh
deno install
```

### 终端界面

```sh
deno task start
```

游戏在交互式终端中运行。

### 浏览器界面

```sh
deno task web:dev
```

打开 Vite 输出的本地地址。

## 构建

### TUI

```sh
deno task build
```

- Windows 产物为 `dist/sudoku.exe`
- Linux / macOS 产物为 `dist/sudoku`

### WebUI

```sh
deno task web:build
deno task web:preview
```

构建产物在 `dist/webui/`。

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
