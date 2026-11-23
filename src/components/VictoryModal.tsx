import React from 'react';
import { Award, Copy, Printer, Sparkles, X } from 'lucide-react';
import type { Puzzle } from '../engine/types';
import type { SolvedStats } from '../utils/storage';
import { formatTime } from './HeaderBar';
import { PortraitSvg } from './PortraitSvg';

interface VictoryModalProps {
  puzzle: Puzzle;
  elapsedSeconds: number;
  hintsUsed: number;
  stats: SolvedStats;
  nextCuratedNumber?: number | null;
  onNextCase: () => void;
  onCopySeed: () => void;
  onPrint: () => void;
  onClose: () => void;
}

const ARCHIVAL_FOILS = ['#B43225', '#9E6F21', '#2E3F66', '#2C5E44', '#6D2634', '#C4A259'];

export const VictoryModal: React.FC<VictoryModalProps> = ({
  puzzle,
  elapsedSeconds,
  hintsUsed,
  stats,
  nextCuratedNumber,
  onNextCase,
  onCopySeed,
  onPrint,
  onClose,
}) => {
  const killer = puzzle.people.find((p) => p.id === puzzle.killerId)!;
  const victim = puzzle.people.find((p) => p.id === puzzle.victimId)!;
  const vPos = puzzle.solution[puzzle.victimId];
  const roomName = puzzle.rooms[puzzle.grid[vPos.r][vPos.c].roomId].name;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card closure-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Case Solved"
      >
        <div className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 14 }, (_, idx) => (
            <span
              key={idx}
              className="confetti-piece"
              style={{
                left: `${7 + ((idx * 19) % 86)}%`,
                backgroundColor: ARCHIVAL_FOILS[idx % ARCHIVAL_FOILS.length],
                animationDelay: `${(idx % 5) * 0.14}s`,
                transform: `rotate(${idx * 22}deg)`,
              }}
            />
          ))}
        </div>

        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={20} color="var(--ink-brass)" /> Case Solved!
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </div>

        <div className="victory-hero">
          <div className="verdict-stamp" aria-hidden="true">
            CASE CLOSED
          </div>

          <div className="victory-portrait-frame">
            <PortraitSvg person={killer} size={84} />
          </div>
          <h3 className="victory-culprit-heading">
            {killer.name} was the culprit!
          </h3>
          <p className="victory-culprit-sub">
            All {puzzle.size} witnesses were deduced cleanly — {killer.name} was alone with{' '}
            {victim.name} inside the <strong>{roomName}</strong>, recovering{' '}
            <strong>{puzzle.stolenItem}</strong>.
          </p>
        </div>

        <div className="victory-stats">
          <div className="stat-tile">
            <div className="stat-val">{formatTime(elapsedSeconds)}</div>
            <div className="stat-lbl">Time</div>
          </div>
          <div className="stat-tile">
            <div className="stat-val">{hintsUsed}</div>
            <div className="stat-lbl">Hints Used</div>
          </div>
          <div className="stat-tile">
            <div className="stat-val">{stats.totalSolved}</div>
            <div className="stat-lbl">Cases Solved</div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-lg" onClick={onCopySeed}>
              <Copy size={15} /> Share Seed
            </button>
            <button type="button" className="btn-lg" onClick={onPrint}>
              <Printer size={15} /> Print
            </button>
          </div>
          <button type="button" className="btn-lg primary" onClick={onNextCase}>
            <Sparkles size={16} />{' '}
            {nextCuratedNumber
              ? `Next Case (#${nextCuratedNumber})`
              : puzzle.curatedId
                ? 'Create Random Case'
                : 'Next Random Case'}
          </button>
        </div>
      </div>
    </div>
  );
};
