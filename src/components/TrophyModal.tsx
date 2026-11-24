import React from 'react';
import { BookMarked, Calendar, Trophy, X } from 'lucide-react';
import { CURATED_CASES } from '../engine/curatedCases';
import { DIFFICULTY_CONFIG, type Difficulty } from '../engine/types';
import type { SolvedStats } from '../utils/storage';

interface TrophyModalProps {
  stats: SolvedStats;
  onStartDaily: (difficulty: Difficulty) => void;
  onOpenCasebook: () => void;
  onClose: () => void;
}

const DIFFICULTIES: Difficulty[] = ['starter', 'easy', 'medium', 'hard', 'expert'];

export const TrophyModal: React.FC<TrophyModalProps> = ({
  stats,
  onStartDaily,
  onOpenCasebook,
  onClose,
}) => {
  const curatedSolvedCount = Object.keys(stats.solvedCurated ?? {}).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Detective Trophy Shelf"
      >
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={20} color="var(--ink-brass)" /> Detective Trophy Shelf
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="trophy-summary-banner">
          <div className="trophy-big-count">{stats.totalSolved}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>
              Total Mystery Cases Solved
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
              Hand-Picked Casebook: <strong>{curatedSolvedCount} / {CURATED_CASES.length}</strong> solved
            </div>
          </div>
          <button
            type="button"
            className="trophy-daily-btn"
            onClick={() => {
              onClose();
              onOpenCasebook();
            }}
          >
            <BookMarked size={13} /> Casebook
          </button>
        </div>

        <div className="trophy-grid">
          {DIFFICULTIES.map((d) => {
            const cfg = DIFFICULTY_CONFIG[d];
            const solvedCount = stats.byDifficulty[d] ?? 0;
            return (
              <div key={d} className="trophy-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    className="difficulty-pill"
                    style={{ backgroundColor: cfg.badgeColor, minWidth: 74, justifyContent: 'center' }}
                  >
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    {solvedCount} solved
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="trophy-daily-btn"
                    onClick={() => {
                      onStartDaily(d);
                      onClose();
                    }}
                    title={`Play Today's ${cfg.label} Daily Case`}
                  >
                    <Calendar size={13} /> Daily
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-lg primary" onClick={onClose}>
            Back to Investigation
          </button>
        </div>
      </div>
    </div>
  );
};
