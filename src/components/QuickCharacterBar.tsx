import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Coord, Person } from '../engine/types';
import type { InputMode } from './ActionDock';

interface QuickCharacterBarProps {
  people: Person[];
  activePersonId: string | null;
  placements: Record<string, Coord>;
  mode: InputMode;
  onSelectPerson: (personId: string | null) => void;
  onDropPersonOnCell?: (r: number, c: number, personId: string) => void;
  onDragHoverCellChange?: (cellKey: string | null) => void;
  isReturnDropActive?: boolean;
}

interface DragState {
  person: Person;
  x: number;
  y: number;
}

export const QuickCharacterBar: React.FC<QuickCharacterBarProps> = ({
  people,
  activePersonId,
  placements,
  mode,
  onSelectPerson,
  onDropPersonOnCell,
  onDragHoverCellChange,
  isReturnDropActive = false,
}) => {
  const activePerson = people.find((p) => p.id === activePersonId) ?? null;
  const [dragState, setDragState] = useState<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const cleanupListenersRef = useRef<(() => void) | null>(null);
  const callbacksRef = useRef({ onDropPersonOnCell, onDragHoverCellChange });
  callbacksRef.current = { onDropPersonOnCell, onDragHoverCellChange };

  useEffect(() => {
    return () => {
      cleanupListenersRef.current?.();
      cleanupListenersRef.current = null;
    };
  }, []);

  let statusText = '';
  if (isReturnDropActive) {
    statusText = 'Drop on a new square to move, or onto the tray to return pawn';
  } else if (mode === 'cross') {
    statusText = 'Cross Out — tap or swipe across squares with graphite';
  } else if (mode === 'erase') {
    statusText = 'Eraser — tap or swipe to clear marks';
  } else if (mode === 'note') {
    statusText = activePerson
      ? `Margin Note for ${activePerson.name} (${activePerson.letter}) — tap squares to toggle`
      : 'Margin Notes — select a pawn or tap any square';
  } else if (activePerson && placements[activePerson.id]) {
    statusText = `Moving ${activePerson.name} (${activePerson.letter}) — drag on map, tap a new square, or tap pawn to return`;
  } else {
    statusText = activePerson
      ? `Placing ${activePerson.name} (${activePerson.letter}) — tap or drag onto a square`
      : 'Tap a pawn or drag from the tray onto the floor plan';
  }

  const handleSlotPointerDown = (e: React.PointerEvent<HTMLButtonElement>, person: Person) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    // Empty sockets cannot be dragged; tapping them selects/highlights the placed pawn
    if (placements[person.id]) return;

    cleanupListenersRef.current?.();

    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;

    const findCellAt = (clientX: number, clientY: number): { r: number; c: number; key: string } | null => {
      const hitEls = document.elementsFromPoint(clientX, clientY);
      for (const el of hitEls) {
        const cellEl = el.closest('[data-cell]') as HTMLElement | null;
        const raw = cellEl?.getAttribute('data-cell');
        if (raw) {
          const [rStr, cStr] = raw.split('-');
          const r = Number(rStr);
          const c = Number(cStr);
          if (!Number.isNaN(r) && !Number.isNaN(c)) {
            return { r, c, key: `${r},${c}` };
          }
          break;
        }
      }
      return null;
    };

    const handleMove = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
      if (!moved && dist > 8) {
        moved = true;
        suppressClickRef.current = true;
      }
      if (moved) {
        setDragState({ person, x: ev.clientX, y: ev.clientY });
        const hit = findCellAt(ev.clientX, ev.clientY);
        callbacksRef.current.onDragHoverCellChange?.(hit ? hit.key : null);
      }
    };

    const finishDrag = (ev: PointerEvent, isCancel: boolean) => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
      cleanupListenersRef.current = null;
      callbacksRef.current.onDragHoverCellChange?.(null);

      if (moved) {
        if (!isCancel && callbacksRef.current.onDropPersonOnCell) {
          const hit = findCellAt(ev.clientX, ev.clientY);
          if (hit) {
            callbacksRef.current.onDropPersonOnCell(hit.r, hit.c, person.id);
          }
        }
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      setDragState(null);
    };

    const handleUp = (ev: PointerEvent) => finishDrag(ev, false);
    const handleCancel = (ev: PointerEvent) => finishDrag(ev, true);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleCancel);
    cleanupListenersRef.current = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
    };
  };

  return (
    <div className="token-tray-wrap">
      <div
        className={`token-tray ${isReturnDropActive ? 'return-drop-active' : ''}`}
        style={{ ['--token-count' as string]: people.length }}
        role="listbox"
        aria-label="Suspect token tray"
      >
        {people.map((person) => {
          const isSelected = activePersonId === person.id;
          const placedPos = placements[person.id];
          const isPlaced = Boolean(placedPos);
          const isDraggingThis = dragState?.person.id === person.id;

          return (
            <button
              key={person.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`token-slot ${isSelected ? 'active' : ''} ${
                isPlaced ? 'placed' : ''
              } ${person.isVictim ? 'victim' : ''} ${isDraggingThis ? 'dragging-source' : ''}`}
              onPointerDown={(e) => handleSlotPointerDown(e, person)}
              onClick={() => {
                if (suppressClickRef.current) {
                  suppressClickRef.current = false;
                  return;
                }
                onSelectPerson(isSelected ? null : person.id);
              }}
              title={`${person.name}${
                placedPos ? ` (Placed R${placedPos.r + 1}·C${placedPos.c + 1})` : ''
              }`}
            >
              <span
                className={`token-socket ${isPlaced ? 'empty' : 'filled'} ${
                  isSelected ? 'active' : ''
                }`}
              >
                {!isPlaced ? (
                  <span className="tray-pawn" style={{ backgroundColor: person.color }}>
                    <span className="tray-pawn-ring" aria-hidden="true" />
                    <span className="tray-pawn-letter">{person.letter}</span>
                  </span>
                ) : (
                  <span className="socket-ghost" aria-hidden="true">
                    {person.letter}
                  </span>
                )}
              </span>

              <span className="token-slot-name">{person.name}</span>
              <span className="token-slot-meta">
                {placedPos
                  ? `R${placedPos.r + 1}·C${placedPos.c + 1}`
                  : person.isVictim
                    ? 'VICTIM'
                    : '\u00A0'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="tool-status-line" aria-live="polite">
        {statusText}
      </div>

      {dragState &&
        createPortal(
          <div
            className="drag-pawn-ghost"
            style={{
              left: dragState.x,
              top: dragState.y,
              backgroundColor: dragState.person.color,
            }}
            aria-hidden="true"
          >
            <span className="tray-pawn-ring" />
            <span className="tray-pawn-letter">{dragState.person.letter}</span>
          </div>,
          document.body
        )}
    </div>
  );
};
