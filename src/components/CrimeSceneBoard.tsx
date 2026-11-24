import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Compass, X } from 'lucide-react';
import { MYSTERY_THEMES, OBJECT_INFO } from '../engine/themes';
import type { BlockingKind, Clue, Coord, ObjectKind, Person, Puzzle } from '../engine/types';
import { FurnitureSvg } from './FurnitureSvg';
import type { InputMode } from './ActionDock';

interface CrimeSceneBoardProps {
  puzzle: Puzzle;
  mode: InputMode;
  activePersonId: string | null;
  activeClueId: string | null;
  placements: Record<string, Coord>;
  crossouts: Set<string>;
  notes: Record<string, string[]>;
  autoGuides: boolean;
  clueHighlightsEnabled: boolean;
  rowColConflicts: Coord[];
  hintHighlightCells: Coord[];
  legendHighlightKind?: ObjectKind | null;
  isMapKeyOpen?: boolean;
  onToggleMapKey?: () => void;
  readyToAccuse: boolean;
  dragHoverCell?: string | null;
  onCellPlaceToggle: (r: number, c: number, personId: string) => void;
  onCellNoteToggle: (r: number, c: number, personId: string) => void;
  onCellCrossSet: (r: number, c: number, add: boolean, isStrokeStart: boolean) => void;
  onCellErase: (r: number, c: number, isStrokeStart: boolean) => void;
  onSelectPerson: (personId: string | null) => void;
  onDropPersonOnCell?: (r: number, c: number, personId: string) => void;
  onRemovePersonPlacement?: (personId: string) => void;
  onDragHoverCellChange?: (cellKey: string | null) => void;
  onBoardPawnDragChange?: (dragging: boolean) => void;
  onToast: (msg: string, tone?: 'info' | 'warn') => void;
}

function keyOf(r: number, c: number): string {
  return `${r},${c}`;
}

