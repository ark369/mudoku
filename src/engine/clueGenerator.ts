import {
  computeClueHighlights,
  evaluateClueOnAssignment,
  formatClueText,
  getUnaryAllowedCellMask,
  isCellBesideObjectKind,
  isCellDirectlyDirOfObjectKind,
  isDiagonalSameRoom,
  isDirFromPerson,
  isOuterEdge,
} from './predicates';
import type { SeededRNG } from './rng';
import { countSolutions, solveDeductively } from './solver';
import type {
  Cell,
  Clue,
  ClueDraft,
  Coord,
  Difficulty,
  Direction,
  ObjectKind,
  OccupiableKind,
  Person,
  Room,
} from './types';

interface CandidateClue {
  clue: Clue;
  weight: number;
  unaryCount: number;
  unaryMask: Uint8Array | null;
  isStrongAnchor: boolean;
}

function makeClue(
  raw: ClueDraft,
  grid: Cell[][],
  rooms: Room[],
  people: Person[]
): Clue {
  return {
    ...raw,
    text: formatClueText(raw, rooms, people),
    highlights: computeClueHighlights(raw, grid),
  } as Clue;
}

function isUnaryKind(kind: Clue['kind']): boolean {
  return (
    kind === 'in_room' ||
    kind === 'not_in_room' ||
    kind === 'in_either_room' ||
    kind === 'on_object' ||
    kind === 'not_on_object' ||
    kind === 'on_empty_floor' ||
    kind === 'beside_object' ||
    kind === 'not_beside_object' ||
    kind === 'dir_of_object' ||
    kind === 'outer_edge' ||
    kind === 'not_outer_edge' ||
    kind === 'alone_in_room' ||
    kind === 'only_on_object' ||
    kind === 'only_beside_object'
  );
}

function popCountMask(mask: Uint8Array): number {
  let c = 0;
  for (let i = 0; i < mask.length; i++) c += mask[i];
  return c;
}

function intersectCount(a: Uint8Array, b: Uint8Array): number {
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === 1 && b[i] === 1) c++;
  }
  return c;
}

