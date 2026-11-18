# 架构说明

## 项目结构

```txt
src/
  domain/         领域层
  app/            应用层
  ui/             界面层
    tui/              终端界面
  storage/        存储层
```

## 领域：`src/domain/`

领域层只处理棋盘和数独规则，是独立的纯逻辑。

- `board.ts` 定义棋盘、坐标工具和棋盘数据检查。
- `rules.ts` 计算候选数、冲突格和完成状态。
- `validation.ts` 检查唯一解和给定数字是否被修改。
- `generator.ts` 生成题目。
- `solver.ts` 用回溯搜索解。

## 应用：`src/app/`

应用层负责游戏状态和存档用例，依赖领域层。

- `gameState.ts` 处理新游戏、输入、提示和撤销。
- `gameStats.ts` 计算界面需要的统计值。
- `gameArchive.ts` 定义存档数据结构和校验规则。
- `gameStore.ts` 定义平台存储接口 `GameStore`。
- `gameSave.ts` 处理覆盖确认和游戏序列化。
- `gameLoad.ts` 解析存档并恢复游戏状态。

## 界面：`src/ui/`

界面层负责展示内容和处理用户事件，依赖领域层和应用层。

### 终端界面：`src/ui/tui/`

终端界面使用 Ink，由 Ink 组件负责展示内容和处理用户事件。

`useGameArchive.ts` 收集路径、显示覆盖确认与操作结果，并调用存档用例。

### 浏览器界面：`src/ui/webui`

浏览器界面尚未实现。实现规划参考 [PLAN.md](PLAN.md)。

## 存储：`src/storage/`

`fileGameStore.ts` 实现 `GameStore`，供 TUI 使用。
它解析本地路径、限制读取大小，并通过临时文件写入存档。
存档格式和数独校验留在应用层与领域层。

`validateGameArchive.ts` 和 `gameValidationWorker.ts` 在 Worker 中恢复存档，
并为题目校验设置超时。Worker 不定义校验规则。

### 存档流程

#### 保存

1. TUI 取得并解析路径。
2. `app/gameSave.ts` 判断是否需要覆盖确认。
3. `fileGameStore.ts` 调用 `app/gameSave.ts` 序列化并写入文件。

#### 加载

1. `fileGameStore.ts` 读取文件并限制大小。
2. `app/gameLoad.ts` 检查 JSON 结构。
3. Worker 调用应用层恢复函数，由 `domain/validation.ts` 校验题目。
4. TUI 更新游戏状态。玩家填错的数字会保留。
