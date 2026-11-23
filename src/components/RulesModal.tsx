import React from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="How to Play Murdoku"
      >
        <div className="modal-header">
          <h2 className="modal-title">How to Play Murdoku</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p style={{ marginTop: 0, fontSize: '0.88rem', color: 'var(--ink-secondary)' }}>
          Every mystery has one pure logic solution — no guessing needed! Place every suspect and
          the Victim onto the floor plan by following four simple rules:
        </p>

        <div className="rules-grid">
          <div className="rule-panel">
            <h4>1. One Per Row & Column</h4>
            <p>
              Just like Sudoku, every row and every column holds <strong>exactly one person</strong>{' '}
              (including the Victim). Placing someone rules out the rest of their row and column.
            </p>
          </div>

          <div className="rule-panel">
            <h4>2. Walls & “Beside”</h4>
            <p>
              Thick dark lines are walls. <strong>Beside</strong> means directly North, South, East,
              or West (not diagonal!) and inside the <strong>same room</strong> — never across a
              wall.
            </p>
          </div>

          <div className="rule-panel">
            <h4>3. Furniture & Obstacles</h4>
            <p>
              People can sit or stand <strong>on</strong> chairs, rugs, sofas, beds, cars, or mats.
              Solid obstacles like plants, tables, shelves, or pianos block their square — suspects
              can only stand beside them!
            </p>
          </div>

          <div className="rule-panel">
            <h4>4. Catching the Culprit</h4>
            <p>
              Every clue is 100% true. Once all characters are placed, the <strong>culprit</strong>{' '}
              is the one suspect left <strong>alone in the same room with the Victim</strong>!
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: '10px 12px',
            borderRadius: 12,
            background: 'var(--bg-parchment)',
            fontSize: '0.82rem',
            color: 'var(--ink-primary)',
          }}
        >
          <strong>iPad Touch Tips:</strong> Tap any suspect card to highlight matching rooms or
          items on the map. Use <strong>Cross Out (✕)</strong> and drag your finger to mark off
          multiple squares in one smooth swipe, or long-press any square for quick options!
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-lg primary" onClick={onClose}>
            Back to Case
          </button>
        </div>
      </div>
    </div>
  );
};
