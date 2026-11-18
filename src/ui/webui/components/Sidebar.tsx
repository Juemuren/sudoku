import type { CSSProperties, RefObject } from "react";
import { colors } from "../../styles/colors.ts";
import {
  MOBILE_SCREEN_MAX_WIDTH,
  STACKED_LAYOUT_MAX_WIDTH,
} from "../layout.ts";

type Props = {
  busy: boolean;
  width: number;
  fileInput: RefObject<HTMLInputElement | null>;
  onSave: () => void;
  onOpenFilePicker: () => void;
  onChooseLoad: (file: File | undefined) => void;
};

export function Sidebar(
  { busy, width, fileInput, onSave, onOpenFilePicker, onChooseLoad }: Props,
) {
  return (
    <aside
      style={{
        display: "grid",
        gap: 20,
        gridTemplateColumns: width <= MOBILE_SCREEN_MAX_WIDTH ||
            width > STACKED_LAYOUT_MAX_WIDTH
          ? "1fr"
          : "repeat(2, minmax(0, 1fr))",
      }}
    >
      <section style={cardStyle(width)} aria-labelledby="archive-title">
        <p style={eyebrowStyle}>YOUR PROGRESS</p>
        <h2 style={headingStyle} id="archive-title">存档文件</h2>
        <p style={introStyle}>
          保存会下载 JSON 文件；加载可从文件恢复进度。
        </p>
        <div style={archiveActionsStyle}>
          <button
            type="button"
            style={{ ...buttonStyle, ...primaryStyle, opacity: busy ? .55 : 1 }}
            disabled={busy}
            onClick={onSave}
          >
            保存文件
          </button>
          <button
            style={{ ...buttonStyle, opacity: busy ? .55 : 1 }}
            type="button"
            disabled={busy}
            onClick={onOpenFilePicker}
          >
            加载文件
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          aria-label="选择 JSON 存档文件"
          onChange={(event) => onChooseLoad(event.target.files?.[0])}
          hidden
        />
      </section>
      <section
        style={{
          ...cardStyle(width),
          background: colors.helpSurface,
          boxShadow: "none",
          borderColor: colors.helpBorder,
        }}
        aria-labelledby="help-title"
      >
        <p style={eyebrowStyle}>QUICK GUIDE</p>
        <h2 style={{ ...headingStyle, marginBottom: 18 }} id="help-title">
          如何操作
        </h2>
        <div style={helpRowStyle}>
          <span>移动选格</span>
          <kbd style={keyStyle}>方向键</kbd>
        </div>
        <div style={helpRowStyle}>
          <span>填写数字</span>
          <kbd style={keyStyle}>1–9</kbd>
        </div>
        <div style={helpRowStyle}>
          <span>清除数字</span>
          <kbd style={keyStyle}>0 / ⌫</kbd>
        </div>
        <div style={helpRowStyle}>
          <span>提示 / 撤销</span>
          <kbd style={keyStyle}>H / U</kbd>
        </div>
        <p style={footnoteStyle}>
          也可直接点击棋盘和数字按钮。红色数字表示行、列或九宫格中有冲突。
        </p>
      </section>
    </aside>
  );
}

function cardStyle(width: number): CSSProperties {
  return {
    boxSizing: "border-box",
    background: colors.surface,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 15,
    padding: width <= MOBILE_SCREEN_MAX_WIDTH ? 22 : 26,
    boxShadow: `0 6px 24px ${colors.cardShadow}`,
  };
}
const eyebrowStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: ".23em",
  color: colors.eyebrow,
};
const headingStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 23,
  letterSpacing: "-.035em",
};
const introStyle: CSSProperties = {
  color: colors.cardIntro,
  fontSize: 13,
  lineHeight: 1.8,
  margin: "0 0 25px",
};
const archiveActionsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 9,
  marginTop: 4,
};
const buttonStyle: CSSProperties = {
  border: `1px solid ${colors.buttonBorder}`,
  borderRadius: 7,
  padding: 10,
  color: colors.buttonText,
  background: colors.surface,
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
};
const primaryStyle: CSSProperties = {
  background: colors.accent,
  borderColor: colors.accent,
  color: colors.surface,
};
const helpRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 0",
  color: colors.helpRowText,
  fontSize: 12,
  borderBottom: `1px solid ${colors.helpDivider}`,
};
const keyStyle: CSSProperties = {
  background: colors.surface,
  border: `1px solid ${colors.keyBorder}`,
  borderRadius: 4,
  padding: "4px 7px",
  color: colors.keyText,
  fontFamily: "inherit",
  fontWeight: 700,
  fontSize: 11,
};
const footnoteStyle: CSSProperties = {
  color: colors.cardFootnote,
  fontSize: 11,
  lineHeight: 1.8,
  margin: "18px 0 0",
};
