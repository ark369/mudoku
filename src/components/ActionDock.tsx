import React from 'react';
import {
  CheckCircle2,
  Eraser,
  Lightbulb,
  MapPin,
  Pencil,
  Redo2,
  Undo2,
  X,
} from 'lucide-react';

export type InputMode = 'place' | 'note' | 'cross' | 'erase';

interface ActionDockProps {
  mode: InputMode;
  onChangeMode: (mode: InputMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onCheckClues: () => void;
  onRequestHint: () => void;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  mode,
  onChangeMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onCheckClues,
  onRequestHint,
}) => {
  return (
    <div className="action-dock" role="toolbar" aria-label="Drafting tools">
      <div className="mode-group">
        <button
          type="button"
          className={`mode-btn ${mode === 'place' ? 'active' : ''}`}
          onClick={() => onChangeMode('place')}
          aria-pressed={mode === 'place'}
          aria-label="Place"
        >
          <MapPin size={15} />
          <span className="mode-label">Place</span>
        </button>
        <button
          type="button"
          className={`mode-btn ${mode === 'note' ? 'active' : ''}`}
          onClick={() => onChangeMode('note')}
          aria-pressed={mode === 'note'}
          aria-label="Notes"
        >
          <Pencil size={15} />
          <span className="mode-label">Notes</span>
        </button>
        <button
          type="button"
          className={`mode-btn ${mode === 'cross' ? 'active cross-mode' : ''}`}
          onClick={() => onChangeMode('cross')}
          aria-pressed={mode === 'cross'}
          aria-label="Cross Out"
        >
          <X size={15} strokeWidth={2.5} />
          <span className="mode-label">Cross Out</span>
        </button>
        <button
          type="button"
          className={`mode-btn ${mode === 'erase' ? 'active' : ''}`}
          onClick={() => onChangeMode('erase')}
          aria-pressed={mode === 'erase'}
          aria-label="Eraser"
        >
          <Eraser size={15} />
          <span className="mode-label">Eraser</span>
        </button>
      </div>

      <span className="dock-divider" aria-hidden="true" />

      <div className="utility-group">
        <button
          type="button"
          className="dock-btn icon-square"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 size={15} />
        </button>
        <button
          type="button"
          className="dock-btn icon-square"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 size={15} />
        </button>
        <button
          type="button"
          className="dock-btn check-btn"
          onClick={onCheckClues}
        >
          <CheckCircle2 size={15} />
          <span>Check</span>
        </button>
        <button
          type="button"
          className="dock-btn hint-btn"
          onClick={onRequestHint}
        >
          <Lightbulb size={15} />
          <span>Hint</span>
        </button>
      </div>
    </div>
  );
};
