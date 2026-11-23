import { describe, expect, it } from 'vitest';
import { generatePuzzle } from '../generator';
import {
  computeClueHighlights,
  evaluateClueOnAssignment,
  isBesideCell,
  isDiagonalSameRoom,
  isDirectlyDirOf,
  isDirFromPerson,
} from '../predicates';
import { countSolutions, getNextHint, solveDeductively } from '../solver';
import { MYSTERY_THEMES } from '../themes';
import type { Cell, Clue, Difficulty } from '../types';

function makeMiniGrid(): Cell[][] {
  // 3x3 grid: room 0 on cols 0..1, room 1 on col 2
  const roomIds = [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ];
  return roomIds.map((row, r) =>
    row.map((roomId, c) => ({
      r,
      c,
      roomId,
      occupiable: null,
      blocking: null,
    }))
  );
}

describe('Murdoku Spatial Predicates', () => {
  it('enforces beside as strictly orthogonal AND same-room', () => {
    const grid = makeMiniGrid();
    // Same room orthogonal
    expect(isBesideCell({ r: 0, c: 0 }, { r: 0, c: 1 }, grid)).toBe(true);
    expect(isBesideCell({ r: 0, c: 0 }, { r: 1, c: 0 }, grid)).toBe(true);
    // Diagonal in same room -> false
    expect(isBesideCell({ r: 0, c: 0 }, { r: 1, c: 1 }, grid)).toBe(false);
    // Orthogonal across room wall -> false!
    expect(isBesideCell({ r: 0, c: 1 }, { r: 0, c: 2 }, grid)).toBe(false);
    // Distance 2 -> false
    expect(isBesideCell({ r: 0, c: 0 }, { r: 2, c: 0 }, grid)).toBe(false);
  });

  it('enforces directly dir of object inside same room', () => {
    const grid = makeMiniGrid();
    const obj = { r: 1, c: 1 };
    expect(isDirectlyDirOf({ r: 0, c: 1 }, obj, 'north', grid)).toBe(true);
    expect(isDirectlyDirOf({ r: 2, c: 1 }, obj, 'south', grid)).toBe(true);
    expect(isDirectlyDirOf({ r: 1, c: 0 }, obj, 'west', grid)).toBe(true);
    // Across wall on east -> false
    expect(isDirectlyDirOf({ r: 1, c: 2 }, obj, 'east', grid)).toBe(false);
    // Diagonal -> false
    expect(isDirectlyDirOf({ r: 0, c: 0 }, obj, 'north', grid)).toBe(false);
  });

  it('evaluates global direction, diagonal same-room, and exclusivity rules', () => {
    const grid = makeMiniGrid();
    grid[0][0].occupiable = 'chair';
    grid[1][1].occupiable = 'chair';
    grid[0][1].blocking = 'plant';

    expect(isDirFromPerson({ r: 0, c: 2 }, { r: 2, c: 0 }, 'north')).toBe(true);
    expect(isDirFromPerson({ r: 0, c: 2 }, { r: 2, c: 0 }, 'east')).toBe(true);
    expect(isDiagonalSameRoom({ r: 0, c: 0 }, { r: 1, c: 1 }, grid)).toBe(true);
    // Across wall diagonal -> false
    expect(isDiagonalSameRoom({ r: 0, c: 1 }, { r: 1, c: 2 }, grid)).toBe(false);

    const assignment = {
      A: { r: 0, c: 0 },
      B: { r: 1, c: 2 },
      V: { r: 2, c: 1 },
    };

    const onlyChair: Clue = {
      id: 'c1',
      ownerId: 'A',
      tier: 1,
      kind: 'only_on_object',
      personId: 'A',
      objectKind: 'chair',
      text: '',
      highlights: {},
    };
    expect(evaluateClueOnAssignment(onlyChair, assignment, grid)).toBe(true);

    const victimRule: Clue = {
      id: 'c2',
      ownerId: 'V',
      tier: 1,
      kind: 'victim_alone_with_killer',
      victimId: 'V',
      text: '',
      highlights: {},
    };
    // Room 0 holds A and V (2 people), Room 1 holds B (1 person)
    expect(evaluateClueOnAssignment(victimRule, assignment, grid)).toBe(true);

    // If B moves into Room 0 (impossible here without sharing col, let's test invalid room count)
    const badAssignment = {
      A: { r: 0, c: 0 },
      B: { r: 1, c: 1 },
      V: { r: 2, c: 0 },
    };
    expect(evaluateClueOnAssignment(victimRule, badAssignment, grid)).toBe(false);
  });

  it('routes negative clues to neg* highlight fields and keeps stories paired', () => {
    const grid = makeMiniGrid();
    const notRoom = computeClueHighlights(
      { id: 'n1', ownerId: 'A', tier: 1, kind: 'not_in_room', personId: 'A', roomId: 1 },
      grid
    );
    expect(notRoom.negRoomIds).toEqual([1]);
    expect(notRoom.roomIds).toBeUndefined();

    const notObj = computeClueHighlights(
      { id: 'n2', ownerId: 'A', tier: 1, kind: 'not_beside_object', personId: 'A', objectKind: 'chair' },
      grid
    );
    expect(notObj.negObjectKinds).toEqual(['chair']);
    expect(notObj.objectKinds).toBeUndefined();

    const notEdge = computeClueHighlights(
      { id: 'n3', ownerId: 'A', tier: 1, kind: 'not_outer_edge', personId: 'A' },
      grid
    );
    expect(notEdge.negOuterEdge).toBe(true);
    expect(notEdge.outerEdge).toBeUndefined();

    for (const theme of MYSTERY_THEMES) {
      expect(theme.stories.length).toBeGreaterThanOrEqual(3);
      for (const s of theme.stories) {
        expect(s.title.length).toBeGreaterThan(3);
        expect(s.premise.length).toBeGreaterThan(20);
        expect(s.stolenItem.length).toBeGreaterThan(3);
      }
    }
  });

  it('populates survivingCells on elimination hints and advances via stepOffset', () => {
    const puzzle = generatePuzzle('hard', 'HINT-CHECK-42');
    const h0 = getNextHint(puzzle, {}, undefined, 0);
    expect(h0.hasConflict).toBe(false);
    expect(h0.step).not.toBeNull();
    expect(h0.totalSteps).toBeGreaterThan(1);
    expect(h0.stepIndex).toBe(0);

    const elimStep = Array.from({ length: h0.totalSteps }, (_, idx) =>
      getNextHint(puzzle, {}, undefined, idx)
    ).find((h) => h.step && h.step.targetPersonId && !h.step.placement);

    if (elimStep?.step) {
      expect(elimStep.step.survivingCells?.length).toBeGreaterThanOrEqual(1);
      const pid = elimStep.step.targetPersonId!;
      const truth = puzzle.solution[pid];
      expect(
        elimStep.step.survivingCells!.some((c) => c.r === truth.r && c.c === truth.c)
      ).toBe(true);
    }

    const h1 = getNextHint(puzzle, {}, undefined, 1);
    expect(h1.stepIndex).toBe(1);
  });
});

