# 开发

## 安装依赖

需要 Deno 2.9 或更新的版本

```sh
deno install
```

## 本地开发

启动本地终端应用并监听文件修改：

```sh
deno task tui:dev
```

启动本地开发服务器：

```sh
deno task webui:dev
```

## 本地预览

启动本地终端应用：

```sh
deno task tui:preview
```

启动本地预览服务器：

```sh
deno task webui:preview
```

## 构建

### TUI 构建

```sh
deno task tui:build
```

- Windows 产物为 `dist/sudoku.exe`
- Linux / macOS 产物为 `dist/sudoku`

Windows 可执行文件的图标 `src/ui/tui/favicon.ico` 由 `src/ui/webui/public/favicon.svg` 转换得到。修改 SVG 后用 ImageMagick 重新生成：

```sh
magick -density 384 -background none src/ui/webui/public/favicon.svg -resize 256x256 -define icon:auto-resize=256,128,64,48,32,16 src/ui/tui/favicon.ico
```

### WebUI 构建

```sh
deno task webui:build
deno task webui:preview
```

构建产物在 `dist/webui/` 中。

## 检查

使用 Deno 进行类型检查

```sh
deno task check
```

使用 Deno 进行静态检查和格式化

```sh
deno task lint
deno task fmt
```

## 测试

使用 Deno 进行测试

```sh
deno task test
```
