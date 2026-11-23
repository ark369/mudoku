import { DIFFICULTY_CONFIG, type Cell, type Coord, type Difficulty, type ObjectKind, type Person, type Room } from './types';
import { ROOM_PALETTES, type MysteryTheme } from './themes';
import type { SeededRNG } from './rng';

interface Rect {
  r0: number;
  c0: number;
  h: number;
  w: number;
}

function splitRectangles(size: number, targetRooms: number, rng: SeededRNG): Rect[] {
  const rects: Rect[] = [{ r0: 0, c0: 0, h: size, w: size }];

  while (rects.length < targetRooms) {
    const splittable = rects
      .map((rect, idx) => ({ rect, idx }))
      .filter(({ rect }) => rect.h >= 4 || rect.w >= 4);

    if (splittable.length === 0) break;

    // Always split one of the largest-area rectangles so rooms stay architecturally balanced
    splittable.sort((a, b) => b.rect.h * b.rect.w - a.rect.h * a.rect.w);
    const maxArea = splittable[0].rect.h * splittable[0].rect.w;
    const topTies = splittable.filter((s) => s.rect.h * s.rect.w === maxArea);
    const chosen = topTies[rng.int(0, topTies.length - 1)];
    const { rect, idx } = chosen;

    const canH = rect.h >= 4;
    const canW = rect.w >= 4;
    let splitHoriz: boolean;
    if (canH && canW) {
      if (rect.h > rect.w) splitHoriz = rng.chance(0.75);
      else if (rect.w > rect.h) splitHoriz = rng.chance(0.25);
      else splitHoriz = rng.chance(0.5);
    } else {
      splitHoriz = canH;
    }

    rects.splice(idx, 1);

    if (splitHoriz) {
      const cut = rng.int(2, rect.h - 2);
      rects.push({ r0: rect.r0, c0: rect.c0, h: cut, w: rect.w });
      rects.push({ r0: rect.r0 + cut, c0: rect.c0, h: rect.h - cut, w: rect.w });
    } else {
      const cut = rng.int(2, rect.w - 2);
      rects.push({ r0: rect.r0, c0: rect.c0, h: rect.h, w: cut });
      rects.push({ r0: rect.r0, c0: rect.c0 + cut, h: rect.h, w: rect.w - cut });
    }
  }

  return rects;
}

function colorRoomsAdjacency(roomCount: number, roomIdsGrid: number[][]): number[] {
  const adj: Set<number>[] = Array.from({ length: roomCount }, () => new Set<number>());
  const size = roomIdsGrid.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const a = roomIdsGrid[r][c];
      if (r + 1 < size) {
        const b = roomIdsGrid[r + 1][c];
        if (a !== b) {
          adj[a].add(b);
          adj[b].add(a);
        }
      }
      if (c + 1 < size) {
        const b = roomIdsGrid[r][c + 1];
        if (a !== b) {
          adj[a].add(b);
          adj[b].add(a);
        }
      }
    }
  }

  const order = Array.from({ length: roomCount }, (_, i) => i).sort(
    (a, b) => adj[b].size - adj[a].size
  );
  const colors = new Array<number>(roomCount).fill(-1);

  for (const rId of order) {
    const used = new Set<number>();
    for (const nb of adj[rId]) {
      if (colors[nb] !== -1) used.add(colors[nb]);
    }
    let chosen = 0;
    while (used.has(chosen)) chosen++;
    colors[rId] = chosen % ROOM_PALETTES.length;
  }

  return colors;
}