export const CrimeSceneBoard: React.FC<CrimeSceneBoardProps> = ({
  puzzle,
  mode,
  activePersonId,
  activeClueId,
  placements,
  crossouts,
  notes,
  autoGuides,
  clueHighlightsEnabled,
  rowColConflicts,
  hintHighlightCells,
  legendHighlightKind = null,
  isMapKeyOpen = false,
  onToggleMapKey,
  readyToAccuse,
  dragHoverCell = null,
  onCellPlaceToggle,
  onCellNoteToggle,
  onCellCrossSet,
  onCellErase,
  onSelectPerson,
  onDropPersonOnCell,
  onRemovePersonPlacement,
  onDragHoverCellChange,
  onBoardPawnDragChange,
  onToast,
}) => {
  const { size, grid, rooms, people, clues, victimId } = puzzle;
  const theme = MYSTERY_THEMES.find((t) => t.id === puzzle.themeId);
  const boardWrapperRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [popover, setPopover] = useState<{
    r: number;
    c: number;
    x: number;
    y: number;
  } | null>(null);

  const [boardDrag, setBoardDrag] = useState<{
    person: Person;
    fromR: number;
    fromC: number;
    x: number;
    y: number;
  } | null>(null);
  const boardDragCleanupRef = useRef<(() => void) | null>(null);
  const boardDragSuppressedRef = useRef(false);

  const callbacksRef = useRef({
    onDropPersonOnCell,
    onRemovePersonPlacement,
    onDragHoverCellChange,
    onBoardPawnDragChange,
    onSelectPerson,
  });
  callbacksRef.current = {
    onDropPersonOnCell,
    onRemovePersonPlacement,
    onDragHoverCellChange,
    onBoardPawnDragChange,
    onSelectPerson,
  };

  useEffect(() => {
    return () => {
      boardDragCleanupRef.current?.();
      boardDragCleanupRef.current = null;
    };
  }, []);

  const strokeRef = useRef<{
    active: boolean;
    addCross: boolean;
    visited: Set<string>;
    pointerId: number;
    startX: number;
    startY: number;
    longPressTimer: number | null;
    longPressed: boolean;
  }>({
    active: false,
    addCross: true,
    visited: new Set(),
    pointerId: -1,
    startX: 0,
    startY: 0,
    longPressTimer: null,
    longPressed: false,
  });

  const personById = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);

  const placedByCell = useMemo(() => {
    const map = new Map<string, Person>();
    for (const [pid, pos] of Object.entries(placements)) {
      const p = personById.get(pid);
      if (p) map.set(keyOf(pos.r, pos.c), p);
    }
    return map;
  }, [placements, personById]);

  const { occupiedRows, occupiedCols, conflictRows, conflictCols } = useMemo(() => {
    const rCounts = new Map<number, number>();
    const cCounts = new Map<number, number>();
    Object.values(placements).forEach((pos) => {
      rCounts.set(pos.r, (rCounts.get(pos.r) ?? 0) + 1);
      cCounts.set(pos.c, (cCounts.get(pos.c) ?? 0) + 1);
    });
    const occR = new Set<number>();
    const occC = new Set<number>();
    const confR = new Set<number>();
    const confC = new Set<number>();
    rCounts.forEach((cnt, r) => {
      occR.add(r);
      if (cnt > 1) confR.add(r);
    });
    cCounts.forEach((cnt, c) => {
      occC.add(c);
      if (cnt > 1) confC.add(c);
    });
    return {
      occupiedRows: occR,
      occupiedCols: occC,
      conflictRows: confR,
      conflictCols: confC,
    };
  }, [placements]);

  const conflictKeys = useMemo(
    () => new Set(rowColConflicts.map((pos) => keyOf(pos.r, pos.c))),
    [rowColConflicts]
  );

  const hintKeys = useMemo(
    () => new Set(hintHighlightCells.map((pos) => keyOf(pos.r, pos.c))),
    [hintHighlightCells]
  );

  // Determine the top-left-most cell of each room & horizontal span for clean full-width room labels
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

  // Victim's room id when all N people are validly placed
  const victimRoomId = useMemo(() => {
    if (!readyToAccuse) return null;
    const vPos = placements[victimId];
    return vPos ? grid[vPos.r][vPos.c].roomId : null;
  }, [readyToAccuse, placements, victimId, grid]);

  // Unified editorial clue highlights: split regions (rooms/outer edge), objects, and people
  const {
    clueRegionPosKeys,
    clueRegionNegKeys,
    clueObjectPosKeys,
    clueObjectNegKeys,
    cluePersonKeys,
    roomLabelStartKeys,
  } = useMemo(() => {
    const regPosSet = new Set<string>();
    const regNegSet = new Set<string>();
    const objPosSet = new Set<string>();
    const objNegSet = new Set<string>();
    const personSet = new Set<string>();
    const labelStartSet = new Set<string>(roomLabels.map((lbl) => keyOf(lbl.r, lbl.c)));

    if (!clueHighlightsEnabled) {
      return {
        clueRegionPosKeys: regPosSet,
        clueRegionNegKeys: regNegSet,
        clueObjectPosKeys: objPosSet,
        clueObjectNegKeys: objNegSet,
        cluePersonKeys: personSet,
        roomLabelStartKeys: labelStartSet,
      };
    }

    const targetClues: Clue[] = activeClueId
      ? clues.filter((c) => c.id === activeClueId)
      : activePersonId
        ? clues.filter((c) => c.ownerId === activePersonId)
        : [];

    if (targetClues.length === 0) {
      return {
        clueRegionPosKeys: regPosSet,
        clueRegionNegKeys: regNegSet,
        clueObjectPosKeys: objPosSet,
        clueObjectNegKeys: objNegSet,
        cluePersonKeys: personSet,
        roomLabelStartKeys: labelStartSet,
      };
    }

    const posRooms = new Set<number>();
    const negRooms = new Set<number>();
    const posObjects = new Set<ObjectKind>();
    const negObjects = new Set<ObjectKind>();
    const refPersonIds = new Set<string>();
    let posEdge = false;
    let negEdge = false;

    for (const c of targetClues) {
      c.highlights.roomIds?.forEach((rid) => posRooms.add(rid));
      c.highlights.negRoomIds?.forEach((rid) => negRooms.add(rid));
      c.highlights.objectKinds?.forEach((ok) => posObjects.add(ok));
      c.highlights.negObjectKinds?.forEach((ok) => negObjects.add(ok));
      c.highlights.personIds?.forEach((pid) => {
        if (pid !== activePersonId) refPersonIds.add(pid);
      });
      if (c.highlights.outerEdge) posEdge = true;
      if (c.highlights.negOuterEdge) negEdge = true;
    }

    for (const pid of refPersonIds) {
      const pPos = placements[pid];
      if (pPos) personSet.add(keyOf(pPos.r, pPos.c));
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = grid[r][c];
        const k = keyOf(r, c);
        const onEdge = r === 0 || r === size - 1 || c === 0 || c === size - 1;

        if (posRooms.has(cell.roomId) || (posEdge && onEdge)) {
          regPosSet.add(k);
        }
        if (negRooms.has(cell.roomId) || (negEdge && onEdge)) {
          regNegSet.add(k);
        }
        if (
          (cell.occupiable && posObjects.has(cell.occupiable)) ||
          (cell.blocking && posObjects.has(cell.blocking))
        ) {
          objPosSet.add(k);
        }
        if (
          (cell.occupiable && negObjects.has(cell.occupiable)) ||
          (cell.blocking && negObjects.has(cell.blocking))
        ) {
          objNegSet.add(k);
        }
      }
    }

    return {
      clueRegionPosKeys: regPosSet,
      clueRegionNegKeys: regNegSet,
      clueObjectPosKeys: objPosSet,
      clueObjectNegKeys: objNegSet,
      cluePersonKeys: personSet,
      roomLabelStartKeys: labelStartSet,
    };
  }, [clueHighlightsEnabled, activeClueId, activePersonId, clues, size, grid, placements, roomLabels]);

  const cellFromClientPoint = (clientX: number, clientY: number): Coord | null => {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }
    const c = Math.min(size - 1, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * size)));
    const r = Math.min(size - 1, Math.max(0, Math.floor(((clientY - rect.top) / rect.height) * size)));
    return { r, c };
  };

  const openCellPopover = (r: number, c: number, clientX: number, clientY: number) => {
    const popW = 248;
    const popH = 260;
    const x = Math.min(window.innerWidth - popW - 12, Math.max(12, clientX - popW / 2));
    const y = Math.min(window.innerHeight - popH - 12, Math.max(66, clientY - 40));
    setPopover({ r, c, x, y });
  };

  const clearLongPress = () => {
    if (strokeRef.current.longPressTimer !== null) {
      window.clearTimeout(strokeRef.current.longPressTimer);
      strokeRef.current.longPressTimer = null;
    }
  };

  const handleBlockingInfo = (blocking: BlockingKind) => {
    const info = OBJECT_INFO[blocking];
    onToast(`${info.label} — Solid obstacle (suspects can stand beside it, not on it).`, 'warn');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const pos = cellFromClientPoint(e.clientX, e.clientY);
    if (!pos) return;
    const cell = grid[pos.r][pos.c];

    clearLongPress();
    boardDragCleanupRef.current?.();
    boardDragSuppressedRef.current = false;
    strokeRef.current.pointerId = e.pointerId;
    strokeRef.current.startX = e.clientX;
    strokeRef.current.startY = e.clientY;
    strokeRef.current.longPressed = false;
    strokeRef.current.visited = new Set();

    if (mode === 'cross' || mode === 'erase') {
      strokeRef.current.active = true;
      const k = keyOf(pos.r, pos.c);
      strokeRef.current.visited.add(k);
      try {
        gridRef.current?.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (mode === 'cross') {
        const add = !crossouts.has(k);
        strokeRef.current.addCross = add;
        onCellCrossSet(pos.r, pos.c, add, true);
      } else {
        onCellErase(pos.r, pos.c, true);
      }
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;

    // Place mode on an occupied cell: allow picking up & dragging the placed pawn directly
    const placedPerson = mode === 'place' ? placedByCell.get(keyOf(pos.r, pos.c)) : undefined;
    if (placedPerson && cell.blocking === null) {
      let moved = false;

      const handleDragMove = (ev: PointerEvent) => {
        const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
        if (!moved && dist > 8) {
          moved = true;
          clearLongPress();
          boardDragSuppressedRef.current = true;
          callbacksRef.current.onSelectPerson(placedPerson.id);
          callbacksRef.current.onBoardPawnDragChange?.(true);
        }
        if (moved) {
          setBoardDrag({
            person: placedPerson,
            fromR: pos.r,
            fromC: pos.c,
            x: ev.clientX,
            y: ev.clientY,
          });
          let hovered: string | null = null;
          const hitEls = document.elementsFromPoint(ev.clientX, ev.clientY);
          for (const el of hitEls) {
            const cellEl = el.closest('[data-cell]') as HTMLElement | null;
            const raw = cellEl?.getAttribute('data-cell');
            if (raw) {
              const [rStr, cStr] = raw.split('-');
              const hr = Number(rStr);
              const hc = Number(cStr);
              if (
                !Number.isNaN(hr) &&
                !Number.isNaN(hc) &&
                grid[hr]?.[hc] &&
                grid[hr][hc].blocking === null
              ) {
                hovered = keyOf(hr, hc);
              }
              break;
            }
          }
          callbacksRef.current.onDragHoverCellChange?.(hovered);
        }
      };

      const cleanupListeners = () => {
        window.removeEventListener('pointermove', handleDragMove);
        window.removeEventListener('pointerup', handleDragUp);
        window.removeEventListener('pointercancel', handleDragCancel);
        boardDragCleanupRef.current = null;
      };

      const finishBoardDrag = (ev: PointerEvent, isCancel: boolean) => {
        cleanupListeners();
        setBoardDrag(null);
        callbacksRef.current.onDragHoverCellChange?.(null);
        callbacksRef.current.onBoardPawnDragChange?.(false);

        if (moved && !isCancel) {
          let droppedOnCell = false;
          const hitEls = document.elementsFromPoint(ev.clientX, ev.clientY);
          for (const el of hitEls) {
            const cellEl = el.closest('[data-cell]') as HTMLElement | null;
            const raw = cellEl?.getAttribute('data-cell');
            if (raw) {
              droppedOnCell = true;
              const [rStr, cStr] = raw.split('-');
              const dr = Number(rStr);
              const dc = Number(cStr);
              if (!Number.isNaN(dr) && !Number.isNaN(dc) && (dr !== pos.r || dc !== pos.c)) {
                callbacksRef.current.onDropPersonOnCell?.(dr, dc, placedPerson.id);
              }
              break;
            }
          }

          if (!droppedOnCell) {
            const rect = boardWrapperRef.current?.getBoundingClientRect();
            const isOutsideBoard =
              !rect ||
              ev.clientX < rect.left ||
              ev.clientX > rect.right ||
              ev.clientY < rect.top ||
              ev.clientY > rect.bottom;
            if (isOutsideBoard) {
              callbacksRef.current.onRemovePersonPlacement?.(placedPerson.id);
            }
          }

          window.setTimeout(() => {
            boardDragSuppressedRef.current = false;
          }, 0);
        }
      };

      const handleDragUp = (ev: PointerEvent) => finishBoardDrag(ev, false);
      const handleDragCancel = (ev: PointerEvent) => finishBoardDrag(ev, true);

      window.addEventListener('pointermove', handleDragMove, { passive: true });
      window.addEventListener('pointerup', handleDragUp);
      window.addEventListener('pointercancel', handleDragCancel);
      boardDragCleanupRef.current = cleanupListeners;
    }

    // Place / Note mode: allow long-press to open Quick Cell Popover
    if (cell.blocking === null) {
      strokeRef.current.longPressTimer = window.setTimeout(() => {
        strokeRef.current.longPressed = true;
        boardDragCleanupRef.current?.();
        openCellPopover(pos.r, pos.c, startX, startY);
      }, 420);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dist = Math.hypot(
      e.clientX - strokeRef.current.startX,
      e.clientY - strokeRef.current.startY
    );
    if (dist > 10) clearLongPress();

    if (!strokeRef.current.active) return;
    const pos = cellFromClientPoint(e.clientX, e.clientY);
    if (!pos) return;

    const k = keyOf(pos.r, pos.c);
    if (strokeRef.current.visited.has(k)) return;
    strokeRef.current.visited.add(k);

    if (mode === 'cross') {
      onCellCrossSet(pos.r, pos.c, strokeRef.current.addCross, false);
    } else if (mode === 'erase') {
      onCellErase(pos.r, pos.c, false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    clearLongPress();

    if (boardDragSuppressedRef.current) {
      return;
    }

    if (strokeRef.current.active) {
      strokeRef.current.active = false;
      try {
        if (gridRef.current?.hasPointerCapture(e.pointerId)) {
          gridRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
      return;
    }

    if (strokeRef.current.longPressed) {
      strokeRef.current.longPressed = false;
      return;
    }

    const dist = Math.hypot(
      e.clientX - strokeRef.current.startX,
      e.clientY - strokeRef.current.startY
    );
    if (dist > 14) return;

    const pos = cellFromClientPoint(e.clientX, e.clientY);
    if (!pos) return;
    const cell = grid[pos.r][pos.c];
    if (cell.blocking !== null) {
      handleBlockingInfo(cell.blocking);
      return;
    }

    if (mode === 'place') {
      const existing = placedByCell.get(keyOf(pos.r, pos.c));
      if (existing) {
        if (activePersonId === existing.id) {
          onCellPlaceToggle(pos.r, pos.c, existing.id);
        } else {
          onSelectPerson(existing.id);
        }
      } else if (activePersonId) {
        onCellPlaceToggle(pos.r, pos.c, activePersonId);
      } else {
        openCellPopover(pos.r, pos.c, e.clientX, e.clientY);
      }
    } else if (mode === 'note') {
      if (activePersonId) {
        onCellNoteToggle(pos.r, pos.c, activePersonId);
      } else {
        openCellPopover(pos.r, pos.c, e.clientX, e.clientY);
      }
    }
  };

  const popoverPlacedPerson = popover
    ? placedByCell.get(keyOf(popover.r, popover.c)) ?? null
    : null;
  const popoverCellNotes = popover ? notes[keyOf(popover.r, popover.c)] ?? [] : [];

  return (
    <>
      <div className="board-wrapper" ref={boardWrapperRef}>
        <div className="board-top-strip">
          <span className="plate-caption">
            <span className="plate-num">FLOOR PLAN</span>
            <span className="plate-sep" aria-hidden="true">·</span>
            <span className="plate-meta">{theme?.name ?? 'Mystery'}</span>
          </span>
          <div className="board-top-controls">
            {onToggleMapKey && (
              <button
                type="button"
                className={`map-key-pill ${isMapKeyOpen || legendHighlightKind ? 'active' : ''}`}
                onClick={onToggleMapKey}
                aria-expanded={isMapKeyOpen}
              >
                Map Key
              </button>
            )}
            <span className="compass-rose" title="North is toward the top of the map">
              <Compass size={12} /> N↑ · E→ · S↓ · W←
            </span>
          </div>
        </div>

        <div className="grid-with-coords">
          <div
            className="col-coords"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            aria-hidden="true"
          >
            {Array.from({ length: size }, (_, c) => {
              const cls = conflictCols.has(c)
                ? 'coord-conflict'
                : autoGuides && occupiedCols.has(c)
                  ? 'coord-occupied'
                  : '';
              return (
                <span key={c} className={cls}>
                  {c + 1}
                </span>
              );
            })}
          </div>

          <div
            className="row-coords"
            style={{ gridTemplateRows: `repeat(${size}, 1fr)` }}
            aria-hidden="true"
          >
            {Array.from({ length: size }, (_, r) => {
              const cls = conflictRows.has(r)
                ? 'coord-conflict'
                : autoGuides && occupiedRows.has(r)
                  ? 'coord-occupied'
                  : '';
              return (
                <span key={r} className={cls}>
                  {r + 1}
                </span>
              );
            })}
          </div>

          <div
            ref={gridRef}
            className={`crime-grid ${
              mode === 'place'
                ? 'place-mode'
                : mode === 'cross'
                  ? 'cross-mode'
                  : mode === 'erase'
                    ? 'erase-mode'
                    : ''
            }`}
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gridTemplateRows: `repeat(${size}, 1fr)`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              clearLongPress();
              strokeRef.current.active = false;
            }}
            onContextMenu={(e) => e.preventDefault()}
            role="grid"
            aria-label={`${size} by ${size} crime scene grid`}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const room = rooms[cell.roomId];
                const k = keyOf(r, c);
                const placed = placedByCell.get(k);
                const isCrossed = crossouts.has(k);
                const cellNotes = notes[k] ?? [];
                const draggingPersonId = boardDrag?.person.id ?? activePersonId;

                const wallTop = r > 0 && grid[r - 1][c].roomId !== cell.roomId;
                const wallBottom = r < size - 1 && grid[r + 1][c].roomId !== cell.roomId;
                const wallLeft = c > 0 && grid[r][c - 1].roomId !== cell.roomId;
                const wallRight = c < size - 1 && grid[r][c + 1].roomId !== cell.roomId;

                const rowConf = conflictRows.has(r);
                const colConf = conflictCols.has(c);
                const rowOcc = autoGuides && occupiedRows.has(r);
                const colOcc = autoGuides && occupiedCols.has(c);
                const showGuide = !placed && cell.blocking === null && (rowConf || colConf || rowOcc || colOcc);

                const isHover = dragHoverCell === k && cell.blocking === null;
                const isHoverConflict =
                  isHover &&
                  Object.entries(placements).some(
                    ([pid, pos]) =>
                      pid !== draggingPersonId &&
                      !(pos.r === r && pos.c === c) &&
                      (pos.r === r || pos.c === c)
                  );

                const inRegPos = clueRegionPosKeys.has(k);
                const regPosEdges = inRegPos
                  ? [
                      r === 0 || !clueRegionPosKeys.has(keyOf(r - 1, c)) ? 'edge-t' : '',
                      r === size - 1 || !clueRegionPosKeys.has(keyOf(r + 1, c)) ? 'edge-b' : '',
                      c === 0 || !clueRegionPosKeys.has(keyOf(r, c - 1)) ? 'edge-l' : '',
                      c === size - 1 || !clueRegionPosKeys.has(keyOf(r, c + 1)) ? 'edge-r' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  : '';

                const inRegNeg = clueRegionNegKeys.has(k);
                const regNegEdges = inRegNeg
                  ? [
                      r === 0 || !clueRegionNegKeys.has(keyOf(r - 1, c)) ? 'edge-t' : '',
                      r === size - 1 || !clueRegionNegKeys.has(keyOf(r + 1, c)) ? 'edge-b' : '',
                      c === 0 || !clueRegionNegKeys.has(keyOf(r, c - 1)) ? 'edge-l' : '',
                      c === size - 1 || !clueRegionNegKeys.has(keyOf(r, c + 1)) ? 'edge-r' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  : '';

                const isLegendMatch =
                  legendHighlightKind !== null &&
                  (cell.occupiable === legendHighlightKind || cell.blocking === legendHighlightKind);

                const classes = [
                  'grid-cell',
                  `pattern-${room.pattern}`,
                  wallTop ? 'wall-top' : '',
                  wallBottom ? 'wall-bottom' : '',
                  wallLeft ? 'wall-left' : '',
                  wallRight ? 'wall-right' : '',
                  cell.blocking !== null ? 'is-blocking' : '',
                  placed ? 'has-pawn' : '',
                  isHover ? (isHoverConflict ? 'drag-hover-conflict' : 'drag-hover') : '',
                  roomLabelStartKeys.has(k) ? 'has-room-label' : '',
                  cluePersonKeys.has(k) ? 'clue-person-ref' : '',
                  isLegendMatch ? 'legend-glow' : '',
                  hintKeys.has(k) ? 'hint-highlight' : '',
                  conflictKeys.has(k) ? 'rowcol-conflict' : '',
                  victimRoomId === cell.roomId ? 'victim-room-glow' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={k}
                    className={classes}
                    style={{ backgroundColor: room.bgHex }}
                    data-cell={`${r}-${c}`}
                    role="gridcell"
                    aria-label={`Row ${r + 1} Column ${c + 1}, ${room.name}${
                      placed ? `, ${placed.name}` : ''
                    }${cell.blocking !== null ? ', solid obstacle' : ''}`}
                  >
                    {cell.blocking !== null && (
                      <div className="cell-blocking-hatch" aria-hidden="true" />
                    )}

                    {showGuide && (
                      <div
                        className={`cell-rowcol-guide ${rowOcc || rowConf ? 'guide-row' : ''} ${
                          colOcc || colConf ? 'guide-col' : ''
                        } ${rowConf ? 'guide-row-conflict' : ''} ${
                          colConf ? 'guide-col-conflict' : ''
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    {inRegPos && (
                      <div
                        className={`cell-clue-region pos ${regPosEdges}`}
                        aria-hidden="true"
                      />
                    )}

                    {inRegNeg && (
                      <div
                        className={`cell-clue-region neg ${regNegEdges}`}
                        aria-hidden="true"
                      />
                    )}

                    {clueObjectPosKeys.has(k) && (
                      <div className="cell-clue-brackets pos" aria-hidden="true" />
                    )}

                    {clueObjectNegKeys.has(k) && (
                      <div className="cell-clue-brackets neg" aria-hidden="true" />
                    )}

                    {cell.blocking && (
                      <div className="cell-furniture blocking">
                        <FurnitureSvg kind={cell.blocking} />
                      </div>
                    )}

                    {cell.occupiable && (
                      <div className="cell-furniture occupiable">
                        <FurnitureSvg kind={cell.occupiable} />
                      </div>
                    )}

                    {isCrossed && !placed && (
                      <div className="cell-crossout" aria-hidden="true">
                        <svg viewBox="0 0 40 40" className="pencil-cross-svg">
                          <path
                            d="M8.5 9.5 C15 16.2, 24.5 24.8, 31.5 31"
                            stroke="var(--ink-slate)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M31 8.8 C23.8 15.5, 16.5 23.8, 8.8 31.2"
                            stroke="var(--ink-slate)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M11 8.2 L32 28.5"
                            stroke="var(--ink-slate)"
                            strokeWidth="1.0"
                            strokeLinecap="round"
                            opacity="0.45"
                            fill="none"
                          />
                        </svg>
                      </div>
                    )}

                    {!placed && !isCrossed && cellNotes.length > 0 && (
                      <div className="notes-mini-grid" aria-hidden="true">
                        {people.slice(0, 9).map((p) => {
                          const hasNote = cellNotes.includes(p.id);
                          const isActiveNote = hasNote && activePersonId === p.id;
                          const isDimmedNote =
                            hasNote && activePersonId !== null && activePersonId !== p.id;
                          return (
                            <span
                              key={p.id}
                              className={`note-chip${isActiveNote ? ' is-active' : ''}${
                                isDimmedNote ? ' is-dimmed' : ''
                              }`}
                              style={
                                hasNote
                                  ? ({ '--note-color': p.color } as React.CSSProperties)
                                  : undefined
                              }
                            >
                              {hasNote ? <span className="note-chip-glyph">{p.letter}</span> : ''}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {placed && (
                      <div
                        className={`placed-token ${placed.isVictim ? 'victim' : ''} ${
                          boardDrag?.person.id === placed.id ? 'dragging-source' : ''
                        }`}
                        style={{ backgroundColor: placed.color }}
                      >
                        <span className="placed-token-ring" aria-hidden="true" />
                        <span className="placed-token-letter">{placed.letter}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div className="room-labels-layer" aria-hidden="true">
              {roomLabels.map((lbl) => (
                <span
                  key={`${lbl.r}-${lbl.c}`}
                  className="room-label"
                  style={{
                    top: `calc(${(lbl.r / size) * 100}% + 3px)`,
                    left: `calc(${(lbl.c / size) * 100}% + 3px)`,
                    maxWidth: `calc(${(lbl.spanRight / size) * 100}% - 6px)`,
                  }}
                >
                  {lbl.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Cell Popover (for long-press or tapping with no active suspect) */}
      {popover && (
        <>
          <div className="cell-popover-backdrop" onClick={() => setPopover(null)} />
          <div
            className="cell-popover"
            style={{ left: popover.x, top: popover.y }}
            role="dialog"
            aria-label={`Cell R${popover.r + 1}C${popover.c + 1} quick actions`}
          >
            <div className="cell-popover-title">
              <span>
                Row {popover.r + 1}, Col {popover.c + 1} •{' '}
                {rooms[grid[popover.r][popover.c].roomId].name}
              </span>
              <button
                type="button"
                onClick={() => setPopover(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  color: 'var(--ink-secondary)',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="cell-popover-grid">
              {people.map((p) => {
                const isHere = popoverPlacedPerson?.id === p.id;
                const isNoted = popoverCellNotes.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`popover-person-btn ${isHere || isNoted ? 'active' : ''}`}
                    onClick={() => {
                      if (mode === 'note') {
                        onCellNoteToggle(popover.r, popover.c, p.id);
                      } else {
                        onSelectPerson(p.id);
                        onCellPlaceToggle(popover.r, popover.c, p.id);
                        setPopover(null);
                      }
                    }}
                  >
                    <span className="popover-person-dot" style={{ backgroundColor: p.color }}>
                      {p.letter}
                    </span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="popover-actions-row">
              <button
                type="button"
                className="popover-action-btn"
                onClick={() => {
                  const k = keyOf(popover.r, popover.c);
                  onCellCrossSet(popover.r, popover.c, !crossouts.has(k), true);
                  setPopover(null);
                }}
              >
                {crossouts.has(keyOf(popover.r, popover.c)) ? 'Remove ✕' : 'Cross Out ✕'}
              </button>
              <button
                type="button"
                className="popover-action-btn"
                onClick={() => {
                  onCellErase(popover.r, popover.c, true);
                  setPopover(null);
                }}
              >
                Clear Cell
              </button>
            </div>
          </div>
        </>
      )}

      {boardDrag &&
        createPortal(
          <div
            className="drag-pawn-ghost"
            style={{
              left: boardDrag.x,
              top: boardDrag.y,
              backgroundColor: boardDrag.person.color,
            }}
            aria-hidden="true"
          >
            <span className="tray-pawn-ring" />
            <span className="tray-pawn-letter">{boardDrag.person.letter}</span>
          </div>,
          document.body
        )}
    </>
  );
};
