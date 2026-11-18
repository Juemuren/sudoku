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
        boxSizing: "border-box",
        display: "grid",
        gap: 20,
        alignContent: "start",
        alignSelf: width > STACKED_LAYOUT_MAX_WIDTH ? "stretch" : undefined,
        borderLeft: width > STACKED_LAYOUT_MAX_WIDTH
          ? `1px solid ${colors.cardBorder}`
          : undefined,
        gridTemplateColumns: width <= MOBILE_SCREEN_MAX_WIDTH ||
            width > STACKED_LAYOUT_MAX_WIDTH
          ? "1fr"
          : "repeat(2, minmax(0, 1fr))",
      }}
    >
      <section style={sectionStyle(width)} aria-labelledby="archive-title">
        <h2 style={{ ...headingStyle, marginBottom: 24 }} id="archive-title">
          存档
        </h2>
        <div style={archiveActionsStyle}>
          <button
            type="button"
            style={{ ...buttonStyle, ...primaryStyle, opacity: busy ? .55 : 1 }}
            disabled={busy}
            onClick={onSave}
          >
            保存
          </button>
          <button
            style={{ ...buttonStyle, opacity: busy ? .55 : 1 }}
            type="button"
            disabled={busy}
            onClick={onOpenFilePicker}
          >
            加载
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
      <section style={sectionStyle(width)} aria-labelledby="help-title">
        <h2 style={{ ...headingStyle, marginBottom: 18 }} id="help-title">
          快捷键
        </h2>
        <div style={helpRowStyle}>
          <span>移动</span>
          <kbd style={keyStyle}>← / ↑ / ↓ / →</kbd>
        </div>
        <div style={helpRowStyle}>
          <span>填写</span>
          <kbd style={keyStyle}>1–9</kbd>
        </div>
        <div style={helpRowStyle}>
          <span>清除</span>
          <kbd style={keyStyle}>0 / ⌫</kbd>
        </div>
        <div style={helpRowStyle}>
          <span>撤销</span>
          <kbd style={keyStyle}>U</kbd>
        </div>
        <div style={helpRowStyle}>
          <span>提示</span>
          <kbd style={keyStyle}>H</kbd>
        </div>
      </section>
    </aside>
  );
}

function sectionStyle(width: number): CSSProperties {
  return {
    boxSizing: "border-box",
    padding: width <= MOBILE_SCREEN_MAX_WIDTH ? 22 : 26,
  };
}
const headingStyle: CSSProperties = {
  margin: "0 0 12px",
  textAlign: "center",
  fontSize: 23,
  letterSpacing: "-.035em",
};
const archiveActionsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 9,
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
