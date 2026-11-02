# 数独游戏

使用 TypeScript 实现的终端数独游戏。题目由回溯算法生成，并检查唯一解。

## 运行

需要 Node.js 26 和 pnpm 12

```sh
pnpm install
pnpm start
```

游戏在交互式终端中运行。

## 检查和测试

使用 TypeScript 进行类型检查

```sh
pnpm run typecheck
```

使用 Biome 进行静态检查和格式化

```sh
pnpm run lint
pnpm run format
```

使用 `node:test` 模块进行测试

```sh
pnpm test
```
