# 持续集成

## 构建

[Build](../.github/workflows/build.yml)。

触发条件：推送到 `main`、面向 `main` 的 PR 或手动运行。

任务内容：执行类型检查、测试、构建 WebUI 与 TUI。不上传构建产物。

## 部署

[Deploy Web](../.github/workflows/deploy.yml)。

触发条件：推送到 `main` 或手动运行。

任务内容：执行类型检查、构建、部署 WebUI 到 GitHub Pages。

## 发布

[Publish Release](../.github/workflows/release.yml)。

触发条件：推送 `v*` 标签。

任务内容：执行类型检查、多平台构建、创建 GitHub Release、上传二进制压缩包。

各平台及对应的文件为：

| 平台        | 文件                        |
| ----------- | --------------------------- |
| Windows x64 | `sudoku-windows-x64.zip`    |
| Linux x64   | `sudoku-linux-x64.tar.gz`   |
| macOS arm64 | `sudoku-macos-arm64.tar.gz` |

推送示例：

```sh
git tag v1.0.0
git push origin v1.0.0
```
