import { describe, expect, it } from 'vitest';
import {
  CURATED_CASES,
  getCuratedCasesByDifficulty,
  getCuratedPuzzle,
  getNextCuratedCaseId,
} from '../curatedCases';
import { evaluateClueOnAssignment } from '../predicates';
import { countSolutions, solveDeductively } from '../solver';
import type { Difficulty } from '../types';

const DIFFICULTIES: Difficulty[] = ['starter', 'easy', 'medium', 'hard', 'expert'];

describe('Hand-Picked Casebook (25 Curated Cases)', () => {
  it('contains 25 unique cases (5 per difficulty) with valid progression links', () => {
    expect(CURATED_CASES.length).toBe(25);
    const ids = new Set(CURATED_CASES.map((c) => c.id));
    const titles = new Set(CURATED_CASES.map((c) => c.title));
    expect(ids.size).toBe(25);
    expect(titles.size).toBe(25);

    for (const diff of DIFFICULTIES) {
      const list = getCuratedCasesByDifficulty(diff);
      expect(list.length).toBe(5);
      expect(list.map((c) => c.caseNumber)).toEqual([1, 2, 3, 4, 5]);
      expect(getNextCuratedCaseId(list[0].id)).toBe(list[1].id);
      expect(getNextCuratedCaseId(list[4].id)).toBeNull();
    }
  });

  it.each(CURATED_CASES.map((c) => [c.id, c]))(
    'strictly verifies %s for uniqueness, zero-guess solvability, and zero redundant clues',
    (_id, spec) => {
      const puzzle = getCuratedPuzzle(spec.id);
      expect(puzzle).not.toBeNull();
      if (!puzzle) return;

      expect(puzzle.title.length).toBeGreaterThan(3);
      expect(puzzle.premise.length).toBeGreaterThan(20);
      expect(puzzle.stolenItem.length).toBeGreaterThan(3);
      expect(puzzle.tagline?.length).toBeGreaterThan(10);

      // 1. Check row/col uniqueness & Victim+Killer room occupancy === 2
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
        const arr = roomCounts.get(rid) ?? [];
        arr.push(person.id);
        roomCounts.set(rid, arr);
      }

      const vPos = puzzle.solution[puzzle.victimId];
      const vRoomId = puzzle.grid[vPos.r][vPos.c].roomId;
      const vOccupants = roomCounts.get(vRoomId) ?? [];
      expect(vOccupants.length).toBe(2);
      expect(vOccupants).toContain(puzzle.victimId);
      expect(vOccupants).toContain(puzzle.killerId);

      // 2. Every clue evaluates true on solution
      for (const clue of puzzle.clues) {
        expect(evaluateClueOnAssignment(clue, puzzle.solution, puzzle.grid)).toBe(true);
      }

      // 3. Unique solution matches puzzle.solution
      const uniq = countSolutions(
        puzzle.grid,
        puzzle.rooms,
        puzzle.people,
        puzzle.victimId,
        puzzle.clues,
        2
      );
      expect(uniq.count).toBe(1);
      expect(uniq.firstSolution).toEqual(puzzle.solution);

      // 4. Deductive solver solves it without guessing
      const ded = solveDeductively(
        puzzle.grid,
        puzzle.rooms,
        puzzle.people,
        puzzle.victimId,
        puzzle.clues,
        { maxLevel: 3 }
      );
      expect(ded.solved).toBe(true);
      expect(ded.solution).toEqual(puzzle.solution);

      // 5. Strict Clue Relevance: removing ANY single non-victim clue breaks uniqueness!
      for (let i = 0; i < puzzle.clues.length; i++) {
        const clue = puzzle.clues[i];
        if (clue.kind === 'victim_alone_with_killer') continue;
        const without = puzzle.clues.filter((_, idx) => idx !== i);
        const u = countSolutions(
          puzzle.grid,
          puzzle.rooms,
          puzzle.people,
          puzzle.victimId,
          without,
          2
        );
        expect(
          u.count,
          `Clue ${clue.id} (${clue.text}) in ${spec.id} was redundant`
        ).toBeGreaterThanOrEqual(2);
      }

      // 6. Tier pacing checks
      if (spec.difficulty === 'starter') {
        expect(ded.maxLevelUsed).toBe(1);
        expect(ded.initialSingles).toBeGreaterThanOrEqual(1);
      } else if (spec.difficulty === 'hard') {
        expect(ded.initialSingles).toBe(0);
      } else if (spec.difficulty === 'expert') {
        expect(ded.initialSingles).toBe(0);
        expect(ded.maxLevelUsed).toBe(3);
      }
    }
  );
});