export function generateFloorPlan(
  size: number,
  difficulty: Difficulty,
  theme: MysteryTheme,
  rng: SeededRNG
): { rooms: Room[]; grid: Cell[][] } {
  const [minRooms, maxRooms] = DIFFICULTY_CONFIG[difficulty].targetRooms;
  const targetRooms = rng.int(minRooms, maxRooms);
  const wantExtraForMerge = size >= 7 && rng.chance(0.28);
  const rects = splitRectangles(size, wantExtraForMerge ? targetRooms + 1 : targetRooms, rng);

  const roomIdsGrid: number[][] = Array.from({ length: size }, () =>
    new Array<number>(size).fill(0)
  );
  rects.forEach((rect, id) => {
    for (let r = rect.r0; r < rect.r0 + rect.h; r++) {
      for (let c = rect.c0; c < rect.c0 + rect.w; c++) {
        roomIdsGrid[r][c] = id;
      }
    }
  });

  // Optionally merge two adjacent smaller rooms into an L-shaped room
  if (wantExtraForMerge && rects.length > targetRooms) {
    const edges = new Map<string, [number, number]>();
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const a = roomIdsGrid[r][c];
        if (r + 1 < size && roomIdsGrid[r + 1][c] !== a) {
          const b = roomIdsGrid[r + 1][c];
          const key = a < b ? `${a}-${b}` : `${b}-${a}`;
          edges.set(key, a < b ? [a, b] : [b, a]);
        }
        if (c + 1 < size && roomIdsGrid[r][c + 1] !== a) {
          const b = roomIdsGrid[r][c + 1];
          const key = a < b ? `${a}-${b}` : `${b}-${a}`;
          edges.set(key, a < b ? [a, b] : [b, a]);
        }
      }
    }
    const maxMergedArea = Math.floor(size * size * 0.34);
    const pairs = Array.from(edges.values()).filter(
      ([a, b]) => rects[a].h * rects[a].w + rects[b].h * rects[b].w <= maxMergedArea
    );
    if (pairs.length > 0) {
      const [keep, drop] = rng.pick(pairs);
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (roomIdsGrid[r][c] === drop) roomIdsGrid[r][c] = keep;
          else if (roomIdsGrid[r][c] > drop) roomIdsGrid[r][c] -= 1;
        }
      }
    }
  }

  // Gather final cells per room
  const roomCellsMap = new Map<number, Coord[]>();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const rid = roomIdsGrid[r][c];
      const arr = roomCellsMap.get(rid);
      if (arr) arr.push({ r, c });
      else roomCellsMap.set(rid, [{ r, c }]);
    }
  }

  const finalRoomCount = roomCellsMap.size;
  const paletteIndices = colorRoomsAdjacency(finalRoomCount, roomIdsGrid);
  const roomNames = rng.shuffle(theme.rooms);

  const rooms: Room[] = [];
  for (let id = 0; id < finalRoomCount; id++) {
    const palette = ROOM_PALETTES[paletteIndices[id] % ROOM_PALETTES.length];
    rooms.push({
      id,
      name: roomNames[id % roomNames.length],
      colorKey: palette.colorKey,
      bgHex: palette.bgHex,
      borderHex: palette.borderHex,
      pattern: palette.pattern,
      cells: roomCellsMap.get(id) ?? [],
    });
  }

  const grid: Cell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({
      r,
      c,
      roomId: roomIdsGrid[r][c],
      occupiable: null,
      blocking: null,
    }))
  );

  return { rooms, grid };
}

export function sampleGroundTruth(
  size: number,
  rooms: Room[],
  grid: Cell[][],
  people: Person[],
  victimId: string,
  rng: SeededRNG
): { solution: Record<string, Coord>; killerId: string } | null {
  const rowIndices = Array.from({ length: size }, (_, i) => i);

  interface CandidatePerm {
    cols: number[];
    pairRooms: number[];
    score: number;
  }

  let best: CandidatePerm | null = null;

  for (let attempt = 0; attempt < 60; attempt++) {
    const cols = rng.shuffle(rowIndices);
    const counts = new Array<number>(rooms.length).fill(0);
    for (let r = 0; r < size; r++) {
      counts[grid[r][cols[r]].roomId] += 1;
    }
    const pairRooms: number[] = [];
    let aloneRooms = 0;
    let emptyRooms = 0;
    for (let rid = 0; rid < rooms.length; rid++) {
      if (counts[rid] === 2) pairRooms.push(rid);
      else if (counts[rid] === 1) aloneRooms++;
      else if (counts[rid] === 0) emptyRooms++;
    }
    if (pairRooms.length === 0) continue;

    // Prefer balanced distributions with some alone & empty rooms too
    const score =
      (aloneRooms > 0 ? 3 : 0) +
      (emptyRooms > 0 ? 2 : 0) +
      (pairRooms.length >= 1 && pairRooms.length <= 2 ? 3 : 1);

    if (!best || score > best.score) {
      best = { cols, pairRooms, score };
      if (score >= 8) break;
    }
  }

  if (!best) return null;

  const chosenPairRoom = rng.pick(best.pairRooms);
  const pairCells: Coord[] = [];
  const otherCells: Coord[] = [];
  for (let r = 0; r < size; r++) {
    const c = best.cols[r];
    if (grid[r][c].roomId === chosenPairRoom) {
      pairCells.push({ r, c });
    } else {
      otherCells.push({ r, c });
    }
  }

  const suspects = people.filter((p) => p.id !== victimId);
  const shuffledSuspects = rng.shuffle(suspects);
  const killer = shuffledSuspects[0];
  const restSuspects = shuffledSuspects.slice(1);
  const shuffledOtherCells = rng.shuffle(otherCells);

  const pairOrder = rng.chance(0.5) ? [0, 1] : [1, 0];
  const solution: Record<string, Coord> = {};
  solution[victimId] = pairCells[pairOrder[0]];
  solution[killer.id] = pairCells[pairOrder[1]];

  restSuspects.forEach((s, idx) => {
    solution[s.id] = shuffledOtherCells[idx];
  });

  return { solution, killerId: killer.id };
}

