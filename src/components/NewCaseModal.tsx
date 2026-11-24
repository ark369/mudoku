import React, { useState } from 'react';
import { BookMarked, Calendar, Check, ChevronRight, Shuffle, Sparkles, X } from 'lucide-react';
import { getCuratedCasesByDifficulty } from '../engine/curatedCases';
import { createSeedCode, getDailySeed } from '../engine/rng';
import { MYSTERY_THEMES } from '../engine/themes';
import { DIFFICULTY_CONFIG, type Difficulty } from '../engine/types';
import type { CuratedSolveRecord } from '../utils/storage';

interface NewCaseModalProps {
  currentDifficulty: Difficulty;
  currentThemeId: string;
  currentCuratedId?: string;
  solvedCurated: Record<string, CuratedSolveRecord>;
  onSelectCuratedCase: (caseId: string) => void;
  onStartCase: (difficulty: Difficulty, seed: string, themeId: string) => void;
  onClose: () => void;
}

const DIFFICULTIES: Difficulty[] = ['starter', 'easy', 'medium', 'hard', 'expert'];

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  currentDifficulty,
  currentThemeId,
  currentCuratedId,
  solvedCurated,
  onSelectCuratedCase,
  onStartCase,
  onClose,
}) => {
  const [tab, setTab] = useState<'curated' | 'random'>('curated');
  const [difficulty, setDifficulty] = useState<Difficulty>(currentDifficulty);
  const [themeId, setThemeId] = useState<string>('random');
  const [seedInput, setSeedInput] = useState<string>('');

  const curatedList = getCuratedCasesByDifficulty(difficulty);

  const handleStartCustom = () => {
    const chosenTheme = themeId === 'random' ? undefined : themeId;
    const tag = chosenTheme
      ? MYSTERY_THEMES.find((t) => t.id === chosenTheme)?.seedTag ?? 'CASE'
      : 'CASE';
    const seed = seedInput.trim() ? seedInput.trim().toUpperCase() : createSeedCode(tag);
    onStartCase(difficulty, seed, themeId);
    onClose();
  };

  const handleQuickRandom = () => {
    onStartCase(difficulty, createSeedCode('RAND'), 'random');
    onClose();
  };

  const handleStartDaily = () => {
    const dailySeed = getDailySeed(difficulty);
    onStartCase(difficulty, dailySeed, 'random');
    onClose();
  };

  void currentThemeId;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card casebook-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Casebook and Case Generator"
      >
        <div className="modal-header" style={{ marginBottom: 10 }}>
          <h2 className="modal-title">Mystery Casebook</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="casebook-tabs" role="tablist" aria-label="Case mode">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'curated'}
            className={`casebook-tab ${tab === 'curated' ? 'active' : ''}`}
            onClick={() => setTab('curated')}
          >
            <BookMarked size={16} /> Hand-Picked Cases (25)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'random'}
            className={`casebook-tab ${tab === 'random' ? 'active' : ''}`}
            onClick={() => setTab('random')}
          >
            <Shuffle size={16} /> Create Random
          </button>
        </div>

        {tab === 'curated' ? (
          <>
            <div className="casebook-diff-pills" role="tablist" aria-label="Filter by difficulty">
              {DIFFICULTIES.map((d) => {
                const cfg = DIFFICULTY_CONFIG[d];
                const cases = getCuratedCasesByDifficulty(d);
                const solvedInTier = cases.filter((c) => Boolean(solvedCurated[c.id])).length;
                return (
                  <button
                    key={d}
                    type="button"
                    role="tab"
                    aria-selected={difficulty === d}
                    className={`casebook-diff-pill ${difficulty === d ? 'active' : ''}`}
                    onClick={() => setDifficulty(d)}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: cfg.badgeColor,
                        display: 'inline-block',
                      }}
                    />
                    <span>{cfg.label}</span>
                    <span className="casebook-tier-count">
                      {solvedInTier}/{cases.length}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="casebook-tier-caption">
              {DIFFICULTY_CONFIG[difficulty].subtitle} — 5 vetted cases
            </div>

            <div className="casebook-list">
              {curatedList.map((c) => {
                const theme = MYSTERY_THEMES.find((t) => t.id === c.themeId);
                const rec = solvedCurated[c.id];
                const isPlaying = currentCuratedId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`curated-case-card ${isPlaying ? 'playing' : ''} ${
                      rec ? 'solved' : ''
                    }`}
                    onClick={() => {
                      onSelectCuratedCase(c.id);
                      onClose();
                    }}
                  >
                    <div
                      className={`curated-num-badge ${rec ? 'solved' : ''}`}
                      style={
                        !rec
                          ? { backgroundColor: DIFFICULTY_CONFIG[c.difficulty].badgeColor }
                          : undefined
                      }
                    >
                      {rec ? <Check size={16} strokeWidth={3} /> : `#${c.caseNumber}`}
                    </div>

                    <div className="curated-case-body">
                      <div className="curated-case-top">
                        <span className="curated-case-title">{c.title}</span>
                        {isPlaying && <span className="curated-playing-pill">Playing</span>}
                        {c.patternBadge && (
                          <span className="curated-pattern-pill">{c.patternBadge}</span>
                        )}
                      </div>
                      <div className="curated-case-tagline">{c.tagline}</div>
                      <div className="curated-meta-row">
                        <span>{theme?.name ?? c.themeId}</span>
                        {rec && <span>• Solved</span>}
                      </div>
                    </div>

                    <ChevronRight size={18} color="var(--ink-muted)" />
                  </button>
                );
              })}
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between', marginTop: 14 }}>
              <button
                type="button"
                className="btn-lg"
                onClick={() => setTab('random')}
              >
                <Shuffle size={16} /> Custom / Daily
              </button>
              <button type="button" className="btn-lg primary" onClick={handleQuickRandom}>
                <Sparkles size={16} /> Quick Random {DIFFICULTY_CONFIG[difficulty].label}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-section-label">1. Choose Difficulty & Grid Size</div>
            <div className="diff-grid">
              {DIFFICULTIES.map((d) => {
                const cfg = DIFFICULTY_CONFIG[d];
                return (
                  <button
                    key={d}
                    type="button"
                    className={`diff-option ${difficulty === d ? 'active' : ''}`}
                    onClick={() => setDifficulty(d)}
                  >
                    <div className="diff-option-name">
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: cfg.badgeColor,
                          display: 'inline-block',
                        }}
                      />
                      {cfg.label}
                    </div>
                    <div className="diff-option-sub">{cfg.subtitle}</div>
                  </button>
                );
              })}
            </div>

            <div className="modal-section-label">2. Pick Crime Scene Location</div>
            <div className="theme-grid">
              <button
                type="button"
                className={`theme-option ${themeId === 'random' ? 'active' : ''}`}
                onClick={() => setThemeId('random')}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    display: 'flex',
                    gap: 5,
                    alignItems: 'center',
                  }}
                >
                  <Shuffle size={14} /> Surprise Me
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-secondary)' }}>
                  Random cozy setting
                </div>
              </button>

              {MYSTERY_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-option ${themeId === t.id ? 'active' : ''}`}
                  onClick={() => setThemeId(t.id)}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.86rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-secondary)' }}>
                    {t.subtitle}
                  </div>
                </button>
              ))}
            </div>

            <div className="modal-section-label">3. Shared Family Seed (Optional)</div>
            <div className="seed-row">
              <input
                type="text"
                className="seed-input"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder="Leave blank for random, or enter e.g. MANOR-4821"
                aria-label="Optional case seed code"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-lg brass" onClick={handleStartDaily}>
                <Calendar size={17} /> Today’s Daily Case
              </button>
              <button type="button" className="btn-lg primary" onClick={handleStartCustom}>
                <Sparkles size={17} /> Create Random Case
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
