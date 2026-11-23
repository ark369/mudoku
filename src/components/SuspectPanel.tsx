import React from 'react';
import { AlertTriangle, Check, FileText } from 'lucide-react';
import { MYSTERY_THEMES } from '../engine/themes';
import type { Clue, Coord, Person, Puzzle } from '../engine/types';
import { AccusePanel } from './AccusePanel';
import { PortraitSvg } from './PortraitSvg';

interface SuspectPanelProps {
  puzzle: Puzzle;
  activePersonId: string | null;
  activeClueId: string | null;
  placements: Record<string, Coord>;
  checkedOwners: Set<string>;
  violatedClueIds: Set<string>;
  hintClueIds: Set<string>;
  readyToAccuse: boolean;
  hasRowColConflict?: boolean;
  hideCompactAccuse?: boolean;
  hintSlot?: React.ReactNode;
  onSelectPerson: (personId: string | null) => void;
  onSelectCaseClue: (clueId: string) => void;
  onToggleCheckedOwner: (ownerId: string) => void;
  onAccuseSuspect: (suspectId: string) => void;
}

export const SuspectPanel: React.FC<SuspectPanelProps> = ({
  puzzle,
  activePersonId,
  activeClueId,
  placements,
  checkedOwners,
  violatedClueIds,
  hintClueIds,
  readyToAccuse,
  hasRowColConflict = false,
  hideCompactAccuse = false,
  hintSlot,
  onSelectPerson,
  onSelectCaseClue,
  onToggleCheckedOwner,
  onAccuseSuspect,
}) => {
  const caseNotes = puzzle.clues.filter((c) => c.ownerId === 'case');
  const cluesByPerson = new Map<string, Clue[]>();
  for (const clue of puzzle.clues) {
    if (clue.ownerId === 'case') continue;
    const arr = cluesByPerson.get(clue.ownerId) ?? [];
    arr.push(clue);
    cluesByPerson.set(clue.ownerId, arr);
  }

  const theme = MYSTERY_THEMES.find((t) => t.id === puzzle.themeId);
  const totalCount = puzzle.people.length;

  return (
    <aside
      className={`suspect-column ${hideCompactAccuse ? 'hide-compact-accuse' : ''}`}
      aria-label="Case File and Clues"
    >
      {hintSlot}
      <div className="suspect-scroll">
        <div className="premise-banner">
          <div className="premise-eyebrow">
            <span>
              {puzzle.caseNumber
                ? `CASE NO. ${String(puzzle.caseNumber).padStart(2, '0')}`
                : 'RANDOM FILE'}{' '}
              · {theme?.name ?? 'Mystery'}
            </span>
            {puzzle.patternBadge && (
              <span className="folio-pattern-stamp">{puzzle.patternBadge}</span>
            )}
          </div>
          <h2 className="premise-title">{puzzle.title}</h2>
          <p className="premise-text">{puzzle.premise}</p>
        </div>

        {caseNotes.length > 0 && (
          <div className="case-notes-box">
            <div className="case-notes-title">
              <FileText size={12} /> Case Notes
            </div>
            {caseNotes.map((cn) => {
              const isActive = activeClueId === cn.id;
              const isConflict = violatedClueIds.has(cn.id);
              return (
                <button
                  key={cn.id}
                  type="button"
                  className={`case-note-item ${isActive ? 'active' : ''} ${
                    isConflict ? 'conflict' : ''
                  }`}
                  onClick={() => onSelectCaseClue(cn.id)}
                >
                  <span>{cn.text}</span>
                  {isConflict && <AlertTriangle size={14} color="var(--ink-crimson)" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="dossier-section-rule">
          <span>Witness Statements</span>
          <span>{totalCount} Persons</span>
        </div>

        <div className="suspect-list">
          {puzzle.people.map((person: Person) => {
            const personClues = cluesByPerson.get(person.id) ?? [];
            const isSelected = activePersonId === person.id && !activeClueId;
            const isChecked = checkedOwners.has(person.id);
            const placedPos = placements[person.id];
            const hasConflict = personClues.some((c) => violatedClueIds.has(c.id));
            const isHinted = personClues.some((c) => hintClueIds.has(c.id));

            return (
              <div
                key={person.id}
                data-person-card={person.id}
                role="button"
                tabIndex={0}
                style={{ ['--person-ink' as string]: person.color }}
                className={`suspect-card ${person.isVictim ? 'victim-card' : ''} ${
                  isSelected ? 'selected' : ''
                } ${isChecked ? 'checked-off' : ''} ${hasConflict ? 'conflict' : ''} ${
                  isHinted ? 'hinted' : ''
                }`}
                onClick={() => onSelectPerson(isSelected ? null : person.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPerson(isSelected ? null : person.id);
                  }
                }}
              >
                <PortraitSvg person={person} size={50} />

                <div className="suspect-card-body">
                  <div className="suspect-card-header">
                    <div className="suspect-name-row">
                      <span className="suspect-name">{person.name}</span>
                      <span className="suspect-role">{person.roleTitle}</span>
                      {person.isVictim && <span className="victim-tag">Victim</span>}
                      {hasConflict && (
                        <AlertTriangle
                          size={14}
                          color="var(--ink-crimson)"
                          aria-label="Clue conflict"
                        />
                      )}
                    </div>

                    {placedPos && (
                      <span className="placed-pill">
                        R{placedPos.r + 1}·C{placedPos.c + 1}
                      </span>
                    )}
                  </div>

                  <div className="clue-lines">
                    {personClues.map((c) => (
                      <span
                        key={c.id}
                        className={`clue-line ${isChecked ? 'checked-text' : ''}`}
                      >
                        {c.text}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={`card-check-btn ${isChecked ? 'done' : ''}`}
                  aria-label={`Mark ${person.name}'s clue finished`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCheckedOwner(person.id);
                  }}
                >
                  <Check size={14} strokeWidth={2.8} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verdict Ledger */}
      <AccusePanel
        puzzle={puzzle}
        placements={placements}
        readyToAccuse={readyToAccuse}
        hasRowColConflict={hasRowColConflict}
        onAccuseSuspect={onAccuseSuspect}
      />
    </aside>
  );
};
