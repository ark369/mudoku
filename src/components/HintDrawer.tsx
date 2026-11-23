import React from 'react';
import { ArrowRight, Lightbulb, Sparkles, X } from 'lucide-react';
import type { LiveHint } from '../engine/solver';

interface HintDrawerProps {
  hint: LiveHint;
  stage: 1 | 2;
  onRevealLogic: () => void;
  onNextStep: () => void;
  onApplyStep: () => void;
  onClose: () => void;
}

export const HintDrawer: React.FC<HintDrawerProps> = ({
  hint,
  stage,
  onRevealLogic,
  onNextStep,
  onApplyStep,
  onClose,
}) => {
  if (hint.hasConflict && hint.conflictWarning) {
    return (
      <div className="hint-banner" role="status">
        <div className="hint-header">
          <span className="hint-badge" style={{ color: 'var(--ink-crimson)' }}>
            <Lightbulb size={14} /> Clue Conflict Detected
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hint"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--ink-secondary)',
            }}
          >
            <X size={16} />
          </button>
        </div>
        <p className="hint-body">{hint.conflictWarning}</p>
      </div>
    );
  }

  if (!hint.step) return null;

  const { step, stepIndex, totalSteps } = hint;
  const hasApply = Boolean(
    step.placement ||
      (step.targetPersonId && step.survivingCells && step.survivingCells.length > 0) ||
      (step.eliminations && step.eliminations.length > 0)
  );
  const hasMore = stepIndex + 1 < totalSteps;

  const applyLabel = step.placement
    ? 'Place This Character'
    : step.targetPersonId && step.survivingCells
      ? 'Mark Pencil Notes'
      : 'Mark Eliminations';

  return (
    <div className="hint-banner" role="status">
      <div className="hint-header">
        <span className="hint-badge">
          <Lightbulb size={14} /> {stage === 1 ? 'Detective Nudge' : `Logic: ${step.rule}`}
          {totalSteps > 1 && (
            <span style={{ opacity: 0.75, marginLeft: 4 }}>
              ({stepIndex + 1}/{totalSteps})
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close hint"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: 'var(--ink-secondary)',
          }}
        >
          <X size={16} />
        </button>
      </div>

      <p className="hint-body">{stage === 1 ? step.nudge : step.explanation}</p>

      <div className="hint-actions">
        {stage === 1 && (
          <button type="button" className="hint-action-btn" onClick={onRevealLogic}>
            Show Full Reasoning
          </button>
        )}
        {hasMore && (
          <button type="button" className="hint-action-btn" onClick={onNextStep}>
            Next Step <ArrowRight size={13} style={{ marginLeft: 3, verticalAlign: '-2px' }} />
          </button>
        )}
        {hasApply && (
          <button type="button" className="hint-action-btn primary" onClick={onApplyStep}>
            <Sparkles size={13} style={{ marginRight: 4, verticalAlign: '-2px' }} />
            {applyLabel}
          </button>
        )}
        <button type="button" className="hint-action-btn" onClick={onClose}>
          Got It
        </button>
      </div>
    </div>
  );
};