export function enumerateCandidateClues(
  grid: Cell[][],
  rooms: Room[],
  people: Person[],
  victimId: string,
  killerId: string,
  solution: Record<string, Coord>,
  difficulty: Difficulty
): CandidateClue[] {
  const size = grid.length;
  const candidates: CandidateClue[] = [];
  let seq = 1;
  const nextId = (prefix: string) => `${prefix}_${seq++}`;

  const occRoomCounts = new Array<number>(rooms.length).fill(0);
  for (const pos of Object.values(solution)) {
    occRoomCounts[grid[pos.r][pos.c].roomId] += 1;
  }

  const presentOccupiables = new Set<OccupiableKind>();
  const presentObjects = new Set<ObjectKind>();
  let totalWalkable = 0;
  let totalBareFloor = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];
      if (cell.blocking === null) {
        totalWalkable++;
        if (cell.occupiable === null) totalBareFloor++;
      }
      if (cell.occupiable) {
        presentOccupiables.add(cell.occupiable);
        presentObjects.add(cell.occupiable);
      }
      if (cell.blocking) {
        presentObjects.add(cell.blocking);
      }
    }
  }

  const peopleOnObj = new Map<OccupiableKind, string[]>();
  const peopleBesideObj = new Map<ObjectKind, string[]>();
  for (const p of people) {
    const pos = solution[p.id];
    const occ = grid[pos.r][pos.c].occupiable;
    if (occ) {
      const arr = peopleOnObj.get(occ) ?? [];
      arr.push(p.id);
      peopleOnObj.set(occ, arr);
    }
    for (const obj of presentObjects) {
      if (isCellBesideObjectKind(pos, obj, grid)) {
        const arr = peopleBesideObj.get(obj) ?? [];
        arr.push(p.id);
        peopleBesideObj.set(obj, arr);
      }
    }
  }

  const pushCandidate = (clue: Clue, weight: number, isStrongAnchor = false) => {
    if (!evaluateClueOnAssignment(clue, solution, grid)) return;
    const unaryMask = isUnaryKind(clue.kind) ? getUnaryAllowedCellMask(clue, grid) : null;
    const unaryCount = unaryMask ? popCountMask(unaryMask) : totalWalkable;
    candidates.push({ clue, weight, unaryCount, unaryMask, isStrongAnchor });
  };

  const isHarder = difficulty === 'medium' || difficulty === 'hard' || difficulty === 'expert';

  for (const person of people) {
    if (person.isVictim) {
      pushCandidate(
        makeClue(
          {
            id: nextId('vic'),
            ownerId: person.id,
            tier: 1,
            kind: 'victim_alone_with_killer',
            victimId: person.id,
          },
          grid,
          rooms,
          people
        ),
        100,
        false
      );

      if (difficulty === 'starter' || difficulty === 'easy') {
        const pos = solution[person.id];
        const rid = grid[pos.r][pos.c].roomId;
        for (const other of rooms) {
          if (other.id === rid) continue;
          const c = makeClue(
            {
              id: nextId('v_either'),
              ownerId: person.id,
              tier: 1,
              kind: 'in_either_room',
              personId: person.id,
              roomIds: [rid, other.id],
            },
            grid,
            rooms,
            people
          );
          pushCandidate(c, 8, false);
        }
      }
      continue;
    }

    const pos = solution[person.id];
    const cell = grid[pos.r][pos.c];
    const rid = cell.roomId;

    // 1. in_room
    {
      const c = makeClue(
        {
          id: nextId('in_rm'),
          ownerId: person.id,
          tier: 1,
          kind: 'in_room',
          personId: person.id,
          roomId: rid,
        },
        grid,
        rooms,
        people
      );
      const w =
        difficulty === 'starter'
          ? 24
          : difficulty === 'easy'
            ? 16
            : difficulty === 'medium'
              ? 8
              : difficulty === 'hard'
                ? 4
                : 2;
      pushCandidate(c, w, true);
    }

    // 2. alone_in_room
    if (occRoomCounts[rid] === 1) {
      const c = makeClue(
        {
          id: nextId('alone_rm'),
          ownerId: person.id,
          tier: 1,
          kind: 'alone_in_room',
          personId: person.id,
          roomId: rid,
        },
        grid,
        rooms,
        people
      );
      const w =
        difficulty === 'starter' ? 22 : difficulty === 'easy' ? 16 : difficulty === 'medium' ? 10 : 4;
      pushCandidate(c, w, true);
    }

    // 3. alone_somewhere
    if (occRoomCounts[rid] === 1) {
      const c = makeClue(
        {
          id: nextId('alone_any'),
          ownerId: person.id,
          tier: 2,
          kind: 'alone_somewhere',
          personId: person.id,
        },
        grid,
        rooms,
        people
      );
      const w = difficulty === 'starter' ? 4 : difficulty === 'easy' ? 10 : 20;
      pushCandidate(c, w, false);
    }

    // 4. in_either_room
    for (const other of rooms) {
      if (other.id === rid) continue;
      const c = makeClue(
        {
          id: nextId('either'),
          ownerId: person.id,
          tier: 1,
          kind: 'in_either_room',
          personId: person.id,
          roomIds: [rid, other.id],
        },
        grid,
        rooms,
        people
      );
      const w = difficulty === 'starter' ? 10 : difficulty === 'easy' ? 16 : 20;
      pushCandidate(c, w, false);
    }

    // 5. not_in_room
    for (const other of rooms) {
      if (other.id === rid) continue;
      const c = makeClue(
        {
          id: nextId('not_rm'),
          ownerId: person.id,
          tier: 1,
          kind: 'not_in_room',
          personId: person.id,
          roomId: other.id,
        },
        grid,
        rooms,
        people
      );
      const m = getUnaryAllowedCellMask(c, grid);
      if (totalWalkable - popCountMask(m) >= 2) {
        const w = difficulty === 'starter' ? 3 : difficulty === 'easy' ? 6 : 8;
        pushCandidate(c, w, false);
      }
    }

    // 6. on_object & only_on_object
    if (cell.occupiable) {
      const obj = cell.occupiable;
      const cOn = makeClue(
        {
          id: nextId('on_obj'),
          ownerId: person.id,
          tier: 1,
          kind: 'on_object',
          personId: person.id,
          objectKind: obj,
        },
        grid,
        rooms,
        people
      );
      const uOn = popCountMask(getUnaryAllowedCellMask(cOn, grid));
      if (totalWalkable - uOn >= 2) {
        const w = difficulty === 'starter' ? 24 : difficulty === 'easy' ? 19 : 16;
        pushCandidate(cOn, w, uOn <= 2);
      }

      if ((peopleOnObj.get(obj)?.length ?? 0) === 1) {
        const cOnly = makeClue(
          {
            id: nextId('only_on'),
            ownerId: person.id,
            tier: 1,
            kind: 'only_on_object',
            personId: person.id,
            objectKind: obj,
          },
          grid,
          rooms,
          people
        );
        const w = difficulty === 'starter' ? 14 : difficulty === 'easy' ? 18 : 22;
        pushCandidate(cOnly, w, uOn <= 2);
      }
    } else if (totalWalkable - totalBareFloor >= 3 && presentOccupiables.size > 0) {
      const cBare = makeClue(
        {
          id: nextId('bare'),
          ownerId: person.id,
          tier: 1,
          kind: 'on_empty_floor',
          personId: person.id,
        },
        grid,
        rooms,
        people
      );
      const w = difficulty === 'starter' ? 5 : 10;
      pushCandidate(cBare, w, false);
    }

    // 7. beside_object, only_beside_object, not_beside_object, dir_of_object
    for (const obj of presentObjects) {
      if (isCellBesideObjectKind(pos, obj, grid)) {
        const cBeside = makeClue(
          {
            id: nextId('beside'),
            ownerId: person.id,
            tier: 1,
            kind: 'beside_object',
            personId: person.id,
            objectKind: obj,
          },
          grid,
          rooms,
          people
        );
        const uBeside = popCountMask(getUnaryAllowedCellMask(cBeside, grid));
        if (totalWalkable - uBeside >= 2) {
          const w = difficulty === 'starter' ? 22 : difficulty === 'easy' ? 19 : 17;
          pushCandidate(cBeside, w, uBeside <= 2);
        }

        if ((peopleBesideObj.get(obj)?.length ?? 0) === 1) {
          const cOnlyB = makeClue(
            {
              id: nextId('only_beside'),
              ownerId: person.id,
              tier: 1,
              kind: 'only_beside_object',
              personId: person.id,
              objectKind: obj,
            },
            grid,
            rooms,
            people
          );
          const w = difficulty === 'starter' ? 12 : difficulty === 'easy' ? 17 : 22;
          pushCandidate(cOnlyB, w, uBeside <= 2);
        }

        for (const dir of ['north', 'south', 'east', 'west'] as Direction[]) {
          if (isCellDirectlyDirOfObjectKind(pos, obj, dir, grid)) {
            const cDirObj = makeClue(
              {
                id: nextId('dir_obj'),
                ownerId: person.id,
                tier: 1,
                kind: 'dir_of_object',
                personId: person.id,
                objectKind: obj,
                dir,
              },
              grid,
              rooms,
              people
            );
            const uDir = popCountMask(getUnaryAllowedCellMask(cDirObj, grid));
            if (totalWalkable - uDir >= 2) {
              const w = difficulty === 'starter' ? 14 : difficulty === 'easy' ? 15 : 15;
              pushCandidate(cDirObj, w, uDir <= 2);
            }
          }
        }
      } else if (isHarder) {
        const cNotBeside = makeClue(
          {
            id: nextId('not_beside'),
            ownerId: person.id,
            tier: 1,
            kind: 'not_beside_object',
            personId: person.id,
            objectKind: obj,
          },
          grid,
          rooms,
          people
        );
        const uNB = popCountMask(getUnaryAllowedCellMask(cNotBeside, grid));
        if (totalWalkable - uNB >= 3) {
          pushCandidate(cNotBeside, 4.5, false);
        }
      }
    }

    // 8. outer_edge / not_outer_edge
    if (isOuterEdge(pos, size)) {
      const cEdge = makeClue(
        { id: nextId('edge'), ownerId: person.id, tier: 1, kind: 'outer_edge', personId: person.id },
        grid,
        rooms,
        people
      );
      pushCandidate(cEdge, difficulty === 'starter' ? 8 : 13, false);
    } else {
      const cNotEdge = makeClue(
        {
          id: nextId('no_edge'),
          ownerId: person.id,
          tier: 1,
          kind: 'not_outer_edge',
          personId: person.id,
        },
        grid,
        rooms,
        people
      );
      pushCandidate(cNotEdge, difficulty === 'starter' ? 5 : 12, false);
    }

    // 9. Relational clues relative to other people
    for (const other of people) {
      if (other.id === person.id) continue;
      const otherPos = solution[other.id];
      const otherRid = grid[otherPos.r][otherPos.c].roomId;

      const isVKPair =
        (person.id === victimId && other.id === killerId) ||
        (person.id === killerId && other.id === victimId);

      if (rid === otherRid && !isVKPair) {
        const cSame = makeClue(
          {
            id: nextId('same_rm'),
            ownerId: person.id,
            tier: 2,
            kind: 'same_room_as',
            personId: person.id,
            otherId: other.id,
          },
          grid,
          rooms,
          people
        );
        const w = difficulty === 'starter' ? 2 : difficulty === 'easy' ? 12 : 24;
        pushCandidate(cSame, w, false);
      }

      if (rid !== otherRid) {
        const cDiff = makeClue(
          {
            id: nextId('diff_rm'),
            ownerId: person.id,
            tier: 2,
            kind: 'diff_room_from',
            personId: person.id,
            otherId: other.id,
          },
          grid,
          rooms,
          people
        );
        const w = difficulty === 'starter' ? 1 : difficulty === 'easy' ? 6 : 15;
        pushCandidate(cDiff, w, false);
      }

      if (isDiagonalSameRoom(pos, otherPos, grid)) {
        const cDiag = makeClue(
          {
            id: nextId('diag'),
            ownerId: person.id,
            tier: 2,
            kind: 'diagonal_to_person',
            personId: person.id,
            otherId: other.id,
          },
          grid,
          rooms,
          people
        );
        const w = difficulty === 'starter' ? 2 : difficulty === 'easy' ? 8 : 20;
        pushCandidate(cDiag, w, false);
      }

      for (const dir of ['north', 'south', 'east', 'west'] as Direction[]) {
        if (isDirFromPerson(pos, otherPos, dir)) {
          const dist =
            dir === 'north' || dir === 'south'
              ? Math.abs(pos.r - otherPos.r)
              : Math.abs(pos.c - otherPos.c);
          const cDir = makeClue(
            {
              id: nextId('dir_p'),
              ownerId: person.id,
              tier: 2,
              kind: 'dir_from_person',
              personId: person.id,
              otherId: other.id,
              dir,
            },
            grid,
            rooms,
            people
          );
          const baseW = difficulty === 'starter' ? 2 : difficulty === 'easy' ? 10 : 20;
          const distFactor = dist <= 3 ? 1 : 0.45;
          pushCandidate(cDir, baseW * distFactor, false);
        }
      }
    }
  }

  // 10. Case Notes
  for (const room of rooms) {
    const cnt = occRoomCounts[room.id];
    if (cnt === 0) {
      const cEmpty = makeClue(
        { id: nextId('case_empty'), ownerId: 'case', tier: 1, kind: 'room_empty', roomId: room.id },
        grid,
        rooms,
        people
      );
      const w = difficulty === 'starter' ? 6 : difficulty === 'easy' ? 9 : 16;
      pushCandidate(cEmpty, w, false);
    } else if (room.cells.length >= 4 && isHarder) {
      const cCount = makeClue(
        {
          id: nextId('case_cnt'),
          ownerId: 'case',
          tier: 2,
          kind: 'room_exact_count',
          roomId: room.id,
          count: cnt,
        },
        grid,
        rooms,
        people
      );
      const w = difficulty === 'medium' ? 12 : 18;
      pushCandidate(cCount, w, false);
    }
  }

  return candidates;
}

