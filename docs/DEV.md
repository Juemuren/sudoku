# 开发

## 安装依赖

需要 Deno 2.9 或更新的版本

```sh
deno install
```

## 本地开发

启动本地终端应用：

```sh
deno task tui:dev
```

启动本地开发服务器，然后在浏览器中打开输出的地址：

```sh
deno task webui:dev
```

## 构建

### TUI

```sh
deno task tui:build
```

- Windows 产物为 `dist/sudoku.exe`
- Linux / macOS 产物为 `dist/sudoku`

### WebUI

```sh
deno task webui:build
deno task webui:preview
```

构建产物在 `dist/webui/` 中。

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
