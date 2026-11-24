import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { getCuratedPuzzle, getNextCuratedCaseId } from './engine/curatedCases';
import { generatePuzzle } from './engine/generator';
import { createSeedCode, getDailySeed } from './engine/rng';
import { checkPlayerPlacements, getNextHint, type LiveHint } from './engine/solver';
import { OBJECT_INFO } from './engine/themes';
import type { Coord, Difficulty, ObjectKind, Puzzle } from './engine/types';
import { ActionDock, type InputMode } from './components/ActionDock';
import { AccusePanel } from './components/AccusePanel';
import { CrimeSceneBoard } from './components/CrimeSceneBoard';
import { HeaderBar } from './components/HeaderBar';
import { HintDrawer } from './components/HintDrawer';
import { MapKeyPopover } from './components/MapKeyPopover';
import { NewCaseModal } from './components/NewCaseModal';
import { QuickCharacterBar } from './components/QuickCharacterBar';
import { RulesModal } from './components/RulesModal';
import { SuspectPanel } from './components/SuspectPanel';
import { TrophyModal } from './components/TrophyModal';
import { VictoryModal } from './components/VictoryModal';
import { PrintSheet } from './components/PrintSheet';
import {
  playCrossSound,
  playNoteSound,
  playPlaceSound,
  playUndoSound,
  playVictorySound,
  playWarningSound,
} from './utils/sounds';
import {
  loadSavedBoard,
  loadSettings,
  loadStats,
  recordSolve,
  saveBoardState,
  saveSettings,
  type AppSettings,
  type SolvedStats,
} from './utils/storage';

interface BoardSnapshot {
  placements: Record<string, Coord>;
  crossouts: string[];
  notes: Record<string, string[]>;
}

function keyOf(r: number, c: number): string {
  return `${r},${c}`;
}

function cloneSnapshot(s: BoardSnapshot): BoardSnapshot {
  const nextNotes: Record<string, string[]> = {};
  for (const [k, arr] of Object.entries(s.notes)) {
    nextNotes[k] = arr.slice();
  }
  return {
    placements: { ...s.placements },
    crossouts: s.crossouts.slice(),
    notes: nextNotes,
  };
}

