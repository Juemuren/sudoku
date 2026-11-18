import type { RefObject } from "react";

type Props = {
  busy: boolean;
  fileInput: RefObject<HTMLInputElement | null>;
  onSave: () => void;
  onOpenFilePicker: () => void;
  onChooseLoad: (file: File | undefined) => void;
};

export function Sidebar(
  { busy, fileInput, onSave, onOpenFilePicker, onChooseLoad }: Props,
) {
  return (
    <aside className="side-panel">
      <section className="archive-card" aria-labelledby="archive-title">
        <p className="eyebrow">YOUR PROGRESS</p>
        <h2 id="archive-title">存档文件</h2>
        <p className="card-intro">
          保存会下载 JSON 文件；加载可从文件恢复进度。
        </p>
        <div className="archive-actions">
          <button
            type="button"
            className="primary"
            disabled={busy}
            onClick={onSave}
          >
            保存文件
          </button>
          <button type="button" disabled={busy} onClick={onOpenFilePicker}>
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
      <section className="help-card" aria-labelledby="help-title">
        <p className="eyebrow">QUICK GUIDE</p>
        <h2 id="help-title">如何操作</h2>
        <div className="help-row">
          <span>移动选格</span>
          <kbd>方向键</kbd>
        </div>
        <div className="help-row">
          <span>填写数字</span>
          <kbd>1–9</kbd>
        </div>
        <div className="help-row">
          <span>清除数字</span>
          <kbd>0 / ⌫</kbd>
        </div>
        <div className="help-row">
          <span>提示 / 撤销</span>
          <kbd>H / U</kbd>
        </div>
        <p className="help-footnote">
          也可直接点击棋盘和数字按钮。红色数字表示行、列或九宫格中有冲突。
        </p>
      </section>
    </aside>
  );
}
