# 开发文档

## 技术栈

主要工具

- 运行环境和包管理器都使用 Deno
- 游戏逻辑使用 TypeScript

对于 UI

- WebUI 框架使用 React，打包使用 Vite
- TUI 框架使用 Ink，打包使用 Deno

对于检查和测试

- Lint / Format / Test 都使用 Deno
- JSON Schema 验证使用 Zod

## 架构规划

```mermaid
flowchart LR
  subgraph UI[UI]
    TUI[TUI<br>Ink]
    WEBUI[WebUI<br>React<br>（尚未实现）]
  end

  subgraph Shared[Shared]
    STATE[Game State]
    BOARD[Board Model]
    RULES[Rules]
    VAL[Validation]
    GEN[Puzzle Generator]
    AUTO[Auto Solver<br>（部分实现）]
    HUMAN[Human Solver<br>（尚未实现）]
    STORE[Save / Load]
  end

  TUI --> STATE
  WEBUI --> STATE

  STATE --> BOARD
  STATE --> RULES
  STATE --> VAL
  STATE --> GEN
  STATE --> AUTO
  STATE --> HUMAN
  STATE --> STORE
```

## 项目结构

```txt
src/
  ui/
    tui/
    webui/
  app/                游戏逻辑
  storage/            存档
  domain/
    board.ts          棋盘模型
    rules.ts          游戏规则
    generator.ts      生成器
    solver.ts         求解器
```