export const App: React.FC = () => {
  const initialBoard = useMemo(() => loadSavedBoard(), []);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [stats, setStats] = useState<SolvedStats>(() => loadStats());

  const [puzzle, setPuzzle] = useState<Puzzle>(() => {
    if (initialBoard) {
      if (initialBoard.curatedId) {
        const curated = getCuratedPuzzle(initialBoard.curatedId);
        if (curated) return curated;
      }
      try {
        return generatePuzzle(
          initialBoard.difficulty,
          initialBoard.seed,
          initialBoard.themeId
        );
      } catch {
        // fall through to opening hand-picked starter case
      }
    }
    return getCuratedPuzzle('starter-1') ?? generatePuzzle('starter', 'STARTER-1', 'bakery');
  });

  const [placements, setPlacements] = useState<Record<string, Coord>>(
    () => initialBoard?.placements ?? {}
  );
  const [crossouts, setCrossouts] = useState<Set<string>>(
    () => new Set(initialBoard?.crossouts ?? [])
  );
  const [notes, setNotes] = useState<Record<string, string[]>>(
    () => initialBoard?.notes ?? {}
  );
  const [checkedOwners, setCheckedOwners] = useState<Set<string>>(
    () => new Set(initialBoard?.checkedOwners ?? [])
  );

  const [undoStack, setUndoStack] = useState<BoardSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<BoardSnapshot[]>([]);

  const [mode, setMode] = useState<InputMode>('place');
  const [activePersonId, setActivePersonId] = useState<string | null>(
    () => puzzle.people[0]?.id ?? null
  );
  const [activeClueId, setActiveClueId] = useState<string | null>(null);

  const [hintsUsed, setHintsUsed] = useState<number>(() => initialBoard?.hintsUsed ?? 0);
  const [solved, setSolved] = useState<boolean>(() => initialBoard?.solved ?? false);

  const [violatedClueIds, setViolatedClueIds] = useState<Set<string>>(new Set());
  const [liveHint, setLiveHint] = useState<LiveHint | null>(null);
  const [hintStage, setHintStage] = useState<1 | 2>(1);
  const [hintStepOffset, setHintStepOffset] = useState<number>(0);

  const [isMapKeyOpen, setIsMapKeyOpen] = useState(false);
  const [legendHighlightKind, setLegendHighlightKind] = useState<ObjectKind | null>(null);
  const [dragHoverCell, setDragHoverCell] = useState<string | null>(null);
  const [isDraggingFromBoard, setIsDraggingFromBoard] = useState(false);

  const [showNewCase, setShowNewCase] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const [toast, setToast] = useState<{ msg: string; tone: 'info' | 'warn' } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((msg: string, tone: 'info' | 'warn' = 'info') => {
    setToast({ msg, tone });
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(
      () => {
        toastTimerRef.current = null;
        setToast(null);
      },
      tone === 'warn' ? 3400 : 2400
    );
  }, []);

  // Persist current board automatically
  useEffect(() => {
    saveBoardState({
      seed: puzzle.seed,
      difficulty: puzzle.difficulty,
      themeId: puzzle.themeId,
      curatedId: puzzle.curatedId,
      placements,
      crossouts: Array.from(crossouts),
      notes,
      checkedOwners: Array.from(checkedOwners),
      hintsUsed,
      solved,
    });
  }, [puzzle, placements, crossouts, notes, checkedOwners, hintsUsed, solved]);

  const currentSnapshot = useCallback((): BoardSnapshot => {
    return cloneSnapshot({
      placements,
      crossouts: Array.from(crossouts),
      notes,
    });
  }, [placements, crossouts, notes]);

  const pushUndo = useCallback(() => {
    const snap = currentSnapshot();
    setUndoStack((prev) => [...prev.slice(-49), snap]);
    setRedoStack([]);
  }, [currentSnapshot]);

  const applySnapshot = useCallback((snap: BoardSnapshot) => {
    setPlacements({ ...snap.placements });
    setCrossouts(new Set(snap.crossouts));
    const n: Record<string, string[]> = {};
    for (const [k, arr] of Object.entries(snap.notes)) n[k] = arr.slice();
    setNotes(n);
    setViolatedClueIds(new Set());
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, currentSnapshot()]);
    setUndoStack((u) => u.slice(0, -1));
    applySnapshot(prev);
    playUndoSound(settings.soundEnabled);
  }, [undoStack, currentSnapshot, applySnapshot, settings.soundEnabled]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, currentSnapshot()]);
    setRedoStack((r) => r.slice(0, -1));
    applySnapshot(next);
    playUndoSound(settings.soundEnabled);
  }, [redoStack, currentSnapshot, applySnapshot, settings.soundEnabled]);

  // Compute live row/col conflicts for visual feedback
  const rowColConflicts = useMemo(() => {
    const rowMap = new Map<number, Coord[]>();
    const colMap = new Map<number, Coord[]>();
    for (const pos of Object.values(placements)) {
      const rArr = rowMap.get(pos.r) ?? [];
      rArr.push(pos);
      rowMap.set(pos.r, rArr);
      const cArr = colMap.get(pos.c) ?? [];
      cArr.push(pos);
      colMap.set(pos.c, cArr);
    }
    const conflicts: Coord[] = [];
    for (const arr of rowMap.values()) if (arr.length > 1) conflicts.push(...arr);
    for (const arr of colMap.values()) if (arr.length > 1) conflicts.push(...arr);
    return conflicts;
  }, [placements]);

  // Check if all N characters are placed with zero row/col conflicts
  const readyToAccuse = useMemo(() => {
    return Object.keys(placements).length === puzzle.people.length && rowColConflicts.length === 0;
  }, [placements, puzzle.people.length, rowColConflicts.length]);

  const pruneNotesForPlacement = useCallback(
    (prevNotes: Record<string, string[]>, personId: string, r: number, c: number) => {
      if (!settings.autoPruneNotes) return prevNotes;
      const next: Record<string, string[]> = {};
      for (const [cellKey, list] of Object.entries(prevNotes)) {
        const [rrStr, ccStr] = cellKey.split(',');
        const rr = Number(rrStr);
        const cc = Number(ccStr);
        // Clear all pencil notes along the claimed row/column
        if (rr === r || cc === c) continue;
        // Remove the placed person from all other squares
        const filtered = list.filter((id) => id !== personId);
        if (filtered.length > 0) next[cellKey] = filtered;
      }
      return next;
    },
    [settings.autoPruneNotes]
  );

  const selectPersonAndScroll = useCallback((pid: string | null) => {
    setActivePersonId(pid);
    setActiveClueId(null);
    if (pid && typeof window !== 'undefined' && window.innerWidth > 900) {
      window.requestAnimationFrame(() => {
        const el = document.querySelector(`[data-person-card="${pid}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }, []);

  const handleCellPlaceToggle = (r: number, c: number, personId: string) => {
    pushUndo();
    setViolatedClueIds(new Set());
    setLiveHint(null);
    setHintStepOffset(0);
    const k = keyOf(r, c);
    const existingAtCell = Object.entries(placements).find(
      ([, pos]) => pos.r === r && pos.c === c
    );
    const isTogglingOff = existingAtCell?.[0] === personId;

    setPlacements((prev) => {
      const next = { ...prev };
      const curAtCell = Object.entries(prev).find(([, pos]) => pos.r === r && pos.c === c);
      if (curAtCell && curAtCell[0] === personId) {
        delete next[personId];
        return next;
      }
      if (curAtCell) {
        delete next[curAtCell[0]];
      }
      next[personId] = { r, c };
      return next;
    });

    if (!isTogglingOff) {
      setNotes((prevNotes) => pruneNotesForPlacement(prevNotes, personId, r, c));
    }

    // Clear manual crossout on that square if placing someone there
    setCrossouts((prev) => {
      if (!prev.has(k)) return prev;
      const next = new Set(prev);
      next.delete(k);
      return next;
    });

    playPlaceSound(settings.soundEnabled);
  };

  const handleDropPersonOnCell = (r: number, c: number, personId: string) => {
    const blocking = puzzle.grid[r][c].blocking;
    if (blocking !== null) {
      const info = OBJECT_INFO[blocking];
      showToast(`${info.label} — Solid obstacle (suspects can stand beside it, not on it).`, 'warn');
      return;
    }
    setMode('place');
    setActivePersonId(personId);
    setActiveClueId(null);
    const cur = placements[personId];
    if (cur && cur.r === r && cur.c === c) {
      return;
    }
    handleCellPlaceToggle(r, c, personId);
  };

  const handleRemovePersonPlacement = (personId: string) => {
    if (!placements[personId]) return;
    pushUndo();
    setViolatedClueIds(new Set());
    setLiveHint(null);
    setHintStepOffset(0);
    setPlacements((prev) => {
      if (!prev[personId]) return prev;
      const next = { ...prev };
      delete next[personId];
      return next;
    });
    setActivePersonId(personId);
    setActiveClueId(null);
    playUndoSound(settings.soundEnabled);
  };

  const handleCellNoteToggle = (r: number, c: number, personId: string) => {
    pushUndo();
    const k = keyOf(r, c);
    setNotes((prev) => {
      const cur = prev[k] ?? [];
      const nextList = cur.includes(personId)
        ? cur.filter((id) => id !== personId)
        : [...cur, personId];
      const next = { ...prev };
      if (nextList.length === 0) delete next[k];
      else next[k] = nextList;
      return next;
    });
    playNoteSound(settings.soundEnabled);
  };

  const handleCellCrossSet = (
    r: number,
    c: number,
    add: boolean,
    isStrokeStart: boolean
  ) => {
    if (isStrokeStart) pushUndo();
    const k = keyOf(r, c);
    setCrossouts((prev) => {
      const next = new Set(prev);
      if (add) next.add(k);
      else next.delete(k);
      return next;
    });
    if (isStrokeStart) playCrossSound(settings.soundEnabled);
  };

  const handleCellErase = (r: number, c: number, isStrokeStart: boolean) => {
    if (isStrokeStart) pushUndo();
    const k = keyOf(r, c);
    setPlacements((prev) => {
      const entry = Object.entries(prev).find(([, pos]) => pos.r === r && pos.c === c);
      if (!entry) return prev;
      const next = { ...prev };
      delete next[entry[0]];
      return next;
    });
    setCrossouts((prev) => {
      if (!prev.has(k)) return prev;
      const next = new Set(prev);
      next.delete(k);
      return next;
    });
    setNotes((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
    if (isStrokeStart) playUndoSound(settings.soundEnabled);
  };

  const handleCheckClues = () => {
    const res = checkPlayerPlacements(puzzle, placements);
    setViolatedClueIds(new Set(res.violatedClueIds));
    showToast(res.message, res.validSoFar ? 'info' : 'warn');
    if (!res.validSoFar) playWarningSound(settings.soundEnabled);
    else playPlaceSound(settings.soundEnabled);
  };

  const handleRequestHint = useCallback(() => {
    const hint = getNextHint(puzzle, placements, crossouts, 0);
    setLiveHint(hint);
    setHintStage(1);
    setHintStepOffset(0);
    setHintsUsed((h) => h + 1);
    if (hint.step?.targetPersonId) {
      selectPersonAndScroll(hint.step.targetPersonId);
    }
  }, [puzzle, placements, crossouts, selectPersonAndScroll]);

  const handleNextHintStep = useCallback(() => {
    const nextOffset = hintStepOffset + 1;
    const hint = getNextHint(puzzle, placements, crossouts, nextOffset);
    setLiveHint(hint);
    setHintStepOffset(hint.stepIndex);
    setHintStage(1);
    if (hint.step?.targetPersonId) {
      selectPersonAndScroll(hint.step.targetPersonId);
    }
  }, [hintStepOffset, puzzle, placements, crossouts, selectPersonAndScroll]);

  const handleApplyHintStep = () => {
    if (!liveHint?.step) return;
    const step = liveHint.step;
    pushUndo();

    if (step.placement) {
      const { personId, r, c } = step.placement;
      setPlacements((prev) => ({ ...prev, [personId]: { r, c } }));
      setNotes((prevNotes) => pruneNotesForPlacement(prevNotes, personId, r, c));
      setCrossouts((prev) => {
        const next = new Set(prev);
        next.delete(keyOf(r, c));
        return next;
      });
      playPlaceSound(settings.soundEnabled);
      setLiveHint(null);
      setHintStepOffset(0);
      return;
    }

    if (step.targetPersonId && step.survivingCells && step.survivingCells.length > 0) {
      const pid = step.targetPersonId;
      const survivingKeys = new Set(step.survivingCells.map((pos) => keyOf(pos.r, pos.c)));
      const occupiedKeys = new Set(
        Object.values(placements).map((pos) => keyOf(pos.r, pos.c))
      );

      setNotes((prevNotes) => {
        const next: Record<string, string[]> = {};
        // Keep existing notes for other characters, strip pid everywhere first
        for (const [cellKey, list] of Object.entries(prevNotes)) {
          const filtered = list.filter((id) => id !== pid);
          if (filtered.length > 0) next[cellKey] = filtered;
        }
        // Add pid's surviving candidate pencil notes
        for (const sk of survivingKeys) {
          if (occupiedKeys.has(sk)) continue;
          const existing = next[sk] ?? [];
          if (!existing.includes(pid)) {
            next[sk] = [...existing, pid];
          }
        }
        return next;
      });

      const personName = puzzle.people.find((p) => p.id === pid)?.name ?? 'suspect';
      showToast(
        `Updated pencil notes for ${personName} (${step.survivingCells.length} spot${
          step.survivingCells.length === 1 ? '' : 's'
        } left)`
      );
      playNoteSound(settings.soundEnabled);
      handleNextHintStep();
      return;
    }

    if (step.eliminations && step.eliminations.length > 0) {
      const remainingUnplaced = puzzle.people.length - Object.keys(placements).length;
      let markedCount = 0;
      setCrossouts((prev) => {
        const next = new Set(prev);
        for (const e of step.eliminations ?? []) {
          if (Object.values(placements).some((p) => p.r === e.r && p.c === e.c)) continue;
          const sameCoordCount = (step.eliminations ?? []).filter(
            (o) => o.r === e.r && o.c === e.c
          ).length;
          if (sameCoordCount >= remainingUnplaced) {
            const k = keyOf(e.r, e.c);
            if (!next.has(k)) {
              next.add(k);
              markedCount++;
            }
          }
        }
        return next;
      });
      if (markedCount > 0) {
        showToast(`Crossed out ${markedCount} impossible square${markedCount > 1 ? 's' : ''}!`);
      }
      playCrossSound(settings.soundEnabled);
      handleNextHintStep();
      return;
    }

    setLiveHint(null);
  };

  const handleAccuseSuspect = (suspectId: string) => {
    const check = checkPlayerPlacements(puzzle, placements);
    if (!check.validSoFar) {
      setViolatedClueIds(new Set(check.violatedClueIds));
      showToast(check.message, 'warn');
      playWarningSound(settings.soundEnabled);
      return;
    }

    if (suspectId !== puzzle.killerId) {
      const accused = puzzle.people.find((p) => p.id === suspectId);
      const victim = puzzle.people.find((p) => p.isVictim);
      showToast(
        `${accused?.name ?? 'That suspect'} wasn't alone with ${victim?.name ?? 'the victim'}! Double-check the room.`,
        'warn'
      );
      playWarningSound(settings.soundEnabled);
      return;
    }

    // Verified victory!
    if (!solved) {
      const nextStats = recordSolve(puzzle.difficulty, puzzle.curatedId, hintsUsed);
      setStats(nextStats);
      setSolved(true);
    }
    playVictorySound(settings.soundEnabled);
    setShowVictory(true);
  };

  const loadPuzzleClean = (nextPuzzle: Puzzle, toastText: string) => {
    setPuzzle(nextPuzzle);
    setPlacements({});
    setCrossouts(new Set());
    setNotes({});
    setCheckedOwners(new Set());
    setUndoStack([]);
    setRedoStack([]);
    setViolatedClueIds(new Set());
    setLiveHint(null);
    setHintStepOffset(0);
    setIsMapKeyOpen(false);
    setLegendHighlightKind(null);
    setHintsUsed(0);
    setSolved(false);
    setActivePersonId(nextPuzzle.people[0]?.id ?? null);
    setActiveClueId(null);
    setShowVictory(false);
    showToast(toastText);
  };

  const handleStartCuratedCase = (caseId: string) => {
    const nextPuzzle = getCuratedPuzzle(caseId);
    if (!nextPuzzle) return;
    loadPuzzleClean(
      nextPuzzle,
      `${nextPuzzle.difficulty.toUpperCase()} #${nextPuzzle.caseNumber}: ${nextPuzzle.title}`
    );
  };

  const handleStartNewCase = (difficulty: Difficulty, seed: string, themeId: string) => {
    const nextPuzzle = generatePuzzle(difficulty, seed, themeId);
    loadPuzzleClean(nextPuzzle, `New ${difficulty} random case ready: #${nextPuzzle.seed}`);
  };

  const handleResetBoard = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 3200);
      return;
    }
    setPlacements({});
    setCrossouts(new Set());
    setNotes({});
    setCheckedOwners(new Set());
    setUndoStack([]);
    setRedoStack([]);
    setViolatedClueIds(new Set());
    setLiveHint(null);
    setHintStepOffset(0);
    setHintsUsed(0);
    setSolved(false);
    setShowSettings(false);
    setConfirmReset(false);
    showToast('Board cleared — fresh start on this case!');
  };

  // Keyboard shortcuts for desktop/iPad hardware keyboards
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showNewCase || showRules || showTrophies || showVictory) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === '1') setMode('place');
      else if (k === '2') setMode('note');
      else if (k === '3') setMode('cross');
      else if (k === '4') setMode('erase');
      else {
        const matched = puzzle.people.find((p) => p.letter.toLowerCase() === k);
        if (matched) selectPersonAndScroll(matched.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    showNewCase,
    showRules,
    showTrophies,
    showVictory,
    handleUndo,
    handleRedo,
    puzzle.people,
    selectPersonAndScroll,
  ]);

  const handleCopySeed = () => {
    const text = `Murdoku Studio (${puzzle.difficulty.toUpperCase()}) • Seed: ${puzzle.seed}`;
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(puzzle.seed).catch(() => {});
    }
    showToast(`Copied seed ${puzzle.seed} — share it with family! (${text})`);
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      saveSettings(next);
      return next;
    });
  };

  const hintHighlightCells = liveHint?.step?.highlightCells ?? [];
  const hintClueIds = new Set(liveHint?.step?.involvedClueIds ?? []);
  const allPlaced = Object.keys(placements).length === puzzle.people.length;
  const hasRowColConflict = rowColConflicts.length > 0;
  const showCompactVerdict = readyToAccuse || (allPlaced && hasRowColConflict);

  const compactVerdictRef = useRef<HTMLDivElement | null>(null);
  const prevCompactVerdictRef = useRef(false);

  useEffect(() => {
    if (showCompactVerdict && !prevCompactVerdictRef.current) {
      window.requestAnimationFrame(() => {
        if (typeof window !== 'undefined' && window.innerWidth <= 900) {
          compactVerdictRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
    prevCompactVerdictRef.current = showCompactVerdict;
  }, [showCompactVerdict]);

  const toggleCheckedOwner = (ownerId: string) => {
    setCheckedOwners((prev) => {
      const next = new Set(prev);
      if (next.has(ownerId)) next.delete(ownerId);
      else next.add(ownerId);
      return next;
    });
  };

  const activePerson = activePersonId
    ? puzzle.people.find((p) => p.id === activePersonId) ?? null
    : null;
  const activePersonClues = activePerson
    ? puzzle.clues.filter((c) => c.ownerId === activePerson.id)
    : [];
  const activeCaseNote = activeClueId
    ? puzzle.clues.find((c) => c.id === activeClueId) ?? null
    : null;

  const hintDrawerNode = liveHint ? (
    <HintDrawer
      hint={liveHint}
      stage={hintStage}
      onRevealLogic={() => setHintStage(2)}
      onNextStep={handleNextHintStep}
      onApplyStep={handleApplyHintStep}
      onClose={() => {
        setLiveHint(null);
        setHintStepOffset(0);
      }}
    />
  ) : null;

  return (
    <>
      <div className="app-shell" data-venue={puzzle.themeId}>
        <HeaderBar
          puzzle={puzzle}
          totalSolved={stats.totalSolved}
          onOpenNewCase={() => setShowNewCase(true)}
          onOpenRules={() => setShowRules(true)}
          onOpenTrophies={() => setShowTrophies(true)}
          onPrint={() => window.print()}
          onToggleSettings={() => {
            setShowSettings((s) => !s);
            setConfirmReset(false);
          }}
          onCopySeed={handleCopySeed}
        />

        {showSettings && (
          <>
            <div
              className="cell-popover-backdrop"
              onClick={() => {
                setShowSettings(false);
                setConfirmReset(false);
              }}
            />
            <div className="settings-popover" role="dialog" aria-label="Settings">
              <div style={{ fontWeight: 800, marginBottom: 8, fontSize: '0.94rem' }}>
                Studio Preferences
              </div>
              <label className="setting-row">
                <span>Auto Row/Col Shading</span>
                <input
                  type="checkbox"
                  checked={settings.autoGuides}
                  onChange={(e) => updateSetting('autoGuides', e.target.checked)}
                />
              </label>
              <label className="setting-row">
                <span>Smart Clue Highlighting</span>
                <input
                  type="checkbox"
                  checked={settings.clueHighlights}
                  onChange={(e) => updateSetting('clueHighlights', e.target.checked)}
                />
              </label>
              <label className="setting-row">
                <span>Auto-Prune Notes on Place</span>
                <input
                  type="checkbox"
                  checked={settings.autoPruneNotes}
                  onChange={(e) => updateSetting('autoPruneNotes', e.target.checked)}
                />
              </label>
              <label className="setting-row">
                <span>Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                />
              </label>
              <label className="setting-row">
                <span>Include Key on Printouts</span>
                <input
                  type="checkbox"
                  checked={settings.printIncludeKey}
                  onChange={(e) => updateSetting('printIncludeKey', e.target.checked)}
                />
              </label>
              <button
                type="button"
                className="reset-board-btn"
                onClick={handleResetBoard}
              >
                {confirmReset ? 'Tap Again to Confirm Reset' : 'Reset Current Board'}
              </button>
            </div>
          </>
        )}

        <main className="workspace">
          <section className={`board-column ${showCompactVerdict ? 'has-verdict' : ''}`}>
            <div className="board-stage">
              <CrimeSceneBoard
                puzzle={puzzle}
                mode={mode}
                activePersonId={activePersonId}
                activeClueId={activeClueId}
                placements={placements}
                crossouts={crossouts}
                notes={notes}
                autoGuides={settings.autoGuides}
                clueHighlightsEnabled={settings.clueHighlights}
                rowColConflicts={rowColConflicts}
                hintHighlightCells={hintHighlightCells}
                legendHighlightKind={legendHighlightKind}
                isMapKeyOpen={isMapKeyOpen}
                onToggleMapKey={() => setIsMapKeyOpen((open) => !open)}
                readyToAccuse={readyToAccuse}
                dragHoverCell={dragHoverCell}
                onCellPlaceToggle={handleCellPlaceToggle}
                onCellNoteToggle={handleCellNoteToggle}
                onCellCrossSet={handleCellCrossSet}
                onCellErase={handleCellErase}
                onSelectPerson={selectPersonAndScroll}
                onDropPersonOnCell={handleDropPersonOnCell}
                onRemovePersonPlacement={handleRemovePersonPlacement}
                onDragHoverCellChange={setDragHoverCell}
                onBoardPawnDragChange={setIsDraggingFromBoard}
                onToast={showToast}
              />

              {isMapKeyOpen && (
                <MapKeyPopover
                  puzzle={puzzle}
                  selectedKind={legendHighlightKind}
                  onSelectKind={setLegendHighlightKind}
                  onClose={() => {
                    setIsMapKeyOpen(false);
                    setLegendHighlightKind(null);
                  }}
                />
              )}
            </div>

            <QuickCharacterBar
              people={puzzle.people}
              activePersonId={activePersonId}
              placements={placements}
              mode={mode}
              onSelectPerson={selectPersonAndScroll}
              onDropPersonOnCell={handleDropPersonOnCell}
              onDragHoverCellChange={setDragHoverCell}
              isReturnDropActive={isDraggingFromBoard}
            />

            {hintDrawerNode && <div className="mobile-hint-slot">{hintDrawerNode}</div>}

            {showCompactVerdict && (
              <div className="compact-verdict-slot" ref={compactVerdictRef}>
                <AccusePanel
                  puzzle={puzzle}
                  placements={placements}
                  readyToAccuse={readyToAccuse}
                  hasRowColConflict={hasRowColConflict}
                  onAccuseSuspect={handleAccuseSuspect}
                  compact
                />
              </div>
            )}

            {!showCompactVerdict && (
              <>
                {activePerson ? (
                  <div
                    className={`mobile-clue-bar ${
                      activePersonClues.some((c) => violatedClueIds.has(c.id)) ? 'conflict' : ''
                    } ${checkedOwners.has(activePerson.id) ? 'checked-off' : ''}`}
                    style={{ ['--person-ink' as string]: activePerson.color }}
                    aria-live="polite"
                  >
                    <span
                      className="mobile-clue-pip"
                      style={{ backgroundColor: activePerson.color }}
                      aria-hidden="true"
                    >
                      {activePerson.letter}
                    </span>
                    <div className="mobile-clue-body">
                      <div className="mobile-clue-head">
                        <span className="suspect-name">{activePerson.name}</span>
                        <span className="suspect-role">{activePerson.roleTitle}</span>
                        {activePerson.isVictim && <span className="victim-tag">Victim</span>}
                        {placements[activePerson.id] && (
                          <span className="placed-pill">
                            R{placements[activePerson.id].r + 1}·C
                            {placements[activePerson.id].c + 1}
                          </span>
                        )}
                      </div>
                      <div className="mobile-clue-lines">
                        {activePersonClues.map((c) => (
                          <span
                            key={c.id}
                            className={`clue-line ${
                              checkedOwners.has(activePerson.id) ? 'checked-text' : ''
                            }`}
                          >
                            {c.text}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`card-check-btn ${
                        checkedOwners.has(activePerson.id) ? 'done' : ''
                      }`}
                      aria-label={`Mark ${activePerson.name}'s clue finished`}
                      onClick={() => toggleCheckedOwner(activePerson.id)}
                    >
                      <Check size={14} strokeWidth={2.8} />
                    </button>
                  </div>
                ) : activeCaseNote ? (
                  <div className="mobile-clue-bar case-note" aria-live="polite">
                    <div className="mobile-clue-body">
                      <div className="mobile-clue-kicker">CASE NOTE</div>
                      <div className="mobile-clue-lines">
                        <span className="clue-line">{activeCaseNote.text}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-clue-bar empty" aria-live="polite">
                    <span>Tap any pawn above to read their clue</span>
                  </div>
                )}
              </>
            )}

            <ActionDock
              mode={mode}
              onChangeMode={setMode}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onCheckClues={handleCheckClues}
              onRequestHint={handleRequestHint}
            />
          </section>

          <SuspectPanel
            puzzle={puzzle}
            activePersonId={activePersonId}
            activeClueId={activeClueId}
            placements={placements}
            checkedOwners={checkedOwners}
            violatedClueIds={violatedClueIds}
            hintClueIds={hintClueIds}
            readyToAccuse={readyToAccuse}
            hasRowColConflict={hasRowColConflict}
            hideCompactAccuse={showCompactVerdict}
            hintSlot={hintDrawerNode}
            onSelectPerson={(pid) => {
              setActivePersonId(pid);
              setActiveClueId(null);
            }}
            onSelectCaseClue={(cid) => {
              setActiveClueId((prev) => (prev === cid ? null : cid));
              setActivePersonId(null);
            }}
            onToggleCheckedOwner={toggleCheckedOwner}
            onAccuseSuspect={handleAccuseSuspect}
          />
        </main>

        {toast && (
          <div
            className={`app-toast ${toast.tone === 'warn' ? 'is-warn' : ''}`}
            role="status"
            aria-live="polite"
            onClick={dismissToast}
          >
            <span className="app-toast-text">{toast.msg}</span>
            <button
              type="button"
              className="app-toast-close"
              onClick={(e) => {
                e.stopPropagation();
                dismissToast();
              }}
              aria-label="Dismiss message"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      <PrintSheet puzzle={puzzle} includeKey={settings.printIncludeKey} />

      {showNewCase && (
        <NewCaseModal
          currentDifficulty={puzzle.difficulty}
          currentThemeId={puzzle.themeId}
          currentCuratedId={puzzle.curatedId}
          solvedCurated={stats.solvedCurated}
          onSelectCuratedCase={handleStartCuratedCase}
          onStartCase={handleStartNewCase}
          onClose={() => setShowNewCase(false)}
        />
      )}

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      {showTrophies && (
        <TrophyModal
          stats={stats}
          onStartDaily={(d) => handleStartNewCase(d, getDailySeed(d), 'random')}
          onOpenCasebook={() => setShowNewCase(true)}
          onClose={() => setShowTrophies(false)}
        />
      )}

      {showVictory && (
        <VictoryModal
          puzzle={puzzle}
          hintsUsed={hintsUsed}
          stats={stats}
          nextCuratedNumber={
            puzzle.curatedId && getNextCuratedCaseId(puzzle.curatedId)
              ? (puzzle.caseNumber ?? 0) + 1
              : null
          }
          onNextCase={() => {
            const nextId = puzzle.curatedId ? getNextCuratedCaseId(puzzle.curatedId) : null;
            if (nextId) {
              handleStartCuratedCase(nextId);
            } else {
              handleStartNewCase(puzzle.difficulty, createSeedCode('CASE'), 'random');
            }
          }}
          onCopySeed={handleCopySeed}
          onPrint={() => window.print()}
          onClose={() => setShowVictory(false)}
        />
      )}
    </>
  );
};
export default App;