describe('Procedural Murdoku Generator', () => {
  it('generates identical puzzles deterministically from the same seed', () => {
    const p1 = generatePuzzle('medium', 'FAMILY-2026', 'bakery');
    const p2 = generatePuzzle('medium', 'FAMILY-2026', 'bakery');
    expect(p1).toEqual(p2);
  });

  const difficulties: Difficulty[] = ['starter', 'easy', 'medium', 'hard', 'expert'];

  it.each(difficulties)(
    'generates 10 uniquely & deductively solvable %s puzzles with valid victim/killer room',
    (difficulty) => {
      const startTime = Date.now();
      let level1Sum = 0;
      let maxLevelSeen = 1;
      let singlesSum = 0;
      let stepsSum = 0;

      for (let i = 0; i < 10; i++) {
        const seed = `TEST-${difficulty.toUpperCase()}-${i + 101}`;
        const puzzle = generatePuzzle(difficulty, seed);

        // 1. Check 1 person per row & 1 per col & walkable cells
        const usedRows = new Set<number>();
        const usedCols = new Set<number>();
        const roomCounts = new Map<number, string[]>();

        for (const person of puzzle.people) {
          const pos = puzzle.solution[person.id];
          expect(pos).toBeDefined();
          expect(puzzle.grid[pos.r][pos.c].blocking).toBeNull();
          expect(usedRows.has(pos.r)).toBe(false);
          expect(usedCols.has(pos.c)).toBe(false);
          usedRows.add(pos.r);
          usedCols.add(pos.c);

          const rid = puzzle.grid[pos.r][pos.c].roomId;
          const list = roomCounts.get(rid) ?? [];
          list.push(person.id);
          roomCounts.set(rid, list);
        }
        expect(usedRows.size).toBe(puzzle.size);
        expect(usedCols.size).toBe(puzzle.size);

        // 2. Victim's room must contain exactly Victim and Killer
        const vPos = puzzle.solution[puzzle.victimId];
        const vRoomId = puzzle.grid[vPos.r][vPos.c].roomId;
        const vOccupants = roomCounts.get(vRoomId) ?? [];
        expect(vOccupants.length).toBe(2);
        expect(vOccupants).toContain(puzzle.victimId);
        expect(vOccupants).toContain(puzzle.killerId);

        // 3. Every clue evaluates to true on puzzle.solution & stays diverse
        const kindCounts = new Map<string, number>();
        for (const clue of puzzle.clues) {
          expect(
            evaluateClueOnAssignment(clue, puzzle.solution, puzzle.grid),
            `Clue ${clue.id} (${clue.text}) failed on solution for ${seed}`
          ).toBe(true);
          kindCounts.set(clue.kind, (kindCounts.get(clue.kind) ?? 0) + 1);
        }
        expect(puzzle.stolenItem.length).toBeGreaterThan(3);
        const nonDirMax = Math.max(
          0,
          ...Array.from(kindCounts.entries())
            .filter(([k]) => k !== 'dir_from_person')
            .map(([, v]) => v)
        );
        expect(nonDirMax, `Too many repeated clue kinds on ${seed}`).toBeLessThanOrEqual(
          difficulty === 'expert' ? 4 : 3
        );

        // 4. Authoritative backtracking confirms unique solution === puzzle.solution
        const uniq = countSolutions(
          puzzle.grid,
          puzzle.rooms,
          puzzle.people,
          puzzle.victimId,
          puzzle.clues,
          2
        );
        expect(uniq.count, `Non-unique puzzle on ${seed}`).toBe(1);
        expect(uniq.firstSolution).toEqual(puzzle.solution);

        // 5. Deductive solver solves it without guessing
        const ded = solveDeductively(
          puzzle.grid,
          puzzle.rooms,
          puzzle.people,
          puzzle.victimId,
          puzzle.clues,
          { maxLevel: 3 }
        );
        expect(ded.solved, `Deductive solver stalled on ${seed}`).toBe(true);
        expect(ded.solution).toEqual(puzzle.solution);

        level1Sum += ded.maxLevelUsed;
        maxLevelSeen = Math.max(maxLevelSeen, ded.maxLevelUsed);
        singlesSum += ded.initialSingles;
        stepsSum += ded.steps.length;
      }

      const elapsedMs = Date.now() - startTime;
      console.log(
        `[${difficulty}] 10 puzzles in ${elapsedMs}ms (avg ${(elapsedMs / 10).toFixed(1)}ms) | avgMaxLvl=${(level1Sum / 10).toFixed(1)} (peak ${maxLevelSeen}) | avgInitialSingles=${(singlesSum / 10).toFixed(1)} | avgSteps=${(stepsSum / 10).toFixed(1)}`
      );

      if (difficulty === 'starter') {
        expect(maxLevelSeen).toBe(1);
        expect(singlesSum / 10).toBeGreaterThanOrEqual(0.8);
      } else if (difficulty === 'medium' || difficulty === 'hard' || difficulty === 'expert') {
        expect(maxLevelSeen).toBeGreaterThanOrEqual(2);
      }
      if (difficulty === 'hard' || difficulty === 'expert') {
        expect(singlesSum / 10).toBeLessThanOrEqual(0.5);
      }
    }
  );
});
