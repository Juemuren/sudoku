# 架构

## 项目结构

```txt
src/
  domain/         领域层
  app/            应用层
  ui/             界面层
    styles/        共同样式
    tui/           终端界面
    webui/         浏览器界面
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

多端共用的样式定义在 `ui/styles/` 中。

### 终端界面：`tui/`

终端界面使用 Ink：

- `index.tsx` 是入口。
- `App.tsx` 根据终端尺寸组织棋盘、侧栏和底部状态。
- `layout.ts` 定义布局尺寸，窄终端会调整布局。

#### 终端组件 `components/`

- `SudokuBoard.tsx` 展示棋盘、选中格和冲突格。
- `Header.tsx` 显示难度、计时和统计信息。
- `Sidebar.tsx` 显示操作说明、当前格信息，或存档路径与覆盖确认面板。
- `Footer.tsx` 显示状态和窄终端的按键帮助
- `Rules.tsx` 绘制分隔线。

#### 终端钩子 `hooks/`

- `useGameSession.ts` 持有游戏状态和计时，处理按键、提示、新局及退出。
- `useGameArchive.ts` 收集路径、处理覆盖确认和操作结果，并调用存档用例。

#### 终端存储 `storage/`

- `fileGameStore.ts` 实现终端的 `GameStore`，负责文件读写。
- `validateGameArchive.ts` 在 Worker 中恢复文件存档，并设置校验超时。
- `gameValidationWorker.ts` 是文件存档校验使用的 Worker 入口。

### 浏览器界面：`webui/`

浏览器界面使用 React：

- `main.tsx` 挂载应用。
- `App.tsx` 持有游戏状态、计时和视口宽度。
- `layout.ts` 定义页面布局尺寸。

#### 浏览器组件 `components/`

- `SiteHeader.tsx` 显示站点标题。
- `GamePanel.tsx` 显示难度、统计、棋盘、数字键盘和游戏操作。
- `SudokuBoard.tsx` 展示可点击的棋盘格、选中状态和冲突状态。
- `Sidebar.tsx` 显示存档操作和快捷键。
- `GameArchivePrompt.tsx` 确认加载存档后替换当前进度。

#### 浏览器钩子 `hooks/`

- `useGameKeyboard.ts` 处理游戏和存档快捷键，避开输入控件，并在加载确认或存档处理中暂停。
- `useGameArchive.ts` 管理文件选择、加载确认、操作状态及保存下载。

#### 浏览器存储 `storage/`

- `browserGameArchive.ts` 序列化游戏数据并触发浏览器下载。

## 存档流程

### 终端存档流程

#### 终端的保存

1. `useGameArchive.ts` 收集路径，`fileGameStore.ts` 将其解析为绝对路径。
2. `app/gameSave.ts` 通过 `GameStore` 检查文件是否存在，必要时请求覆盖确认。
3. `fileGameStore.ts` 序列化游戏，先写临时文件，再重命名为目标文件。

#### 终端的加载

1. `fileGameStore.ts` 读取文件并限制大小，`app/gameLoad.ts` 解析 JSON 和检查存档结构。
2. 校验 Worker 调用应用层恢复函数，由 `domain/validation.ts` 检查给定数字和题目，并设有超时。
3. TUI 更新游戏状态；存档中的玩家填数保留。

### 浏览器存档流程

#### 浏览器的保存

1. `browserGameArchive.ts` 调用 `app/gameSave.ts` 将当前游戏序列化为 JSON。
2. 浏览器下载 `sudoku-archive.json`；重名处理由浏览器负责。

#### 浏览器的加载

1. 用户选择 JSON 文件；浏览器会拒绝超过 64 KiB 的文件。
2. `app/gameLoad.ts` 解析、校验存档并恢复游戏状态。
3. `useGameArchive.ts` 暂存恢复结果；用户确认后更新棋盘，保留存档中的玩家填数。
