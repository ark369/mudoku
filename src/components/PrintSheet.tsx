import React, { useMemo } from 'react';
import { OBJECT_INFO } from '../engine/themes';
import { DIFFICULTY_CONFIG, type ObjectKind, type Puzzle } from '../engine/types';
import { FurnitureSvg } from './FurnitureSvg';

interface PrintSheetProps {
  puzzle: Puzzle;
  includeKey: boolean;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({ puzzle, includeKey }) => {
  const { size, grid, rooms, people, clues } = puzzle;
  const diff = DIFFICULTY_CONFIG[puzzle.difficulty];
  const catalogRef = puzzle.caseNumber
    ? `NO. ${String(puzzle.caseNumber).padStart(2, '0')}`
    : `#${puzzle.seed}`;

  const roomLabels = useMemo(() => {
    const items: { r: number; c: number; spanRight: number; name: string }[] = [];
    for (const room of rooms) {
      if (room.cells.length === 0) continue;
      const sorted = room.cells.slice().sort((a, b) => (a.r !== b.r ? a.r - b.r : a.c - b.c));
      const { r, c } = sorted[0];
      let spanRight = 1;
      while (c + spanRight < size && grid[r][c + spanRight].roomId === room.id) {
        spanRight++;
      }
      items.push({ r, c, spanRight, name: room.name });
    }
    return items;
  }, [rooms, grid, size]);

  const usedObjects = useMemo(() => {
    const set = new Set<ObjectKind>();
    for (const row of grid) {
      for (const cell of row) {
        if (cell.occupiable) set.add(cell.occupiable);
        if (cell.blocking) set.add(cell.blocking);
      }
    }
    return Array.from(set);
  }, [grid]);

  const caseNotes = clues.filter((c) => c.ownerId === 'case');
  const killer = people.find((p) => p.id === puzzle.killerId);

  return (
    <section className="print-sheet" aria-hidden="true">
      <div className="print-header">
        <div>
          <div className="print-kicker">MURDOKU · THE SUNDAY FOLIO</div>
          <h1 className="print-title">{puzzle.title}</h1>
        </div>
        <div className="print-meta">
          {diff.label.toUpperCase()} ({size}×{size}) · {catalogRef}
        </div>
      </div>

      <p className="print-premise">{puzzle.premise}</p>

      <div className="print-main">
        <div className="print-grid-wrap">
          <div className="print-board-caption">
            <span>FLOOR PLAN</span>
            <span>N ↑ · E → · S ↓ · W ←</span>
          </div>
          <div
            className="print-grid"
            style={{
              position: 'relative',
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gridTemplateRows: `repeat(${size}, 1fr)`,
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const room = rooms[cell.roomId];
                const wallTop = r > 0 && grid[r - 1][c].roomId !== cell.roomId;
                const wallBottom = r < size - 1 && grid[r + 1][c].roomId !== cell.roomId;
                const wallLeft = c > 0 && grid[r][c - 1].roomId !== cell.roomId;
                const wallRight = c < size - 1 && grid[r][c + 1].roomId !== cell.roomId;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`print-cell ${wallTop ? 'wall-top' : ''} ${
                      wallBottom ? 'wall-bottom' : ''
                    } ${wallLeft ? 'wall-left' : ''} ${wallRight ? 'wall-right' : ''}`}
                    style={{ backgroundColor: room.bgHex }}
                  >
                    {cell.blocking && (
                      <div style={{ width: '74%', height: '74%' }}>
                        <FurnitureSvg kind={cell.blocking} />
                      </div>
                    )}
                    {cell.occupiable && (
                      <div style={{ width: '72%', height: '72%', opacity: 0.72 }}>
                        <FurnitureSvg kind={cell.occupiable} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {roomLabels.map((lbl) => (
                <span
                  key={`${lbl.r}-${lbl.c}`}
                  className="print-room-label"
                  style={{
                    top: `calc(${(lbl.r / size) * 100}% + 2px)`,
                    left: `calc(${(lbl.c / size) * 100}% + 2px)`,
                    maxWidth: `calc(${(lbl.spanRight / size) * 100}% - 4px)`,
                  }}
                >
                  {lbl.name}
                </span>
              ))}
            </div>
          </div>

          {usedObjects.length > 0 && (
            <div className="print-key-row">
              {usedObjects.map((ok) => {
                const info = OBJECT_INFO[ok];
                return (
                  <span
                    key={ok}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <span style={{ width: 15, height: 15, display: 'inline-block' }}>
                      <FurnitureSvg kind={ok} />
                    </span>
                    <span>
                      {info.label} ({info.isOccupiable ? 'on' : 'beside'})
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="print-clues-list">
          {caseNotes.length > 0 && (
            <div className="print-clue-card print-case-note">
              <div className="print-clue-head">CASE NOTES</div>
              {caseNotes.map((cn) => (
                <div key={cn.id}>{cn.text}</div>
              ))}
            </div>
          )}

          {people.map((p) => {
            const pClues = clues.filter((c) => c.ownerId === p.id);
            return (
              <div key={p.id} className="print-clue-card">
                <div className="print-clue-head">
                  <span className="print-letter-tag">[{p.letter}]</span> {p.name} —{' '}
                  <em>{p.roleTitle}</em> {p.isVictim ? '(VICTIM)' : ''}
                </div>
                {pClues.map((c) => (
                  <div key={c.id}>{c.text}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="print-rules-footer">
        <div>
          <strong>Rules:</strong> One person per row & column. <em>Beside</em> means orthogonally
          adjacent inside the same room (never across walls or diagonal). Culprit is the suspect
          alone with the victim.
        </div>
        {includeKey && (
          <div className="print-answer-key">
            Solution ({killer?.name}):{' '}
            {people
              .map(
                (p) =>
                  `${p.letter}:R${puzzle.solution[p.id].r + 1}·C${puzzle.solution[p.id].c + 1}`
              )
              .join('  ')}
          </div>
        )}
      </div>
    </section>
  );
};