export function scatterObjects(
  grid: Cell[][],
  rooms: Room[],
  solution: Record<string, Coord>,
  theme: MysteryTheme,
  difficulty: Difficulty,
  rng: SeededRNG
): void {
  const size = grid.length;
  const occupiedKeys = new Set<string>(
    Object.values(solution).map((pos) => `${pos.r},${pos.c}`)
  );

  const occCountsByRoom = new Array<number>(rooms.length).fill(0);
  for (const pos of Object.values(solution)) {
    occCountsByRoom[grid[pos.r][pos.c].roomId] += 1;
  }

  // Choose blocking & occupiable object subsets for visual variety & clue richness
  const blockingPool = rng.shuffle(theme.blockings).slice(0, size <= 5 ? 3 : 4);
  const occupiablePool = rng.shuffle(theme.occupiables).slice(0, size <= 5 ? 3 : 4);

  // Determine unoccupied cells per room that can safely accept a blocking object
  const blockableCells: Coord[] = [];
  for (const room of rooms) {
    const roomFree = rng.shuffle(
      room.cells.filter((cell) => !occupiedKeys.has(`${cell.r},${cell.c}`))
    );
    const minWalkableNeeded = Math.max(2, occCountsByRoom[room.id] + 1);
    const maxBlockable = Math.max(0, room.cells.length - minWalkableNeeded);
    const desired = Math.min(
      maxBlockable,
      Math.max(0, Math.round(roomFree.length * (difficulty === 'starter' ? 0.22 : 0.28)))
    );
    for (let i = 0; i < desired && i < roomFree.length; i++) {
      blockableCells.push(roomFree[i]);
    }
  }

  // Assign blocking kinds in balanced counts (>= 2 each on medium+)
  const blockingCounts = new Map<ObjectKind, number>();
  const shuffledBlockable = rng.shuffle(blockableCells);
  shuffledBlockable.forEach((cell, idx) => {
    const kind = blockingPool[idx % blockingPool.length];
    grid[cell.r][cell.c].blocking = kind;
    blockingCounts.set(kind, (blockingCounts.get(kind) ?? 0) + 1);
  });

  // Ensure no single-instance blocking objects on medium/hard/expert (avoid trivial 1-cell anchors)
  if (difficulty === 'medium' || difficulty === 'hard' || difficulty === 'expert') {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const b = grid[r][c].blocking;
        if (b && (blockingCounts.get(b) ?? 0) === 1) {
          // Reassign to the most common blocking type, or remove if none >= 2
          const replacement = blockingPool.find((k) => (blockingCounts.get(k) ?? 0) >= 2);
          if (replacement) {
            grid[r][c].blocking = replacement;
            blockingCounts.set(b, 0);
            blockingCounts.set(replacement, (blockingCounts.get(replacement) ?? 0) + 1);
          } else {
            grid[r][c].blocking = null;
          }
        }
      }
    }
  }

  // Place occupiable objects on walkable cells (both some occupied & some empty cells)
  const walkableCells: Coord[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].blocking === null) walkableCells.push({ r, c });
    }
  }

  const occupiedWalkable = rng.shuffle(
    walkableCells.filter((pos) => occupiedKeys.has(`${pos.r},${pos.c}`))
  );
  const freeWalkable = rng.shuffle(
    walkableCells.filter((pos) => !occupiedKeys.has(`${pos.r},${pos.c}`))
  );

  // Place occupiable items on ~45% of people and ~32% of empty walkable cells
  const targetOccPeople = Math.max(2, Math.round(occupiedWalkable.length * 0.48));
  const targetOccFree = Math.max(3, Math.round(freeWalkable.length * 0.32));

  const chosenOccupiables: Coord[] = [
    ...occupiedWalkable.slice(0, targetOccPeople),
    ...freeWalkable.slice(0, targetOccFree),
  ];

  // Guarantee each occupiable type used appears at least twice (on different rows/cols if possible)
  const shuffledOccSpots = rng.shuffle(chosenOccupiables);
  const typeCount = Math.min(
    occupiablePool.length,
    Math.max(2, Math.floor(shuffledOccSpots.length / 2))
  );
  const activeOccPool = occupiablePool.slice(0, typeCount);

  shuffledOccSpots.forEach((pos, idx) => {
    const kind = activeOccPool[idx % activeOccPool.length];
    grid[pos.r][pos.c].occupiable = kind;
  });
}
