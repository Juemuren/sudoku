type Props = {
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function GameArchivePrompt({ busy, onCancel, onConfirm }: Props) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <p className="eyebrow">PLEASE CONFIRM</p>
        <h2 id="dialog-title">加载这份存档？</h2>
        <p id="dialog-description">
          当前棋盘会被文件中的进度替换。请先保存需要保留的进度。
        </p>
        <div className="dialog-actions">
          <button type="button" autoFocus onClick={onCancel} disabled={busy}>
            取消
          </button>
          <button
            type="button"
            className="primary"
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
