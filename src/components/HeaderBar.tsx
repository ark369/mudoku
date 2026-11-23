import React from 'react';
import {
  BookMarked,
  BookOpen,
  Clock,
  Copy,
  Printer,
  Settings,
  Trophy,
} from 'lucide-react';
import { DIFFICULTY_CONFIG, type Puzzle } from '../engine/types';
import { MYSTERY_THEMES } from '../engine/themes';

interface HeaderBarProps {
  puzzle: Puzzle;
  elapsedSeconds: number;
  totalSolved: number;
  onOpenNewCase: () => void;
  onOpenRules: () => void;
  onOpenTrophies: () => void;
  onPrint: () => void;
  onToggleSettings: () => void;
  onCopySeed: () => void;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  puzzle,
  elapsedSeconds,
  totalSolved,
  onOpenNewCase,
  onOpenRules,
  onOpenTrophies,
  onPrint,
  onToggleSettings,
  onCopySeed,
}) => {
  const diff = DIFFICULTY_CONFIG[puzzle.difficulty];
  const theme = MYSTERY_THEMES.find((t) => t.id === puzzle.themeId);
  const catalogRef = puzzle.caseNumber
    ? `NO. ${String(puzzle.caseNumber).padStart(2, '0')}`
    : `#${puzzle.seed}`;

  return (
    <header className="header-bar">
      <div className="folio-masthead">
        <span className="folio-wordmark">
          MURDOKU <span className="folio-diamond" aria-hidden="true">◆</span>
        </span>
        <span className="folio-eyebrow">
          {theme?.name ?? 'Mystery'} · {puzzle.size}×{puzzle.size}
        </span>
      </div>

      <div className="folio-catalog">
        <button
          type="button"
          className="catalog-stamp"
          onClick={onCopySeed}
          title="Tap to copy Case Seed so family can play the same puzzle"
        >
          <span
            className="catalog-pip"
            style={{ backgroundColor: diff.badgeColor }}
            aria-hidden="true"
          />
          <span>
            {diff.label.toUpperCase()} · {catalogRef}
          </span>
          <Copy size={11} />
        </button>

        <span className="folio-timer" aria-label="Elapsed time">
          <Clock size={13} />
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      <nav className="folio-nav" aria-label="Folio controls">
        <button
          type="button"
          className="folio-btn primary"
          onClick={onOpenNewCase}
          aria-label="Open Casebook"
        >
          <BookMarked size={15} />
          <span className="hide-compact">Casebook</span>
        </button>
        <button
          type="button"
          className="folio-btn"
          onClick={onOpenRules}
          aria-label="How to Play"
        >
          <BookOpen size={15} />
          <span className="hide-compact">Rules</span>
        </button>
        <button
          type="button"
          className="folio-btn"
          onClick={onPrint}
          aria-label="Print Puzzle"
        >
          <Printer size={15} />
          <span className="hide-compact">Print</span>
        </button>
        <button
          type="button"
          className="folio-btn"
          onClick={onOpenTrophies}
          aria-label="Trophy Shelf"
          title="Detective Trophy Shelf"
        >
          <Trophy size={15} className="trophy-glyph" />
          <span className="folio-trophy-count">{totalSolved}</span>
        </button>
        <button
          type="button"
          className="folio-btn icon-only"
          onClick={onToggleSettings}
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>
      </nav>
    </header>
  );
};