function weightedPick(pool: CandidateClue[], rng: SeededRNG): CandidateClue {
  let total = 0;
  for (const item of pool) total += Math.max(0.1, item.weight);
  let r = rng.next() * total;
  for (const item of pool) {
    r -= Math.max(0.1, item.weight);
    if (r <= 0) return item;
  }
  return pool[pool.length - 1];
}

function areSimilarClues(a: Clue, b: Clue): boolean {
  if (a.ownerId !== b.ownerId) return false;
  if (a.kind === b.kind) {
    if (a.kind === 'dir_from_person' && b.kind === 'dir_from_person') {
      return a.otherId === b.otherId && a.dir === b.dir;
    }
    if ('objectKind' in a && 'objectKind' in b && a.objectKind === b.objectKind) return true;
    if ('otherId' in a && 'otherId' in b && a.otherId === b.otherId) return true;
    if ('roomId' in a && 'roomId' in b && a.roomId === b.roomId) return true;
    if (a.kind === 'room_exact_count' && b.kind === 'room_exact_count' && a.roomId === b.roomId) {
      return true;
    }
  }
  // Avoid having both in_room and alone_in_room for the same person
  if (
    (a.kind === 'in_room' && b.kind === 'alone_in_room') ||
    (b.kind === 'in_room' && a.kind === 'alone_in_room')
  ) {
    return true;
  }
  if (
    (a.kind === 'on_object' && b.kind === 'only_on_object') ||
    (b.kind === 'on_object' && a.kind === 'only_on_object')
  ) {
    return true;
  }
  if (
    (a.kind === 'beside_object' && b.kind === 'only_beside_object') ||
    (b.kind === 'beside_object' && a.kind === 'only_beside_object')
  ) {
    return true;
  }
  return false;
}

