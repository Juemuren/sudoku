type Props = {
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function GameArchivePrompt({ busy, onCancel, onConfirm }: Props) {
  return (
    <div style={backdropStyle} role="presentation">
      <div
        style={dialogStyle}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <p style={eyebrowStyle}>PLEASE CONFIRM</p>
        <h2 style={headingStyle} id="dialog-title">加载这份存档？</h2>
        <p style={descriptionStyle} id="dialog-description">
          当前棋盘会被文件中的进度替换。请先保存需要保留的进度。
        </p>
        <div style={actionsStyle}>
          <button
            style={{ ...buttonStyle, opacity: busy ? .55 : 1 }}
            type="button"
            autoFocus
            onClick={onCancel}
            disabled={busy}
          >
            取消
          </button>
          <button
            type="button"
            style={{ ...buttonStyle, ...primaryStyle, opacity: busy ? .55 : 1 }}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "处理中…" : "确认替换"}
          </button>
        </div>
      </div>
    </div>
  );
}
import type { CSSProperties } from "react";
import { colors } from "../../styles/colors.ts";

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "grid",
  placeItems: "center",
  padding: 20,
  background: colors.backdrop,
  zIndex: 10,
};
const dialogStyle: CSSProperties = {
  boxSizing: "border-box",
  width: "min(100%, 390px)",
  background: colors.surface,
  padding: 28,
  borderRadius: 14,
  boxShadow: `0 20px 60px ${colors.dialogShadow}`,
};
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
const descriptionStyle: CSSProperties = {
  color: colors.muted,
  fontSize: 13,
  lineHeight: 1.7,
  margin: "0 0 13px",
};
const actionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 9,
  marginTop: 22,
};
const buttonStyle: CSSProperties = {
  minWidth: 84,
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
