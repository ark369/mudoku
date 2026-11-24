import React from 'react';
import { AlertTriangle, Gavel } from 'lucide-react';
import type { Coord, Puzzle } from '../engine/types';

interface AccusePanelProps {
  puzzle: Puzzle;
  placements: Record<string, Coord>;
  readyToAccuse: boolean;
  hasRowColConflict?: boolean;
  assisted?: boolean;
  onAccuseSuspect: (suspectId: string) => void;
  compact?: boolean;
}

export const AccusePanel: React.FC<AccusePanelProps> = ({
  puzzle,
  placements,
  readyToAccuse,
  hasRowColConflict = false,
  assisted = false,
  onAccuseSuspect,
  compact = false,
}) => {
  const placedCount = Object.keys(placements).length;
  const totalCount = puzzle.people.length;

  const victimPos = placements[puzzle.victimId];
  const victimRoomId = victimPos ? puzzle.grid[victimPos.r][victimPos.c].roomId : null;
  const suspects = puzzle.people.filter((p) => !p.isVictim);
  const roommatesWithVictim = new Set<string>();
  if (victimRoomId !== null) {
    for (const s of suspects) {
      const sPos = placements[s.id];
      if (sPos && puzzle.grid[sPos.r][sPos.c].roomId === victimRoomId) {
        roommatesWithVictim.add(s.id);
      }
    }
  }

  const isConflictBlock = !readyToAccuse && placedCount === totalCount && hasRowColConflict;
  const victimName = puzzle.people.find((p) => p.isVictim)?.name;

  return (
    <div
      className={`accuse-panel ${readyToAccuse ? 'ready' : ''} ${
        isConflictBlock ? 'conflict-warning' : ''
      } ${compact ? 'compact' : ''}`}
      role={compact ? 'region' : undefined}
      aria-label={compact ? 'Accuse the Culprit' : undefined}
    >
      <div className="accuse-header">
        <span className="accuse-title">
          {isConflictBlock ? (
            <>
              <AlertTriangle size={15} color="var(--ink-crimson)" /> Row / Column Conflict
            </>
          ) : (
            <>
              <Gavel size={15} /> Accuse the Culprit
            </>
          )}
        </span>
        <div className="accuse-progress-group">
          <span className="verdict-pips" aria-hidden="true">
            {puzzle.people.map((p) => {
              const isPlaced = Boolean(placements[p.id]);
              return (
                <span
                  key={p.id}
                  className={`verdict-pip ${isPlaced ? 'filled' : ''}`}
                  style={isPlaced ? { backgroundColor: p.color } : undefined}
                />
              );
            })}
          </span>
          <span className="accuse-progress">
            {placedCount} / {totalCount} Placed
          </span>
        </div>
      </div>

      {readyToAccuse ? (
        <>
          <p className="accuse-sub">
            {compact ? (
              <>
                Who was alone in{' '}
                <strong>
                  {victimRoomId !== null ? puzzle.rooms[victimRoomId].name : 'the room'}
                </strong>{' '}
                with {victimName}?
              </>
            ) : (
              <>
                Everyone is placed! Select the suspect alone in the{' '}
                <strong>
                  {victimRoomId !== null ? puzzle.rooms[victimRoomId].name : 'room'}
                </strong>{' '}
                with the victim:
              </>
            )}
          </p>
          <div className="accuse-suspects-row">
            {suspects.map((s) => {
              const isRoommate = assisted && roommatesWithVictim.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`accuse-chip-btn ${isRoommate ? 'candidate' : ''}`}
                  onClick={() => onAccuseSuspect(s.id)}
                >
                  <span className="accuse-chip-dot" style={{ backgroundColor: s.color }}>
                    {s.letter}
                  </span>
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : isConflictBlock ? (
        <p className="accuse-sub">
          {compact
            ? 'Two characters share a row or column (outlined in red). Move one to accuse.'
            : `All ${totalCount} characters are placed, but two share a row or column (outlined in red). Move a pawn to accuse the culprit.`}
        </p>
      ) : (
        <p className="accuse-sub">
          Place all {totalCount} characters on the floor plan cleanly — then stamp the suspect left
          alone with {victimName}.
        </p>
      )}
    </div>
  );
};
