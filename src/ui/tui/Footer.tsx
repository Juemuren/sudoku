import { Text } from "ink";

type Props = {
  message: string;
  solved: boolean;
  conflictCount: number;
};

export function Footer({ message, solved, conflictCount }: Props) {
  return (
    <>
      <Text color={solved ? "green" : conflictCount ? "red" : "yellow"}>
        {message}
        {conflictCount ? ` 冲突格：${conflictCount}` : ""}
      </Text>
      <Text dimColor>方向键 移动 1–9 填入 0/退格 清除 h 提示</Text>
      <Text dimColor>e 简单 m 中等 d 困难 n 同难度新局 q 退出</Text>
    </>
  );
}