export interface ClueSelectionResult {
  clues: Clue[];
  maxLevel: number;
  stepCount: number;
  initialSingles: number;
  victimDepth: number;
}

export function selectCluesForPuzzle(
  grid: Cell[][],
  rooms: Room[],
  people: Person[],
  victimId: string,
  killerId: string,
  solution: Record<string, Coord>,
  difficulty: Difficulty,
  rng: SeededRNG,
  relaxedMode = false
): ClueSelectionResult | null {
  const size = grid.length;
  const totalCells = size * size;
  const candidates = enumerateCandidateClues(
    grid,
    rooms,
    people,
    victimId,
    killerId,
    solution,
    difficulty
  );

  const selected: Clue[] = [];
  const usedIds = new Set<string>();

  const personIdxById = new Map<string, number>();
  people.forEach((p, idx) => personIdxById.set(p.id, idx));

  const walkableMask = new Uint8Array(totalCells);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].blocking === null) walkableMask[r * size + c] = 1;
    }
  }
  // Track unary candidate mask per person to avoid accidentally collapsing to 1-cell initial singles on Hard/Expert
  const unaryMasks = people.map(() => walkableMask.slice());

  const applyUnaryTracking = (clue: Clue) => {
    const candItem = candidates.find((c) => c.clue.id === clue.id);
    if (!candItem?.unaryMask) return;
    if ('personId' in clue) {
      const pi = personIdxById.get(clue.personId);
      if (pi !== undefined) {
        for (let i = 0; i < totalCells; i++) {
          if (candItem.unaryMask[i] === 0) unaryMasks[pi][i] = 0;
        }
      }
      if (clue.kind === 'only_on_object' || clue.kind === 'only_beside_object' || clue.kind === 'alone_in_room') {
        for (let pj = 0; pj < people.length; pj++) {
          if (pj === pi) continue;
          for (let i = 0; i < totalCells; i++) {
            if (candItem.unaryMask[i] === 1) unaryMasks[pj][i] = 0;
          }
        }
      }
    } else if (clue.kind === 'room_empty') {
      for (const cell of rooms[clue.roomId].cells) {
        const idx = cell.r * size + cell.c;
        for (let pj = 0; pj < people.length; pj++) unaryMasks[pj][idx] = 0;
      }
    }
  };

  const wouldCreateInitialSingle = (item: CandidateClue): boolean => {
    if (!item.unaryMask) return false;
    if (!('personId' in item.clue)) return false;
    const pi = personIdxById.get(item.clue.personId);
    if (pi === undefined) return false;
    const remain = intersectCount(unaryMasks[pi], item.unaryMask);
    return remain <= 1;
  };

  const victimBase = candidates.find((c) => c.clue.kind === 'victim_alone_with_killer');
  if (!victimBase) return null;
  selected.push(victimBase.clue);
  usedIds.add(victimBase.clue.id);

  const suspects = rng.shuffle(people.filter((p) => !p.isVictim));
  const forbidSingleUnary = !relaxedMode && (difficulty === 'hard' || difficulty === 'expert');
  const maxInRoom =
    relaxedMode
      ? 99
      : difficulty === 'starter'
        ? 4
        : difficulty === 'easy'
          ? 3
          : difficulty === 'medium'
            ? 2
            : 1;
  let inRoomCount = 0;
  const kindCounts = new Map<Clue['kind'], number>();
  const addSelectedClue = (clue: Clue) => {
    selected.push(clue);
    usedIds.add(clue.id);
    applyUnaryTracking(clue);
    kindCounts.set(clue.kind, (kindCounts.get(clue.kind) ?? 0) + 1);
    if (clue.kind === 'in_room' || clue.kind === 'alone_in_room') inRoomCount++;
  };

  // Initial seed: 1 clue per suspect
  for (const s of suspects) {
    let pool = candidates.filter((c) => {
      if (usedIds.has(c.clue.id) || c.clue.ownerId !== s.id) return false;
      if (
        (c.clue.kind === 'in_room' || c.clue.kind === 'alone_in_room') &&
        inRoomCount >= maxInRoom
      ) {
        return false;
      }
      if (forbidSingleUnary && c.unaryCount <= 2 && c.clue.tier === 1) return false;
      return true;
    });

    if (pool.length === 0) {
      pool = candidates.filter(
        (c) =>
          !usedIds.has(c.clue.id) &&
          c.clue.ownerId === s.id &&
          !(forbidSingleUnary && wouldCreateInitialSingle(c))
      );
    }
    if (pool.length === 0) {
      pool = candidates.filter((c) => !usedIds.has(c.clue.id) && c.clue.ownerId === s.id);
    }
    if (pool.length === 0) continue;

    if (difficulty === 'starter' && selected.length <= 2) {
      const anchors = pool.filter((c) => c.isStrongAnchor);
      if (anchors.length > 0) pool = anchors;
    }

    const diversifiedPool = pool.map((item) => {
      const usedCount = kindCounts.get(item.clue.kind) ?? 0;
      const divMult = 1 / (1 + usedCount * 2.2);
      return { ...item, weight: item.weight * divMult };
    });

    const picked = weightedPick(diversifiedPool, rng);
    addSelectedClue(picked.clue);
  }

  // Add 1 Case Note early on Hard/Expert
  if ((difficulty === 'hard' || difficulty === 'expert') && !relaxedMode) {
    const casePool = candidates.filter((c) => c.clue.ownerId === 'case' && !usedIds.has(c.clue.id));
    if (casePool.length > 0) {
      const picked = weightedPick(casePool, rng);
      addSelectedClue(picked.clue);
    }
  }

  const targetMaxLevel: 1 | 2 | 3 =
    relaxedMode ? 3 : difficulty === 'starter' ? 1 : difficulty === 'easy' ? 2 : 3;
  const maxTotalClues = people.length * 3 + 4;

  let solvedResult = solveDeductively(grid, rooms, people, victimId, selected, {
    maxLevel: targetMaxLevel,
  });

  // Information-guided upgrade loop
  while (!solvedResult.solved && selected.length < maxTotalClues) {
    const ownerCounts = new Map<string, number>();
    for (const c of selected) ownerCounts.set(c.ownerId, (ownerCounts.get(c.ownerId) ?? 0) + 1);

    const candMasks = solvedResult.candMasks;
    const ambiguousPeople = new Set<string>();
    if (candMasks) {
      people.forEach((p, idx) => {
        if (popCountMask(candMasks[idx]) > 1) ambiguousPeople.add(p.id);
      });
    } else {
      people.forEach((p) => ambiguousPeople.add(p.id));
    }

    const scoreCandidateForProgress = (item: CandidateClue): number => {
      const clue = item.clue;
      const ownerCnt = ownerCounts.get(clue.ownerId) ?? 0;

      let liveEliminations = 0;
      const isGlobalClue =
        clue.kind === 'only_on_object' ||
        clue.kind === 'only_beside_object' ||
        clue.kind === 'alone_in_room' ||
        clue.kind === 'alone_somewhere' ||
        clue.kind === 'room_empty' ||
        clue.kind === 'room_exact_count';

      if (candMasks && item.unaryMask && 'personId' in clue) {
        const pi = personIdxById.get(clue.personId);
        if (pi !== undefined) {
          const curCount = popCountMask(candMasks[pi]);
          const afterCount = intersectCount(candMasks[pi], item.unaryMask);
          liveEliminations = curCount - afterCount;
          if (liveEliminations <= 0 && !isGlobalClue) {
            return 0;
          }
        }
      } else if (candMasks && (clue.kind === 'room_exact_count' || clue.kind === 'room_empty')) {
        let touchesAmbig = false;
        for (const pid of ambiguousPeople) {
          const pi = personIdxById.get(pid);
          if (pi === undefined) continue;
          if (rooms[clue.roomId].cells.some((cell) => candMasks[pi][cell.r * size + cell.c] === 1)) {
            touchesAmbig = true;
            break;
          }
        }
        if (!touchesAmbig) return 0;
      } else if (
        clue.kind === 'same_room_as' ||
        clue.kind === 'diff_room_from' ||
        clue.kind === 'dir_from_person' ||
        clue.kind === 'diagonal_to_person'
      ) {
        if (!ambiguousPeople.has(clue.personId) && !ambiguousPeople.has(clue.otherId)) return 0;
      }

      if (
        !isGlobalClue &&
        clue.ownerId !== 'case' &&
        clue.ownerId !== victimId &&
        !ambiguousPeople.has(clue.ownerId) &&
        liveEliminations === 0
      ) {
        if (!('otherId' in clue) || !ambiguousPeople.has(clue.otherId)) {
          return 0;
        }
      }

      let mult = ownerCnt <= 1 ? 2.5 : ownerCnt === 2 ? 0.9 : 0.35;
      if (liveEliminations > 0) mult *= 1 + Math.min(4, liveEliminations * 0.55);
      if (clue.tier === 2 && (difficulty === 'medium' || difficulty === 'hard' || difficulty === 'expert')) {
        mult *= 1.7;
      }
      const sameKindCount = kindCounts.get(clue.kind) ?? 0;
      mult *= 1 / (1 + sameKindCount * 2.2);
      return item.weight * mult;
    };

    const buildPool = (allowSingleUnary: boolean, allowInRoom: boolean, maxPerOwner: number) => {
      const scored: CandidateClue[] = [];
      for (const item of candidates) {
        const clue = item.clue;
        if (usedIds.has(clue.id)) continue;
        if (clue.ownerId === victimId && difficulty !== 'starter' && difficulty !== 'easy' && !relaxedMode) {
          continue;
        }
        if (clue.ownerId !== 'case' && (ownerCounts.get(clue.ownerId) ?? 0) >= maxPerOwner) continue;
        if (clue.ownerId === 'case' && (ownerCounts.get('case') ?? 0) >= 3) continue;
        if (!allowInRoom && (clue.kind === 'in_room' || clue.kind === 'alone_in_room')) continue;
        if (!allowSingleUnary && wouldCreateInitialSingle(item)) continue;
        if (selected.some((ex) => areSimilarClues(ex, clue))) continue;

        const w = scoreCandidateForProgress(item);
        if (w > 0) scored.push({ ...item, weight: w });
      }
      return scored;
    };

    let pool = buildPool(!forbidSingleUnary, inRoomCount < maxInRoom, 2);
    if (pool.length === 0) pool = buildPool(!forbidSingleUnary, inRoomCount < maxInRoom, 3);
    if (pool.length === 0) pool = buildPool(true, inRoomCount < maxInRoom, 4);
    if (pool.length === 0) pool = buildPool(true, true, 5);
    if (pool.length === 0) break;

    const picked = weightedPick(pool, rng);
    addSelectedClue(picked.clue);

    solvedResult = solveDeductively(grid, rooms, people, victimId, selected, {
      maxLevel: targetMaxLevel,
    });
  }

  if (!solvedResult.solved) return null;

  const uniq = countSolutions(grid, rooms, people, victimId, selected, 2);
  if (uniq.count !== 1) return null;

  // Pruning pass: drop redundant clues while keeping >= 1 per suspect and preserving difficulty
  const ownerCounts = new Map<string, number>();
  for (const c of selected) ownerCounts.set(c.ownerId, (ownerCounts.get(c.ownerId) ?? 0) + 1);

  for (let i = selected.length - 1; i >= 1; i--) {
    const candidate = selected[i];
    if (candidate.kind === 'victim_alone_with_killer') continue;
    if (candidate.ownerId !== 'case' && (ownerCounts.get(candidate.ownerId) ?? 0) <= 1) continue;

    const trial = selected.filter((_, idx) => idx !== i);
    const trialUniq = countSolutions(grid, rooms, people, victimId, trial, 2);
    if (trialUniq.count !== 1) continue;

    const trialRes = solveDeductively(grid, rooms, people, victimId, trial, {
      maxLevel: targetMaxLevel,
    });
    if (!trialRes.solved) continue;
    if (
      !relaxedMode &&
      (difficulty === 'medium' || difficulty === 'hard' || difficulty === 'expert') &&
      trialRes.maxLevelUsed < solvedResult.maxLevelUsed
    ) {
      continue;
    }
    if (
      !relaxedMode &&
      (difficulty === 'hard' || difficulty === 'expert') &&
      trialRes.initialSingles > solvedResult.initialSingles
    ) {
      continue;
    }
    selected.splice(i, 1);
    ownerCounts.set(candidate.ownerId, (ownerCounts.get(candidate.ownerId) ?? 1) - 1);
    solvedResult = trialRes;
  }

  return {
    clues: selected,
    maxLevel: solvedResult.maxLevelUsed,
    stepCount: solvedResult.steps.length,
    initialSingles: solvedResult.initialSingles,
    victimDepth: solvedResult.victimDepth,
  };
}
