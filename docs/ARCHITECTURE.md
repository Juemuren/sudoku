# 架构说明

## 项目结构

```txt
src/
  domain/         领域层
  app/            应用层
  ui/             界面层
    tui/              终端界面
      components/      终端组件
      hooks/           终端钩子
      storage/         终端存储
    webui/            浏览器界面
```

## 领域：`src/domain/`

领域层只处理棋盘和数独规则，是独立的纯逻辑。

- `board.ts` 定义棋盘、坐标工具和棋盘数据检查。
- `rules.ts` 计算候选数、冲突格和完成状态。
- `validation.ts` 检查唯一解和给定数字是否被修改。
- `generator.ts` 生成题目。
- `solver.ts` 用回溯搜索解。
- `strategy.ts` 根据当前棋盘寻找唯一候选数或唯一位置，并给出理由；找不到时不进行猜测。

## 应用：`src/app/`

应用层负责游戏状态和存档用例，依赖领域层。

- `gameState.ts` 处理新游戏、输入、撤销和辅助填格的通用状态更新。
- `gameHint.ts` 提供人类推理提示和直接填入答案两种游戏操作。
- `gameStats.ts` 计算界面需要的统计值。
- `gameArchive.ts` 定义存档数据结构和校验规则。
- `gameStore.ts` 定义平台存储接口 `GameStore`。
- `gameSave.ts` 处理覆盖确认和游戏序列化。
- `gameLoad.ts` 解析存档并恢复游戏状态。

## 界面：`src/ui/`

界面层负责展示内容和处理用户事件，依赖领域层和应用层。

### 终端界面：`tui/`

终端界面使用 Ink。

#### 终端组件 `components/`

- `SudokuBoard.tsx` 展示棋盘
- `Header.tsx` 显示统计信息
- `Footer.tsx` 显示操作提示
- `GameArchivePrompt.tsx` 显示存档对话

#### 终端钩子 `hooks/`

- `useGameArchive.ts` 收集路径、处理覆盖确认与操作结果，并调用存档用例。

#### 终端存储 `storage/`

- `fileGameStore.ts` 实现终端的 `GameStore`，负责文件读写。
- `validateGameArchive.ts` 在 Worker 中恢复文件存档，并设置校验超时。
- `gameValidationWorker.ts` 是文件存档校验使用的 Worker 入口。

### 浏览器界面：`webui/`

浏览器界面使用 React。

`App.tsx` 展示棋盘、统计和操作按钮，并调用应用层的游戏用例。

## 存档流程

### 终端存档流程

#### 终端的保存

1. TUI 取得并解析路径。
2. `app/gameSave.ts` 判断是否需要覆盖确认。
3. `fileGameStore.ts` 调用 `app/gameSave.ts` 序列化并写入文件。

#### 终端的加载

1. `fileGameStore.ts` 读取文件并限制大小。
2. `app/gameLoad.ts` 检查 JSON 结构。
3. Worker 调用应用层恢复函数，由 `domain/validation.ts` 校验题目。
4. TUI 更新游戏状态。玩家填错的数字会保留。

### 浏览器存档流程

`ui/webui/browserGameArchive.ts` 负责浏览器的文件读写交互。

浏览器与终端共用应用层定义的 JSON 存档格式。

#### 浏览器的保存

1. `app/gameSave.ts` 将当前游戏序列化为 JSON。
2. 浏览器下载存档文件；文件命名和重名处理由浏览器负责。

#### 浏览器的加载

1. 用户选择 JSON 文件；浏览器先拒绝超过 64 KiB 的文件。
2. `app/gameLoad.ts` 解析并校验存档，恢复游戏状态。
3. 用户确认后更新棋盘，保留玩家填错的数字。
